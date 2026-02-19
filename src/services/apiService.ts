/**
 * API Service - Connects to the backend live metrics API
 * This replaces the static CSV-based data loading with real-time API data.
 */

const API_BASE = 'http://localhost:3001/api'

export interface LiveMetrics {
    date: string
    health_score: number
    status: string
    data_source: string
    record_count: number
    generated_at: string
    capture: {
        total_tickets: number
        complete_tickets: number
        incomplete_tickets: number
        missing_customer_info: number
        missing_product_info: number
        missing_description: number
        priority_breakdown: Record<string, number>
        urgency_breakdown: Record<string, number>
    }
    allocate: {
        total_assigned: number
        completed: number
        pending: number
        overdue_count: number
        defect_breakdown: Record<string, number>
    }
    validate: {
        total_processed: number
        justified: number
        unjustified: number
        pending: number
        total_complaints: number
        pending_by_state: Record<string, number>
        pending_by_brewery: Record<string, number>
        all_defects_breakdown: Record<string, number>
    }
    resolve: {
        total_requiring_rca: number
        rca_initiated: number
        rca_completed: number
        tickets_closed: number
        oldest_open_days: number
    }
    league_table: Array<{
        name: string
        total_receiving: number
        total_pending: number
        justified: number
        unjustified: number
        open_count: number
        closed_count: number
        oldest_days: number
        status_icon: string
    }>
}

class ApiService {
    private cachedMetrics: LiveMetrics | null = null
    private lastFetchTime: number = 0
    private readonly CACHE_DURATION_MS = 30000 // 30 seconds

    /**
     * Fetch live metrics from the API
     */
    async getLiveMetrics(forceRefresh = false): Promise<LiveMetrics> {
        const now = Date.now()

        // Return cached data if fresh enough
        if (!forceRefresh && this.cachedMetrics && (now - this.lastFetchTime) < this.CACHE_DURATION_MS) {
            return this.cachedMetrics
        }

        try {
            const response = await fetch(`${API_BASE}/live-metrics`)
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`)
            }

            const data = await response.json()
            this.cachedMetrics = data
            this.lastFetchTime = now

            return data
        } catch (error) {
            console.error('Failed to fetch live metrics:', error)
            // Return cached data if available, even if stale
            if (this.cachedMetrics) {
                return this.cachedMetrics
            }
            throw error
        }
    }

    /**
     * Get dashboard-compatible data structure from live metrics
     */
    async getDashboardData() {
        const metrics = await this.getLiveMetrics()

        // Transform to dashboard-compatible structure
        return {
            totalComplaints: metrics.capture.total_tickets,
            justified: metrics.validate.justified,
            unjustified: metrics.validate.unjustified,
            pending: metrics.validate.pending,
            justificationRate: metrics.validate.total_processed > 0
                ? Math.round((metrics.validate.justified / metrics.validate.total_processed) * 100)
                : 0,
            resolutionRate: metrics.capture.total_tickets > 0
                ? Math.round((metrics.resolve.tickets_closed / metrics.capture.total_tickets) * 100)
                : 0,
            healthScore: metrics.health_score,
            dataSource: metrics.data_source,
            generatedAt: metrics.generated_at,
            breweryLeague: metrics.league_table,
            defectBreakdown: metrics.validate.all_defects_breakdown,
            pendingByState: metrics.validate.pending_by_state,
            pendingByBrewery: metrics.validate.pending_by_brewery
        }
    }

    /**
     * Check health of the API
     */
    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE}/health`)
            return response.ok
        } catch {
            return false
        }
    }

    /**
     * Upload a file to the server
     */
    async uploadFile(file: File): Promise<{ success: boolean, file: any, error?: string }> {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                body: formData
            })
            return await response.json()
        } catch (error) {
            console.error('Upload failed:', error)
            return { success: false, error: 'Upload failed' }
        }
    }

    /**
     * Trigger manual data processing for a given filename
     */
    async processManualData(filename: string): Promise<{ success: boolean, message: string, stats?: any }> {
        try {
            const response = await fetch(`${API_BASE}/process-manual-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filename })
            })
            return await response.json()
        } catch (error) {
            console.error('Processing failed:', error)
            throw error
        }
    }
}

export const apiService = new ApiService()
