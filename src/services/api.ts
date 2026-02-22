
// Use environment variable or fallback to localhost
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE_URL}/api`;

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });
    return response.json();
};

export const getMetrics = async () => {
    const response = await fetch(`${API_URL}/metrics`);
    return response.json();
};

export const saveManualInputs = async (inputs: any) => {
    const response = await fetch(`${API_URL}/manual-inputs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
    });
    return response.json();
};

export const getManualInputs = async () => {
    const response = await fetch(`${API_URL}/manual-inputs`);
    return response.json();
};

export const generateReport = async (
    useAI: boolean = false,
    useLeadershipBrief: boolean = false,
    useROIReport: boolean = false,
    useComparisonReport: boolean = false,
    fromDate?: string,
    toDate?: string,
    filename?: string
) => {
    const response = await fetch(`${API_URL}/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            useAI,
            useLeadershipBrief,
            useROIReport,
            useComparisonReport,
            fromDate,
            toDate,
            filename
        })
    });
    return response.json();
};

export const getSourceFiles = async () => {
    const response = await fetch(`${API_URL}/source-files`);
    return response.json();
};

export const getDbDateRange = async () => {
    const response = await fetch(`${API_URL}/db/range?t=${new Date().getTime()}`);
    return response.json();
};

export const getReports = async () => {
    const response = await fetch(`${API_URL}/reports?t=${new Date().getTime()}`);
    return response.json();
}
