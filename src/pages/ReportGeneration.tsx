import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    IconButton,
    Tooltip,
    Grid,
    Card,
    CardContent,
    CardActions,
    Divider,
    Container,
    FormControlLabel,
    Checkbox,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    SelectChangeEvent
} from '@mui/material';
import {
    Download as DownloadIcon,
    Description as FileIcon,
    TableChart as CsvIcon,
    Refresh as RefreshIcon,
    History as HistoryIcon,
    Star as StarIcon,
    AccessTime as TimeIcon,
    AutoGraph as AIIcon,
    WorkspacePremium as LeadershipIcon,
    TrendingUp as ROIIcon,
    CompareArrows,
    CompareArrows as TrendingUpIcon
} from '@mui/icons-material';

import { getReports, generateReport, getDbDateRange, getSourceFiles, API_BASE_URL } from '../services/api';

const ReportGeneration: React.FC = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [generating, setGenerating] = useState(false);
    const [useAI, setUseAI] = useState(false);
    const [useLeadershipBrief, setUseLeadershipBrief] = useState(true);
    const [useROIReport, setUseROIReport] = useState(false);
    const [useComparisonReport, setUseComparisonReport] = useState(false);
    const [showAllArchive, setShowAllArchive] = useState(false);
    const [useFullDateRange, setUseFullDateRange] = useState(false);

    const [lastSourceFile, setLastSourceFile] = useState<string | null>(null);

    // Source Files
    const [sourceFiles, setSourceFiles] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<string>('');

    // DB Data Range
    const [dbRange, setDbRange] = useState<{ min_date: string, max_date: string } | null>(null);

    // Date range state - default to last 30 days
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const [fromDate, setFromDate] = useState<string>(thirtyDaysAgo);
    const [toDate, setToDate] = useState<string>(today);

    const fetchReports = () => {
        getReports().then(data => setReports(data.reports));
        getDbDateRange().then(data => setDbRange(data));
        getSourceFiles().then(data => setSourceFiles(data.files || []));
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        setLastSourceFile(null);

        const result = await generateReport(
            useAI,
            useLeadershipBrief,
            useROIReport,
            useComparisonReport,
            useFullDateRange ? undefined : fromDate,
            useFullDateRange ? undefined : toDate,
            selectedFile || undefined
        );
        setGenerating(false);
        if (result && result.report && result.report.sourceFile) {
            setLastSourceFile(result.report.sourceFile);
        }
        fetchReports();
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (filename: string) => {
        if (filename.endsWith('.csv')) return <CsvIcon color="success" />;
        return <FileIcon color="primary" />;
    };

    const getReportType = (filename: string) => {
        if (filename.includes('daily_brief')) return <Chip label="Brief" color="primary" size="small" variant="outlined" />;
        if (filename.includes('corrections')) return <Chip label="Corrections" color="warning" size="small" variant="outlined" />;
        if (filename.includes('brewery')) return <Chip label="Brewery" color="secondary" size="small" variant="outlined" />;
        if (filename.includes('pending_info')) return <Chip label="Info Gap" color="info" size="small" variant="outlined" />;
        if (filename.includes('Sequel_Pickup')) return <Chip label="Pickup" color="success" size="small" variant="outlined" />;
        if (filename.includes('roi_weekly_brief')) return <Chip label="ROI Report" color="error" size="small" variant="outlined" />;
        if (filename.includes('leadership_brief')) return <Chip label="Leadership" style={{ borderColor: '#eab308', color: '#eab308' }} size="small" variant="outlined" />;
        if (filename.includes('strategic_comparison')) return <Chip label="Strategic" style={{ borderColor: '#10b981', color: '#10b981' }} size="small" variant="outlined" />;
        return <Chip label="Report" size="small" variant="outlined" />;
    };

    // Split reports into Latest (Hero) and History
    // We assume the API returns sorted by date DESC, but let's be safe.
    // The "Latest Brief" is the most recent file starting with "daily_brief_"
    const latestBrief = reports.find(r => r.filename.startsWith('daily_brief_'));
    const history = reports.filter(r => r !== latestBrief);

    // Pagination / Collapse Logic
    const displayedHistory = showAllArchive ? history : history.slice(0, 15);

    return (
        <Box>
            {/* Header & Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Reports Center
                </Typography>
                <Box>
                    <IconButton onClick={fetchReports} sx={{ mr: 1, color: 'text.secondary' }}>
                        <RefreshIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        {/* Source File Selector */}
                        <FormControl size="small" sx={{ minWidth: 250 }}>
                            <InputLabel id="source-file-label">Source File (CSV)</InputLabel>
                            <Select
                                labelId="source-file-label"
                                value={selectedFile}
                                label="Source File (CSV)"
                                onChange={(e) => setSelectedFile(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Auto-detect (Latest File)</em>
                                </MenuItem>
                                {sourceFiles.map((f) => (
                                    <MenuItem key={f.name} value={f.name}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body2">{f.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(f.date).toLocaleString()} • {Math.round(f.size / 1024)} KB
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Database Data Range Display */}
                        {dbRange && (
                            <Paper sx={{ p: '4px 12px', bgcolor: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography variant="caption" color="primary" fontWeight="bold">
                                    DATA AVAILABLE
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                    {dbRange.min_date ? new Date(dbRange.min_date).toLocaleDateString() : 'N/A'}
                                    {' — '}
                                    {dbRange.max_date ? new Date(dbRange.max_date).toLocaleDateString() : 'N/A'}
                                </Typography>
                            </Paper>
                        )}

                        {/* Date Range Inputs */}
                        <TextField
                            label="From Date"
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            size="small"
                            variant="outlined"
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ width: 150 }}
                        />
                        <TextField
                            label="To Date"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            size="small"
                            variant="outlined"
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ width: 150 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={useAI}
                                    onChange={(e) => setUseAI(e.target.checked)}
                                    color="primary"
                                    size="small"
                                    sx={{ color: 'rgba(99, 102, 241, 0.5)' }}
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AIIcon fontSize="inherit" color="action" /> Enable AI Deep Analysis
                                </Typography>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={useLeadershipBrief}
                                    onChange={(e) => setUseLeadershipBrief(e.target.checked)}
                                    color="primary"
                                    size="small"
                                    sx={{ color: 'rgba(234, 179, 8, 0.8)' }}
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LeadershipIcon fontSize="inherit" sx={{ color: '#eab308' }} /> Generate Leadership Brief
                                </Typography>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={useROIReport}
                                    onChange={(e) => setUseROIReport(e.target.checked)}
                                    color="primary"
                                    size="small"
                                    sx={{ color: 'rgba(239, 68, 68, 0.8)' }}
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <ROIIcon fontSize="inherit" sx={{ color: '#ef4444' }} /> Generate ROI Report
                                </Typography>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={useComparisonReport}
                                    onChange={(e) => setUseComparisonReport(e.target.checked)}
                                    color="primary"
                                    size="small"
                                    sx={{ color: 'rgba(16, 185, 129, 0.8)' }}
                                />
                            }
                            label={
                                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <TrendingUpIcon fontSize="inherit" sx={{ color: '#10b981' }} /> Compare (MoM)
                                </Typography>
                            }
                        />
                        <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 20, alignSelf: 'center' }} />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={useFullDateRange}
                                    onChange={(e) => setUseFullDateRange(e.target.checked)}
                                    color="secondary"
                                    size="small"
                                />
                            }
                            label={
                                <Tooltip title="Ignore date selectors and process ALL data in the file">
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        PROCESS FULL FILE
                                    </Typography>
                                </Tooltip>
                            }
                        />
                        <Button
                            variant="contained"
                            onClick={handleGenerate}
                            disabled={generating}
                            sx={{
                                background: 'linear-gradient(45deg, #4f46e5, #6366f1)',
                                boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)'
                            }}
                        >
                            {generating ? 'Generating...' : 'Generate New Brief'}
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Success Message with Source File */}
            {lastSourceFile && (
                <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ color: 'success.main' }}>
                        ✅ <strong>Success!</strong> Report generated using source file: <u>{lastSourceFile}</u>
                    </Typography>
                </Box>
            )}

            {/* HERO SECTION: The Latest Brief */}
            {latestBrief && (
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{
                            position: 'relative',
                            overflow: 'hidden'
                        }}>

                            <CardContent sx={{ p: 4 }}>
                                <Grid container alignItems="center" spacing={4}>
                                    <Grid size="auto">
                                        <Box sx={{
                                            width: 80, height: 80,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(99, 102, 241, 0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            mb: { xs: 2, md: 0 }
                                        }}>
                                            <StarIcon sx={{ fontSize: 40, color: '#818cf8' }} />
                                        </Box>
                                    </Grid>
                                    <Grid size="grow">
                                        <BannerLabel>LATEST DAILY BRIEF</BannerLabel>
                                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                                            {latestBrief.filename}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <TimeIcon fontSize="small" />
                                                <Typography variant="body2">Generated: {new Date(latestBrief.generated).toLocaleString()}</Typography>
                                            </Box>
                                            <Chip label={formatSize(latestBrief.size)} size="small" variant="outlined" sx={{ color: 'text.secondary', borderColor: 'rgba(255,255,255,0.2)' }} />
                                        </Box>
                                    </Grid>
                                    <Grid size="auto">
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<DownloadIcon />}
                                            href={`${API_BASE_URL}/api/reports/${latestBrief.filename}`}
                                            sx={{
                                                py: 1.5, px: 4,
                                                fontSize: '1.1rem',
                                                borderRadius: 3,
                                                bgcolor: 'white',
                                                color: 'black',
                                                '&:hover': { bgcolor: 'grey.100' }
                                            }}
                                        >
                                            Download Brief
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* ARCHIVE SECTION */}
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <HistoryIcon /> Archive & Support Files
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Type</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Filename</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Generated</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Size</TableCell>
                            <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedHistory.map((report) => (
                            <TableRow
                                key={report.filename}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                                }}
                            >
                                <TableCell>{getReportType(report.filename)}</TableCell>
                                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {getFileIcon(report.filename)}
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{report.filename}</Typography>
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>
                                    {new Date(report.generated).toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                    {formatSize(report.size)}
                                </TableCell>
                                <TableCell align="right">
                                    <ArrowButton href={`${API_BASE_URL}/api/reports/${report.filename}`}>
                                        <DownloadIcon fontSize="small" />
                                    </ArrowButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {/* Show More / Less Row */}
                        {history.length > 5 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Button
                                        onClick={() => setShowAllArchive(!showAllArchive)}
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        {showAllArchive ? 'Show Less' : `Show All (${history.length})`}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        {reports.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                                    No reports generated yet. Click "Generate" to start.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

const BannerLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography variant="caption" sx={{
        letterSpacing: 2,
        fontWeight: 700,
        color: '#818cf8',
        textTransform: 'uppercase',
        display: 'block',
        mb: 1
    }}>
        {children}
    </Typography>
);

const ArrowButton = (props: any) => (
    <IconButton
        size="small"
        sx={{ border: '1px solid rgba(255,255,255,0.1)', color: 'text.secondary' }}
        {...props}
    >
        {props.children}
    </IconButton>
);
export default ReportGeneration;
