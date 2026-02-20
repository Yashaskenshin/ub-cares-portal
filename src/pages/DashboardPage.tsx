import { useState, useEffect } from 'react'
import { apiService, LiveMetrics } from '../services/apiService'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { AlertCircle, CheckCircle2, Clock, BarChart3, RefreshCcw, Activity } from 'lucide-react'

// Simple loading spinner
const Spinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
)

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<LiveMetrics | null>(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null)

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setUploading(true)
        setUploadStatus(null)

        try {
            // 1. Upload
            const uploadResult = await apiService.uploadFile(file)
            if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Upload failed')
            }

            // 2. Process
            setUploadStatus({ success: true, message: 'Processing data...' })
            const processResult = await apiService.processManualData(uploadResult.file.filename)

            if (processResult.success) {
                setUploadStatus({
                    success: true,
                    message: `Success! Processed: ${processResult.stats?.processed || '?'} records. Updated: ${processResult.stats?.updated || '?'} records.`
                })
                // Refresh metrics
                fetchData()
            } else {
                throw new Error(processResult.message || 'Processing failed')
            }
        } catch (err: any) {
            setUploadStatus({ success: false, message: err.message || 'Operation failed' })
        } finally {
            setUploading(false)
            // Reset file input
            event.target.value = ''
        }
    }

    if (loading && !metrics) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Spinner />
            </div>
        )
    }

    if (error && !metrics) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg m-4">
                <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                <h2 className="text-lg font-bold">Connection Error</h2>
                <p>{error}</p>
                <button
                    onClick={fetchData}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Live Operations Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Real-time insights from UB Care API • Source: {metrics?.data_source}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                    <button
                        onClick={fetchData}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="Refresh Data"
                    >
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Data Management Section */}
            <Card className="bg-blue-50 border-blue-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        Data Enrichment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-sm text-blue-600 mb-2">
                                Upload "Interaction Detail Report" (CSV) to fill API data gaps (State, Manufacturing Date, etc.)
                            </p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-600 file:text-white
                                hover:file:bg-blue-700
                                disabled:opacity-50 cursor-pointer"
                            />
                        </div>
                        {uploading && <Spinner />}
                    </div>
                    {uploadStatus && (
                        <div className={`mt-3 text-sm font-medium ${uploadStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                            {uploadStatus.success ? <CheckCircle2 className="inline h-4 w-4 mr-1" /> : <AlertCircle className="inline h-4 w-4 mr-1" />}
                            {uploadStatus.message}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.health_score}/100</div>
                        <p className="text-xs text-muted-foreground">Overall system health</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.capture.total_tickets}</div>
                        <p className="text-xs text-muted-foreground">
                            {metrics?.capture.incomplete_tickets} incomplete tickets
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Validation</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.validate.pending}</div>
                        <p className="text-xs text-muted-foreground">
                            {metrics?.validate.justified} justified / {metrics?.validate.unjustified} unjustified
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {metrics ? Math.round((metrics.resolve.tickets_closed / metrics.capture.total_tickets) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {metrics?.resolve.tickets_closed} closed of {metrics?.capture.total_tickets} total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Brewery League Table */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Brewery Performance League</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50 text-left">
                                        <th className="p-2 font-medium">Brewery</th>
                                        <th className="p-2 font-medium text-center">Open</th>
                                        <th className="p-2 font-medium text-center">Pending</th>
                                        <th className="p-2 font-medium text-center">Oldest (Days)</th>
                                        <th className="p-2 font-medium text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics?.league_table.slice(0, 10).map((brewery, i) => (
                                        <tr key={i} className="border-b hover:bg-gray-50">
                                            <td className="p-2 font-medium">{brewery.name}</td>
                                            <td className="p-2 text-center">{brewery.open_count}</td>
                                            <td className="p-2 text-center">{brewery.total_pending}</td>
                                            <td className="p-2 text-center text-red-600 font-bold">{brewery.oldest_days}</td>
                                            <td className="p-2 text-right">{brewery.status_icon}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* State Breakdown */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Validation Backlog by State</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(metrics?.validate.pending_by_state || {})
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 8)
                                .map(([state, count], i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="w-40 text-sm font-medium truncate" title={state}>{state}</div>
                                        <div className="flex-1 mx-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${Math.min((count / (Math.max(...Object.values(metrics?.validate.pending_by_state || { a: 1 })) * 1.2)) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="w-12 text-sm text-right font-medium">{count}</div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
