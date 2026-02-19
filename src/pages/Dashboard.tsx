import React, { useEffect, useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    CircularProgress,
    Grid,
    LinearProgress,
    Avatar,
    Divider
} from '@mui/material';
import {
    Assignment as ComplaintIcon,
    CheckCircle as ComplianceIcon,
    Assessment as ReportIcon,
    Warning as AlertIcon,
    TrendingUp as TrendIcon
} from '@mui/icons-material';

import { getMetrics } from '../services/api';

const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMetrics().then(data => {
            setMetrics(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress size={60} thickness={4} />
        </Box>
    );

    const StatCard = ({ title, value, icon, color, subtext }: any) => (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, md: 4 }, // Consistent padding
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendIcon sx={{ fontSize: 16, color: '#4ade80', mr: 0.5 }} />
                    <Typography variant="caption" sx={{ color: '#4ade80', fontWeight: 600 }}>{subtext}</Typography>
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
                    Welcome back. Here is your daily overview.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        title="Total Complaints"
                        value={metrics?.totalComplaints || 0}
                        icon={<ComplaintIcon />}
                        color="#6366f1"
                        subtext="+12% this week"
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        title="SLA Compliance"
                        value={`${metrics?.slaCompliance || 0}%`}
                        icon={<ComplianceIcon />}
                        color="#10b981"
                        subtext="Target: 90%"
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        title="Pending Actions"
                        value={metrics?.pendingActions || 0}
                        icon={<AlertIcon />}
                        color="#f43f5e"
                        subtext="Requires Attention"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>Complaint Status Breakdown</Typography>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Open (Active)</Typography>
                                <Typography variant="body2" fontWeight="bold">78%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={78} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Closed (Resolved)</Typography>
                                <Typography variant="body2" fontWeight="bold">15%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={15} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Escalated</Typography>
                                <Typography variant="body2" fontWeight="bold">7%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={7} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#f43f5e' } }} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>Quick Actions</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Latest Report Generated:
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mb: 3 }}>
                            {new Date(metrics?.lastUpdated).toLocaleDateString()}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            System Status: <Box component="span" sx={{ color: '#10b981', fontWeight: 'bold' }}>● Operational</Box>
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
export default Dashboard;
