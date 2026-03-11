// Use Vite environment variable, fallback to localhost in dev, or Railway URL in production
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : 'https://ubcares-production.up.railway.app');
const API_URL = `${API_BASE_URL}/api`;

// Helper to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
    const token = sessionStorage.getItem('jwtToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders()
        },
        body: formData,
    });
    return response.json();
};

export const getMetrics = async () => {
    const response = await fetch(`${API_URL}/live-metrics`);
    return response.json();
};

export const saveManualInputs = async (inputs: any) => {
    const response = await fetch(`${API_URL}/manual-inputs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(inputs)
    });
    return response.json();
};

export const getManualInputs = async () => {
    const response = await fetch(`${API_URL}/manual-inputs`, {
        headers: { ...getAuthHeaders() }
    });
    return response.json();
};

export const generateReport = async (
    useAI: boolean = false,
    useLeadershipBrief: boolean = false,
    useROIReport: boolean = false,
    useComparisonReport: boolean = false,
    fromDate?: string,
    toDate?: string,
    filename?: string,
    appendRoiToLeadership: boolean = false,
    useBatchAlert: boolean = false,
    batchThreshold: number = 3
) => {
    try {
        const response = await fetch(`${API_URL}/generate-report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({
                useAI,
                useLeadershipBrief,
                useROIReport,
                useComparisonReport,
                fromDate,
                toDate,
                filename,
                appendRoiToLeadership,
                useBatchAlert,
                batchThreshold
            })
        });
        if (!response.ok) {
            const errText = await response.text();
            return { success: false, error: `Server error (${response.status}): ${errText.slice(0, 200)}` };
        }
        return response.json();
    } catch (err: any) {
        return { success: false, error: err.message || 'Network error connecting to the server.' };
    }
};

export const getSourceFiles = async () => {
    const response = await fetch(`${API_URL}/files`, {
        headers: { ...getAuthHeaders() }
    });
    return response.json();
};

export const getDbDateRange = async () => {
    const response = await fetch(`${API_URL}/db/range?t=${new Date().getTime()}`);
    return response.json();
};

export const getReports = async () => {
    const response = await fetch(`${API_URL}/reports?t=${new Date().getTime()}`, {
        headers: { ...getAuthHeaders() }
    });
    return response.json();
};

export const getHealth = async () => {
    try {
        const response = await fetch(`${API_URL}/health`);
        return await response.json();
    } catch (e) {
        return { status: 'error' };
    }
};

export const getSyncStatus = async () => {
    try {
        const response = await fetch(`${API_URL}/sync/status`, {
            headers: { ...getAuthHeaders() }
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
};
