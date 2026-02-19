import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { validateFile, processUploadedFile } from '../services/fileProcessor';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validate file types
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json'
    ];

    const allowedExtensions = /\.(csv|xls|xlsx|json)$/i;

    if (allowedTypes.includes(file.mimetype) || allowedExtensions.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, Excel (.xls, .xlsx), and JSON files are allowed.'));
    }
  }
});

// File upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const file = req.file;

    // Validate file
    const validationResult = await validateFile(file);
    if (!validationResult.valid) {
      // Clean up invalid file
      await promisify(fs.unlink)(file.path);

      return res.status(400).json({
        success: false,
        error: validationResult.error,
        details: validationResult.details
      });
    }

    // Process file (basic validation)
    const processingResult = await processUploadedFile(file);

    // Save file metadata to database (simplified)
    const fileRecord = {
      id: Date.now().toString(),
      filename: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedBy: req.user?.id || 'anonymous',
      uploadDate: new Date(),
      processed: processingResult.success,
      processingResult: processingResult
    };

    // Here you would save to database
    console.log('File uploaded successfully:', fileRecord);

    res.json({
      success: true,
      file: {
        id: fileRecord.id,
        name: fileRecord.originalName,
        size: fileRecord.fileSize,
        type: fileRecord.fileType,
        uploadedAt: fileRecord.uploadDate,
        status: 'completed'
      },
      message: 'File uploaded and validated successfully'
    });

  } catch (error) {
    console.error('File upload error:', error);

    // Clean up file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      await promisify(fs.unlink)(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'File upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get upload history
router.get('/uploads', async (req, res) => {
  try {
    // In a real implementation, this would query the database
    // For now, return mock data
    const uploads = [
      {
        id: '1',
        filename: 'UB_Cares_Settlement_Workflow.csv',
        originalName: 'UB_Cares_Settlement_Workflow.csv',
        fileSize: 251163,
        uploadedAt: new Date(Date.now() - 86400000), // 1 day ago
        status: 'completed',
        processed: true
      },
      {
        id: '2',
        filename: 'manual_inputs_template.xlsx',
        originalName: 'manual_inputs_template.xlsx',
        fileSize: 45632,
        uploadedAt: new Date(Date.now() - 172800000), // 2 days ago
        status: 'completed',
        processed: true
      }
    ];

    res.json({
      success: true,
      uploads
    });

  } catch (error) {
    console.error('Get uploads error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve upload history'
    });
  }
});

// Delete uploaded file
router.delete('/uploads/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    // In a real implementation, you would:
    // 1. Check user permissions
    // 2. Find file record in database
    // 3. Delete file from filesystem
    // 4. Update database record

    // For now, just return success
    console.log(`File ${fileId} deletion requested`);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file'
    });
  }
});

export default router;