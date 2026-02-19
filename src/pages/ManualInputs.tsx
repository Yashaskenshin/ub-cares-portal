
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import StakeholderForm from '../components/ManualInputs/StakeholderForm';
import { getManualInputs, saveManualInputs, generateReport } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ManualInputs: React.FC = () => {
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getManualInputs().then(data => {
            setInitialData(data);
            setLoading(false);
        });
    }, []);

    const handleSave = async (inputs: any) => {
        await saveManualInputs(inputs);
    };

    const handleGenerate = async (inputs: any) => {
        await saveManualInputs(inputs);
        await generateReport();
        navigate('/reports');
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Daily Manual Inputs</Typography>
            <StakeholderForm
                initialData={initialData}
                onSave={handleSave}
                onGenerateReport={handleGenerate}
            />
        </Box>
    );
};
export default ManualInputs;
