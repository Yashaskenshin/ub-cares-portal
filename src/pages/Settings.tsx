
import React from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';


import { API_BASE_URL } from '../services/api';

const Settings: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>System Configuration</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                    <TextField label="API URL" defaultValue={API_BASE_URL} disabled />
                    <Button variant="contained" disabled>Save Settings</Button>
                </Box>
            </Paper>
        </Box>
    );
};
export default Settings;
