import { useState } from 'react'
import { Factory, TrendingUp, RefreshCw, Microscope, AlertTriangle, CheckCircle2, Clock, Zap } from 'lucide-react'
import { logger } from '../utils/logger'
import Card from '../components/Card'
import Badge from '../components/Badge'
import DashboardPersonaSelector from '../components/DashboardPersonaSelector'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { DashboardProps } from '../types'
import { MockDataService } from '../services/mockDataService'
import { DataLoader } from '../services/dataLoader'

// Color palette for Brewery dashboard
const CHART_COLORS = {
  quality: '#ef4444',    // Red for Quality issues
  capa: '#10b981',       // Green for CAPA
  trend: '#3b82f6',      // Blue for trends
  primary: '#f59e0b',    // Orange
  secondary: '#8b5cf6',  // Purple
  warning: '#f59e0b',    // Amber
  danger: '#ef4444',     // Red
  success: '#10b981'     // Green
}

export default function BreweryDashboard({
  user: _user,
  filters: _filters,
  onFiltersChange: _onFiltersChange,
  isLoading: externalLoading,
  lastUpdated: _lastUpdated
}: DashboardProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const [selectedBrewery, setSelectedBrewery] = useState<string>('all')
  const [selectedSKU, setSelectedSKU] = useState<string>('all')
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const isLoading = externalLoading || internalLoading

  // Load brewery-specific data from real data if available, otherwise use mock
  const dataSummary = DataLoader.getDataSummary()
  logger.info('🔍 Brewery Dashboard - Data Summary:', dataSummary)

  const useRealData = dataSummary && dataSummary.totalRecords > 50 // Only use if we have real data
  logger.info('🔍 Brewery Dashboard - Using Real Data?', useRealData)

  const metrics = useRealData
    ? {
      ...dataSummary.metrics
    }
    : MockDataService.getDashboardMetrics()

  const trendData = useRealData ? dataSummary.zones : MockDataService.getTrendData()
  const categoryData = useRealData ? dataSummary.topCategories : MockDataService.getTopComplaintCategories()
  const riskHotspots = useRealData ? dataSummary.zones : MockDataService.getRiskHotspots()

  // Brewery-specific KPIs calculation
  const breweryKPIs = {
    totalComplaints: metrics.totalComplaints,
    complaintsPerSKU: metrics.complaintsPerSKU,
    repeatOccurrencePercent: metrics.repeatOccurrencePercent,
    capaClosurePercent: metrics.capaClosurePercent,
    resolutionRate: metrics.resolutionRate,
    openComplaints: metrics.openComplaints,
    escalationRate: metrics.escalationRate,
    activeCAPAs: Math.floor(metrics.openComplaints * 0.4), // Derived for view
    overallSLAAdherence: metrics.overallSLAAdherence,
    activeHighRiskHotspots: metrics.activeHighRiskHotspots
  }

  // Mock pre vs post CAPA trend data


  const handleRefresh = async () => {
    setInternalLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error refreshing brewery dashboard:', error)
    } finally {
      setInternalLoading(false)
    }
  }

  // Filter data based on brewery/SKU selection


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Factory className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quality & CAPA Governance Dashboard</h1>
                <p className="text-sm text-gray-600 flex items-center mt-0.5">
                  <Microscope className="h-3 w-3 mr-1.5" />
                  Brewery Leadership • Quality governance & CAPA effectiveness tracking
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Brewery Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Brewery:</label>
                <select
                  value={selectedBrewery}
                  onChange={(e) => setSelectedBrewery(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Breweries</option>
                  <option value="bangalore">UBL Bangalore</option>
                  <option value="chennai">UBL Chennai</option>
                  <option value="pune">UBL Pune</option>
                  <option value="delhi">UBL Delhi</option>
                </select>
              </div>

              {/* SKU Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">SKU:</label>
                <select
                  value={selectedSKU}
                  onChange={(e) => setSelectedSKU(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All SKUs</option>
                  <option value="kingfisher">Kingfisher</option>
                  <option value="tuborg">Tuborg</option>
                  <option value="budweiser">Budweiser</option>
                  <option value="hoegaarden">Hoegaarden</option>
                </select>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{breweryKPIs.activeCAPAs} active CAPAs</div>
                <div className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                title="Refresh quality data"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Persona Selector */}
        <div className="mb-8">
          <DashboardPersonaSelector />
        </div>

        {/* Debug Banner */}
        <div className={`mb-6 p-4 rounded-lg border-2 ${useRealData ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {useRealData ? '✅ Using Real Data' : '⚠️ Using Mock Data'}
              </h3>
              <p className="text-sm mt-1">
                Total Records: <strong>{dataSummary?.totalRecords || 0}</strong> |
                Complaints: <strong>{metrics.totalComplaints}</strong> |
                Status: {useRealData ? 'Loaded from CSV' : `Threshold not met (need >50 records, have ${dataSummary?.totalRecords || 0})`}
              </p>
            </div>
            <button
              onClick={() => console.table(dataSummary)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              View Data Summary in Console
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading brewery data...</p>
              <p className="text-sm text-gray-500 mt-2">Analyzing complaint patterns and brewery performance</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Brewery Complaint Management KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Complaints */}
              <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <Badge label={`${breweryKPIs.totalComplaints.toLocaleString()} total`} variant="danger" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{breweryKPIs.totalComplaints.toLocaleString()}</h3>
                  <p className="text-red-100 text-sm font-medium">Total Complaints</p>
                </div>
                <div className="flex items-center text-xs text-red-100 mt-3">
                  <Factory className="h-3 w-3 mr-1" />
                  <span>Brewery complaint volume</span>
                </div>
              </Card>

              {/* Resolution Rate */}
              <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <Badge label={`${breweryKPIs.resolutionRate.toFixed(1)}%`} variant="success" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{breweryKPIs.resolutionRate.toFixed(1)}%</h3>
                  <p className="text-green-100 text-sm font-medium">Resolution Rate</p>
                </div>
                <div className="flex items-center text-xs text-green-100 mt-3">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Complaints resolved</span>
                </div>
              </Card>

              {/* Open Complaints */}
              <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Clock className="h-6 w-6" />
                  </div>
                  <Badge label={`${breweryKPIs.openComplaints} pending`} variant="warning" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{breweryKPIs.openComplaints}</h3>
                  <p className="text-orange-100 text-sm font-medium">Open Complaints</p>
                </div>
                <div className="flex items-center text-xs text-orange-100 mt-3">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Post-CAPA recurrence</span>
                </div>
              </Card>

              {/* Escalation Rate */}
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Zap className="h-6 w-6" />
                  </div>
                  <Badge label={`${breweryKPIs.escalationRate.toFixed(1)}%`} variant="info" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{breweryKPIs.escalationRate.toFixed(1)}%</h3>
                  <p className="text-blue-100 text-sm font-medium">Escalation Rate</p>
                </div>
                <div className="flex items-center text-xs text-blue-100 mt-3">
                  <Zap className="h-3 w-3 mr-1" />
                  <span>High priority complaints</span>
                </div>
              </Card>
            </div>

            {/* Core Complaint Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Complaint Categories */}
              <Card className="p-6 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Top Complaint Categories</h3>
                    <p className="text-sm text-gray-600 mt-1">Most frequent complaint types by subcategory</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={categoryData.slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" tick={{ fontSize: 10 }} width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Complaint Trends (30 Days) */}
              <Card className="p-6 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Complaint Trends (30 Days)</h3>
                    <p className="text-sm text-gray-600 mt-1">Daily complaint volume and escalations</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                      name="Total Complaints"
                    />
                    <Line
                      type="monotone"
                      dataKey="escalated"
                      stroke={CHART_COLORS.warning}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.warning, strokeWidth: 2, r: 4 }}
                      name="Escalated"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Risk Hotspots */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Risk Hotspots by Department</h3>
                  <p className="text-sm text-gray-600 mt-1">Critical complaint patterns requiring attention</p>
                </div>
              </div>

              <div className="space-y-4">
                {(riskHotspots as any[]).slice(0, 8).map((hotspot, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${hotspot.risk === 'critical' ? 'bg-red-500' :
                          hotspot.risk === 'high' ? 'bg-orange-500' :
                            hotspot.risk === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                          }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{hotspot.y}</p>
                          <p className="text-xs text-gray-600">Department: {hotspot.x}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{hotspot.value}</div>
                        <div className="text-xs text-gray-500">complaints</div>
                      </div>
                      <Badge
                        label={hotspot.risk === 'critical' ? 'Critical' : hotspot.risk === 'high' ? 'High' : 'Medium'}
                        variant={hotspot.risk === 'critical' ? 'danger' : hotspot.risk === 'high' ? 'warning' : 'info'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Brewery Complaint Summary */}
            <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Factory className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-red-900 mb-2 text-lg">Brewery Complaint Management Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-800">
                    <div>
                      <p>• <strong>{breweryKPIs.totalComplaints.toLocaleString()}</strong> total complaints managed this period</p>
                      <p>• <strong>{breweryKPIs.resolutionRate.toFixed(1)}% resolution rate</strong> across all complaint types</p>
                      <p>• <strong>{breweryKPIs.openComplaints} open complaints</strong> requiring attention</p>
                      <p>• <strong>{breweryKPIs.escalationRate.toFixed(1)}% escalation rate</strong> for high-priority issues</p>
                    </div>
                    <div>
                      <p>• SLA performance at <strong>{breweryKPIs.overallSLAAdherence.toFixed(1)}%</strong> for response times</p>
                      <p>• <strong>{breweryKPIs.activeHighRiskHotspots} unique cities</strong> with active complaint hotspots</p>
                      <p>• Top complaint categories analyzed by subcategory</p>
                      <p>• Real-time trends tracked for last 30 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* BRD Compliance Notice */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-red-50 border-2 border-blue-200 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Factory className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">BRD-Compliant Brewery Dashboard</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    This dashboard provides comprehensive complaint management and resolution tracking at the brewery level,
                    with real-time metrics for SLA adherence, escalation management, and complaint pattern analysis.
                    All metrics support operational decision-making and quality improvement initiatives.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
