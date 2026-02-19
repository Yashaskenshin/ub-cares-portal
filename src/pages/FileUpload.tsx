
import React from 'react';
import { Box, Typography } from '@mui/material';
import FileUploadZone from '../components/FileUpload/FileUploadZone';

const FileUpload: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Upload Complaints Data</Typography>
            <FileUploadZone />
        </Box>
    );
};
export default FileUpload;
