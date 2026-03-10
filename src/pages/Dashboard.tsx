import React, { useEffect, useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    CircularProgress,
    Grid,
    LinearProgress,
    Avatar,
    Divider,
    Alert
} from '@mui/material';
import {
    Assignment as ComplaintIcon,
    CheckCircle as ComplianceIcon,
    Assessment as ReportIcon,
    Warning as AlertIcon,
    TrendingUp as TrendIcon,
    HealthAndSafety as HealthIcon
} from '@mui/icons-material';

import { getMetrics, getHealth, getSyncStatus } from '../services/api';

const ExpandableBreweryRow = ({ row }: { row: any }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <React.Fragment>
            <tr
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onClick={() => setExpanded(!expanded)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <td style={{ padding: '12px 8px', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 16, mr: 1, display: 'inline-flex', justifyContent: 'center' }}>
                        {expanded ? '▼' : '▶'}
                    </Box>
                    {row.name}
                </td>
                <td style={{ padding: '12px 8px' }}>{row.total_receiving}</td>
                <td style={{ padding: '12px 8px' }}>{row.total_pending}</td>
                <td style={{ padding: '12px 8px' }}>{row.justified}</td>
                <td style={{ padding: '12px 8px' }}>{row.unjustified}</td>
                <td style={{ padding: '12px 8px', color: row.status_icon?.includes('!') ? '#f43f5e' : 'inherit' }}>
                    {row.status_icon}
                </td>
            </tr>
            {expanded && (
                <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <td colSpan={6} style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="text.secondary">Sent to CTC</Typography>
                                <Typography variant="body2" fontWeight={600}>{row.sent_to_ctc}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="text.secondary">Pending Sample</Typography>
                                <Typography variant="body2" fontWeight={600}>{row.pending_sample}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="text.secondary">Pending Info</Typography>
                                <Typography variant="body2" fontWeight={600}>{row.pending_approval}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="text.secondary">Missing Lab Action</Typography>
                                <Typography variant="body2" fontWeight={600} color={row.pending_lab > 0 ? '#f59e0b' : 'inherit'}>{row.pending_lab}</Typography>
                            </Grid>
                        </Grid>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};

const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [health, setHealth] = useState<any>(null);
    const [syncStatus, setSyncStatus] = useState<any>(null);

    useEffect(() => {
        const fetchMetrics = () => {
            getMetrics().then(data => {
                if (data.status === 'error' || data.error) {
                    setError(data.error || 'Failed to fetch metrics');
                } else {
                    setMetrics(data);
                }
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setError('Could not connect to backend API.');
                setLoading(false);
            });
        };

        const fetchStatus = async () => {
            try {
                const h = await getHealth();
                setHealth(h);
                const s = await getSyncStatus();
                setSyncStatus(s);
            } catch (e) {
                console.error("Failed to fetch status");
            }
        };

        fetchMetrics();
        fetchStatus();
        const interval = setInterval(() => {
            fetchMetrics();
            fetchStatus();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: 2 }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body1" color="text.secondary">Loading live operational metrics...</Typography>
        </Box>
    );

    const StatCard = ({ title, value, icon, color, subtext }: any) => (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, md: 4 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: color,
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: 'text.primary' }}>
                        {value}
                    </Typography>
                </Box>
                <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 48, height: 48, borderRadius: 2 }}>
                    {React.cloneElement(icon, { sx: { fontSize: 24 } })}
                </Avatar>
            </Box>

            {subtext && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{subtext}</Typography>
                </Box>
            )}
        </Paper>
    );

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Live operational health overview
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {!error && metrics && (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Total Complaints"
                                value={metrics.record_count?.toLocaleString() || 0}
                                icon={<ComplaintIcon />}
                                color="#6366f1"
                                subtext={`From ${metrics.data_source || 'latest sync'}`}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="System Health Score"
                                value={`${metrics.health_score || 0}`}
                                icon={<HealthIcon />}
                                color={metrics.health_score >= 80 ? "#10b981" : metrics.health_score >= 60 ? "#f59e0b" : "#ef4444"}
                                subtext="Out of 100 (Weighted Average)"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                title="Pending RCA / Justification"
                                value={(metrics.resolve?.total_requiring_rca - metrics.resolve?.rca_completed) + metrics.validate?.pending || 0}
                                icon={<AlertIcon />}
                                color="#f43f5e"
                                subtext="Requires Attention"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 4, height: '100%' }}>
                                <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>Operational Stages</Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Data Capture Completeness</Typography>
                                        <Typography variant="body2" fontWeight="bold">{metrics.capture?.completeness_rate || 0}%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={metrics.capture?.completeness_rate || 0} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Missing fields trigger manual fallbacks.</Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Logistics Pickup Completion</Typography>
                                        <Typography variant="body2" fontWeight="bold">{metrics.allocate?.completion_rate || 0}%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={metrics.allocate?.completion_rate || 0} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Overdue Pickups: {metrics.allocate?.overdue_count || 0}</Typography>
                                </Box>

                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Brewery RCA Initiation Rate</Typography>
                                        <Typography variant="body2" fontWeight="bold">{metrics.resolve?.rca_initiation_rate || 0}%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={metrics.resolve?.rca_initiation_rate || 0} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Target is &gt;80% to avoid SLA breaches.</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Quick Details</Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Last Data Sync:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {metrics.date}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Processed Source:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', bgcolor: 'rgba(255,255,255,0.05)', p: 1, borderRadius: 1 }}>
                                        {metrics.data_source}
                                    </Typography>
                                </Box>

                                {syncStatus && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            SQLite DB Records:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {syncStatus.total_records?.toLocaleString()}
                                        </Typography>
                                        {syncStatus.last_sync ? (
                                            <Box sx={{ p: 1.5, bgcolor: 'rgba(16, 185, 129, 0.08)', borderRadius: 1, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                                <Typography variant="caption" sx={{ color: '#10b981', display: 'block', fontWeight: 600, mb: 0.5 }}>
                                                    Last Sync: {new Date(syncStatus.last_sync).toLocaleString()}
                                                </Typography>
                                                {syncStatus.last_operation && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Fetched: {syncStatus.last_operation.records_fetched} &nbsp;·&nbsp; Inserted: {syncStatus.last_operation.records_inserted} &nbsp;·&nbsp; Updated: {syncStatus.last_operation.records_updated}
                                                    </Typography>
                                                )}
                                            </Box>
                                        ) : (
                                            <Box sx={{ p: 1.5, bgcolor: 'rgba(239, 68, 68, 0.08)', borderRadius: 1, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                                <Typography variant="caption" sx={{ color: '#ef4444' }}>
                                                    No sync recorded yet
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                )}

                                <Divider sx={{ my: 'auto', opacity: 0 }} />
                                <Box sx={{ p: 2, bgcolor: health?.status === 'ok' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: 2, border: `1px solid ${health?.status === 'ok' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box component="span" sx={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', bgcolor: health?.status === 'ok' ? '#10b981' : '#ef4444', mr: 1, animation: health?.status === 'ok' ? 'pulse 2s infinite' : 'none' }} />
                                        {health?.status === 'ok' ? `Backend System Online (Uptime: ${Math.floor((health?.uptime || 0) / 3600)}h)` : 'Backend System Offline'}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 4, mt: 2 }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Brewery League Table</Typography>
                                <Box sx={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                                <th style={{ padding: '12px 8px' }}>Brewery</th>
                                                <th style={{ padding: '12px 8px' }}>Total Complaints</th>
                                                <th style={{ padding: '12px 8px' }}>Pending Validation</th>
                                                <th style={{ padding: '12px 8px' }}>Justified</th>
                                                <th style={{ padding: '12px 8px' }}>Unjustified</th>
                                                <th style={{ padding: '12px 8px' }}>Action Required</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {metrics.league_table?.map((row: any, idx: number) => (
                                                <ExpandableBreweryRow key={idx} row={row} />
                                            ))}
                                            {(!metrics.league_table || metrics.league_table.length === 0) && (
                                                <tr>
                                                    <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                                        No brewery data available.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
};
export default Dashboard;
