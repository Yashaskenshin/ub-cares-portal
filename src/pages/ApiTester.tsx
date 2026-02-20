import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    CloudSync as SyncIcon,
    Storage as StorageIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Code as CodeIcon
} from '@mui/icons-material';

import { API_BASE_URL } from '../services/api';
const API_URL = `${API_BASE_URL}/api`;

const ApiTester: React.FC = () => {
    // State
    const [health, setHealth] = useState<any>(null);
    const [healthLoading, setHealthLoading] = useState(false);

    const [syncStatus, setSyncStatus] = useState<any>(null);
    const [syncLoading, setSyncLoading] = useState(false);
    const [fullSyncLoading, setFullSyncLoading] = useState(false);
    const [syncResult, setSyncResult] = useState<any>(null);

    const [records, setRecords] = useState<any[]>([]);
    const [recordsLoading, setRecordsLoading] = useState(false);

    // Initial load
    useEffect(() => {
        fetchSyncStatus();
        fetchRecords();
    }, []);

    // Actions
    const checkHealth = async () => {
        setHealthLoading(true);
        try {
            const res = await fetch(`${API_URL}/health/upstream`);
            const data = await res.json();
            setHealth(data);
        } catch (err) {
            setHealth({ overall_status: 'error', error: 'Failed to contact backend' });
        } finally {
            setHealthLoading(false);
        }
    };

    const fetchSyncStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/sync/status`);
            const data = await res.json();
            setSyncStatus(data);
        } catch (err) {
            console.error(err);
        }
    };

    const triggerSync = async (mode: 'full' | 'incremental' = 'incremental') => {
        if (mode === 'full') setFullSyncLoading(true);
        else setSyncLoading(true);

        setSyncResult(null);
        try {
            const res = await fetch(`${API_URL}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode })
            });
            const data = await res.json();
            setSyncResult(data);
            fetchSyncStatus(); // Refresh status
            fetchRecords(); // Refresh records
        } catch (err) {
            setSyncResult({ success: false, message: 'Sync request failed' });
        } finally {
            if (mode === 'full') setFullSyncLoading(false);
            else setSyncLoading(false);
        }
    };

    const fetchRecords = async () => {
        setRecordsLoading(true);
        try {
            const res = await fetch(`${API_URL}/db/records?limit=10`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setRecords(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setRecordsLoading(false);
        }
    };

    // Render Helpers
    const getStatusColor = (status: string) => {
        if (!status) return 'default';
        switch (status.toLowerCase()) {
            case 'healthy':
            case 'pass':
            case 'success':
                return 'success';
            case 'warning':
                return 'warning';
            case 'error':
            case 'fail':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        if (!status) return null;
        switch (status.toLowerCase()) {
            case 'healthy':
            case 'pass':
            case 'success':
                return <CheckCircleIcon fontSize="small" />;
            case 'warning':
                return <WarningIcon fontSize="small" />;
            case 'error':
            case 'fail':
                return <ErrorIcon fontSize="small" />;
            default:
                return null;
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CodeIcon fontSize="large" color="primary" /> API Tester & System Status
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Verify API connectivity, data synchronization, and database integrity.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* 1. API Health Check */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            title="API Health Monitor"
                            subheader="Check upstream UB Care API status"
                            action={
                                <Button
                                    variant="outlined"
                                    startIcon={healthLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
                                    onClick={checkHealth}
                                    disabled={healthLoading}
                                >
                                    Check Now
                                </Button>
                            }
                        />
                        <Divider />
                        <CardContent>
                            {!health ? (
                                <Alert severity="info">Click "Check Now" to run diagnostics.</Alert>
                            ) : (
                                <Box>
                                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="h6">Overall Status:</Typography>
                                        <Chip
                                            icon={getStatusIcon(health.overall_status)}
                                            label={health.overall_status?.toUpperCase() || 'UNKNOWN'}
                                            color={getStatusColor(health.overall_status) as any}
                                            variant="filled"
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {health.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}
                                        </Typography>
                                    </Box>

                                    {health.checks && Object.entries(health.checks).map(([key, value]: [string, any]) => (
                                        <Box key={key} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>{key}</Typography>
                                                <Chip
                                                    size="small"
                                                    label={value.status?.toUpperCase()}
                                                    color={getStatusColor(value.status) as any}
                                                    variant="outlined"
                                                />
                                            </Box>
                                            {value.status !== 'pass' && (
                                                <Typography variant="body2" color="error" sx={{ fontSize: '0.85rem' }}>
                                                    {value.message}
                                                    {value.missing_columns && `Missing: ${value.missing_columns.join(', ')}`}
                                                    {value.sample_empty_fields && `Empty Fields: ${value.sample_empty_fields.join(', ')}`}
                                                </Typography>
                                            )}
                                            {value.status === 'pass' && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {key === 'connectivity' && `${value.response_time_ms}ms response`}
                                                    {key === 'format' && `${value.row_count} rows, ${value.column_count} cols`}
                                                    {key === 'schema' && `All required columns present`}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 2. Data Sync Status */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            title="Data Synchronization"
                            subheader="Sync API data to local SQLite database"
                            action={
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={fullSyncLoading ? <CircularProgress size={16} color="inherit" /> : <StorageIcon />}
                                        onClick={() => triggerSync('full')}
                                        disabled={syncLoading || fullSyncLoading}
                                    >
                                        Full Sync
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={syncLoading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
                                        onClick={() => triggerSync('incremental')}
                                        disabled={syncLoading || fullSyncLoading}
                                        color="primary"
                                    >
                                        Sync Updates
                                    </Button>
                                </Box>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(99, 102, 241, 0.08)' }} elevation={0}>
                                            <Typography variant="h4" color="primary.main" fontWeight="bold">
                                                {syncStatus?.total_records || 0}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">Total Records in DB</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }} elevation={0}>
                                            <Typography variant="body2" color="text.primary" fontWeight="medium">
                                                {syncStatus?.last_sync ? new Date(syncStatus.last_sync).toLocaleString() : 'Never'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">Last Sync Time</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>

                            {syncResult && (
                                <Alert
                                    severity={syncResult.success ? 'success' : 'error'}
                                    sx={{ mb: 3 }}
                                >
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {syncResult.message}
                                    </Typography>
                                    {syncResult.results && (
                                        <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                                            <Chip size="small" label={`Fetched: ${syncResult.results.fetched || 0}`} />
                                            <Chip size="small" label={`Inserted: ${syncResult.results.inserted || 0}`} color="success" />
                                            <Chip size="small" label={`Updated: ${syncResult.results.updated || 0}`} color="info" />
                                        </Box>
                                    )}
                                </Alert>
                            )}

                            {syncStatus?.last_operation && !syncResult && (
                                <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                                    <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary', fontWeight: 'bold' }}>
                                        Last Operation Stats
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body2">Fetched: {syncStatus.last_operation.records_fetched}</Typography>
                                        <Typography variant="body2">Inserted: {syncStatus.last_operation.records_inserted}</Typography>
                                        <Typography variant="body2">Updated: {syncStatus.last_operation.records_updated}</Typography>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 3. Live Data Preview */}
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title="Live Data Preview"
                            subheader="Recent records flow (Latest 10)"
                            avatar={<StorageIcon color="action" />}
                            action={
                                <Button startIcon={<RefreshIcon />} size="small" onClick={fetchRecords}>Refresh</Button>
                            }
                        />
                        <Divider />
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Interaction ID</TableCell>
                                        <TableCell>Date Created</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Sub Category</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Branch</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recordsLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                                <CircularProgress size={24} /> <Typography variant="caption" sx={{ ml: 1 }}>Loading data...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : records.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                                No records found. Try syncing first.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        records.map((row: any, i) => (
                                            <TableRow key={i} hover>
                                                <TableCell sx={{ fontFamily: 'monospace' }}>
                                                    {row['Interaction ID'] || row['Check'] || 'N/A'}
                                                </TableCell>
                                                <TableCell>{row['Date Created']}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row['Status']}
                                                        size="small"
                                                        color={row['Status'] === 'Closed' ? 'success' : 'warning'}
                                                        variant="outlined"
                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                    />
                                                </TableCell>
                                                <TableCell>{row['Category']}</TableCell>
                                                <TableCell>{row['Sub Category']}</TableCell>
                                                <TableCell>{row['Priority']}</TableCell>
                                                <TableCell>{row['Branch']}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ApiTester;
