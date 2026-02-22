import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  Divider,
  Stack
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassIcon,
  Description as FileIcon
} from '@mui/icons-material';
import { uploadFile } from '../../services/api';

// Define expected schemas
const EXPECTED_HEADERS = {
  INTERACTION: ['Interaction ID', 'Status', 'Type', 'Category', 'Date Created'],
  LOGISTICS: ['Created Date', 'Interaction ID', 'Client ID', 'Status'],
  MANUAL_LOGISTICS: ['Interaction ID', 'Status'],
  GRASSROOTS: ['Open Point', 'Status']
};

interface ValidationResult {
  isValid: boolean;
  type: 'Interaction Report' | 'Logistics Report' | 'Logistics Manual Status' | 'Grassroots Priorities' | 'ROI Product Complaints' | 'Unknown';
  rowCount: number;
  issues: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'validating' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  validation?: ValidationResult;
}

const FileUploadZone: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState<string>('');

  const validateFile = (file: File): Promise<ValidationResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const allLines = text.split('\n');

        // Find the real header row (looking for 'Interaction ID' or known columns)
        let headerIndex = 0;
        let headers: string[] = [];

        for (let i = 0; i < Math.min(10, allLines.length); i++) {
          const line = allLines[i];
          const candidateHeaders = line.split(',').map(h => h.replace(/"/g, '').trim().replace(/^\uFEFF/, ''));

          // Check if this line looks like a header
          if (candidateHeaders.includes('Interaction ID') ||
            candidateHeaders.includes('Interaction_ID') ||
            candidateHeaders.includes('Open Point') ||
            candidateHeaders.includes('Complain_ID')) {
            headerIndex = i;
            headers = candidateHeaders;
            break;
          }
        }

        // If no header found, default to first line (will likely fail validation but show error)
        if (headers.length === 0) {
          headers = allLines[0]?.split(',').map(h => h.replace(/"/g, '').trim().replace(/^\uFEFF/, '')) || [];
        }

        const rowCount = allLines.length - 1 - headerIndex; // Exclude header/metadata

        const issues: string[] = [];
        let type: ValidationResult['type'] = 'Unknown';
        let isValid = false;

        // Check for Interaction Report
        if (headers.includes('Interaction ID') && headers.includes('Agent')) {
          type = 'Interaction Report';
          const missing = EXPECTED_HEADERS.INTERACTION.filter(h => !headers.includes(h));
          if (missing.length === 0) isValid = true;
          else issues.push(`Missing columns: ${missing.join(', ')}`);

          // Specific check for known issue
          if (headers.filter(h => h === 'State').length > 1) {
            issues.push("Duplicate 'State' header found (Critical)");
            isValid = false;
          }
        }
        // Check for Manual Logistics Status
        else if (headers.includes('Interaction ID') && (headers.includes('Status') || headers.includes('Pickup Status')) && !headers.includes('Agent')) {
          type = 'Logistics Manual Status';
          isValid = true;
        }
        // Check for Logistics Report (Legacy)
        else if (headers.includes('Client ID') || headers.includes('Child ID')) {
          type = 'Logistics Report';
          // Allow flexible headers for logistics as it changes often, but check key ones
          if (headers.includes('Interaction ID') || headers.includes('Interaction_ID')) {
            isValid = true;
          } else {
            issues.push("Missing 'Interaction ID' column");
          }
        }
        // Check for Grassroots Priorities
        else if (headers.includes('Open Point') && headers.includes('Status')) {
          type = 'Grassroots Priorities';
          isValid = true;
        }
        // Check for ROI Product Complaints
        else if ((headers.includes('Complain_ID') || headers.includes('Subzone')) && headers.includes('Brand')) {
          type = 'ROI Product Complaints';
          isValid = true;
        } else {
          console.log('Validation failed. Headers found:', headers);
          issues.push(`Unknown file format. Headers found: ${headers.slice(0, 5).join(', ')}...`);
        }

        if (rowCount < 1) {
          issues.push("File appears empty (0 rows)");
          isValid = false;
        }

        resolve({ isValid, type, rowCount, issues });
      };
      reader.onerror = () => resolve({ isValid: false, type: 'Unknown', rowCount: 0, issues: ['Read error'] });
      reader.readAsText(file); // Read full file for accurate row count
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadError('');

    for (const file of acceptedFiles) {
      const fileId = `${Date.now()}-${file.name}`;

      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'validating',
        progress: 10
      };

      setUploadedFiles(prev => [newFile, ...prev]);

      // 1. Validate
      const validation = await validateFile(file);

      setUploadedFiles(prev =>
        prev.map(f => f.id === fileId ? { ...f, validation, status: validation.isValid ? 'uploading' : 'error', error: validation.isValid ? undefined : 'Validation Failed' } : f)
      );

      if (!validation.isValid) continue; // Stop if invalid

      // 2. Upload
      try {
        setUploadedFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 40 } : f));
        await uploadFile(file);

        setUploadedFiles(prev =>
          prev.map(f => f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f)
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadedFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error', error: errorMessage } : f));
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxSize: 50 * 1024 * 1024,
    multiple: true
  });

  const getStatusIcon = (status: UploadedFile['status']) => {
    if (status === 'completed') return <CheckCircleIcon color="success" />;
    if (status === 'error') return <ErrorIcon color="error" />;
    if (status === 'validating') return <HourglassIcon color="info" />;
    return <CloudUploadIcon color="primary" />;
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'rgba(255, 255, 255, 0.2)',
          backgroundColor: isDragActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s',
          borderRadius: 4,
          mb: 4
        }}
        elevation={0}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2, opacity: 0.8 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isDragActive ? 'Drop files here...' : 'Drop Complaint Data Files'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          .csv files only (Max 50MB)
        </Typography>
      </Paper>

      {uploadedFiles.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Upload Activity</Typography>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {uploadedFiles.map((file) => (
              <Paper key={file.id} sx={{ p: 2, borderRadius: 2, bgcolor: file.status === 'error' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255,255,255,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ mt: 0.5 }}>{getStatusIcon(file.status)}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{file.name}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5, mb: 1 }}>
                      <Chip label={file.validation?.type || 'Unknown Type'} size="small" variant="outlined" color="primary" />
                      {file.validation?.isValid && <Chip label={`${file.validation.rowCount} Rows`} size="small" color="success" variant="outlined" />}
                      <Chip label={file.status.toUpperCase()} size="small" color={file.status === 'completed' ? 'success' : file.status === 'error' ? 'error' : 'default'} />
                    </Stack>

                    {file.validation?.issues && file.validation.issues.length > 0 && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
                        {file.validation.issues.map((issue, idx) => (
                          <Typography key={idx} variant="caption" color="error" display="block">
                            • {issue}
                          </Typography>
                        ))}
                      </Box>
                    )}

                    {file.status !== 'completed' && file.status !== 'error' && (
                      <LinearProgress variant="determinate" value={file.progress} sx={{ mt: 1, height: 6, borderRadius: 3 }} />
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadZone;