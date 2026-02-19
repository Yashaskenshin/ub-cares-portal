import { useState } from 'react'
import { AlertCircle, CheckCircle2, TrendingUp, Activity, Zap, Target, BarChart3, RefreshCw, Crown, AlertTriangle, Download } from 'lucide-react'
import { logger } from '../utils/logger'
import Card from '../components/Card'
import Badge from '../components/Badge'
import BRDComplianceStatus, { BRD_REQUIREMENTS } from '../components/BRDComplianceStatus'
import DashboardPersonaSelector from '../components/DashboardPersonaSelector'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { DashboardProps } from '../types'
import { MockDataService } from '../services/mockDataService'
import { DataLoader } from '../services/dataLoader'
import { DataExportService } from '../services/dataExportService'
import DataValidationTester from '../components/DataValidationTester'

// Color palette for charts
const CHART_COLORS = {
  primary: '#7c3aed',    // Purple for CEO theme
  secondary: '#10b981',  // Green
  warning: '#f59e0b',    // Amber
  danger: '#ef4444',     // Red
  info: '#3b82f6',       // Blue
  success: '#06b6d4'     // Cyan
}

const PIE_COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#06b6d4', '#ec4899', '#14b8a6']
// @ts-ignore - Keeping for future use
const _UNUSED_PIE = PIE_COLORS;

export default function CEODashboard({
  user: _user,
  filters: _filters,
  onFiltersChange: _onFiltersChange,
  isLoading: externalLoading,
  lastUpdated: _lastUpdated
}: DashboardProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const isLoading = externalLoading || internalLoading

  // Load CEO-specific data from real data if available, otherwise use mock
  const dataSummary = DataLoader.getDataSummary()
  logger.info('🔍 CEO Dashboard - Data Summary:', dataSummary)
  logger.info('🔍 CEO Dashboard - Total Records:', dataSummary?.totalRecords)
  logger.info('🔍 CEO Dashboard - Metrics:', dataSummary?.metrics)

  const useRealData = dataSummary && dataSummary.totalRecords > 50 // Only use if we have real data
  logger.info('🔍 CEO Dashboard - Using Real Data?', useRealData)

  const metrics = useRealData
    ? {
      ...dataSummary.metrics
    }
    : MockDataService.getDashboardMetrics()

  const trendData = useRealData ? dataSummary.zones : MockDataService.getTrendData()
  const zoneData = useRealData ? dataSummary.zones : MockDataService.getZoneComplaintData()
  const categoryData = useRealData ? dataSummary.topCategories : MockDataService.getTopComplaintCategories()
  const riskHotspots = MockDataService.getRiskHotspots()

  // CEO-specific KPIs calculation
  const ceoKPIs = {
    totalComplaints: metrics.totalComplaints,
    complaintsPer10HL: metrics.complaintsPer10HL,
    overallSLAAdherence: metrics.overallSLAAdherence,
    escalationRate: metrics.escalationRate,
    activeHighRiskHotspots: metrics.activeHighRiskHotspots,
    resolutionRate: metrics.resolutionRate,
    openComplaints: metrics.openComplaints,
    slaBreachRate: metrics.slaBreachRate
  }

  // Calculate derived metrics
  const openRate = ceoKPIs.totalComplaints > 0 ? (ceoKPIs.openComplaints / ceoKPIs.totalComplaints) * 100 : 0
  // const resolvedCount = Math.floor(ceoKPIs.totalComplaints * (ceoKPIs.resolutionRate / 100))

  const handleRefresh = async () => {
    setInternalLoading(true)
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error refreshing CEO dashboard:', error)
    } finally {
      setInternalLoading(false)
    }
  }

  const handleExportForPowerBI = async () => {
    try {
      logger.info('🚀 Starting Power BI export...')
      await DataExportService.downloadAllCSVs()
      logger.info('✅ Power BI export completed!')
    } catch (error) {
      logger.error('❌ Power BI export failed:', error)
      alert('Export failed. Check console for details.')
    }
  }

  const handleDownloadInstructions = () => {
    const instructions = DataExportService.getPowerBIImportInstructions()
    const blob = new Blob([instructions], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')

    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `powerbi_import_guide_${timestamp}.txt`

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Executive Governance Dashboard</h1>
                <p className="text-sm text-gray-600 flex items-center mt-0.5">
                  <Activity className="h-3 w-3 mr-1.5" />
                  CEO / Managing Director • 30-60 second snapshot
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{ceoKPIs.totalComplaints.toLocaleString()} complaints</div>
                <div className="text-xs text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</div>
              </div>
              <button
                onClick={handleDownloadInstructions}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
                title="Download Power BI import guide"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={handleExportForPowerBI}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export data for Power BI"
              >
                📊 Export for Power BI
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                title="Refresh executive data"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
              <p className="text-xs mt-2 text-gray-600">
                💡 Use "📊 Export for Power BI" button to download processed data for advanced analytics
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

        {/* Dashboard Persona Selector */}
        <div className="mb-8">
          <DashboardPersonaSelector />
        </div>

        {/* Data Validation Tester - Temporary for testing cleaned data */}
        <div className="mb-8">
          <DataValidationTester />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading executive dashboard...</p>
              <p className="text-sm text-gray-500 mt-2">Analyzing system health and risk indicators</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Executive KPI Cards - 30 second snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Total Complaints */}
              <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <Badge label={`${openRate.toFixed(1)}% Open`} variant="info" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{ceoKPIs.totalComplaints.toLocaleString()}</h3>
                  <p className="text-purple-100 text-sm font-medium">Total Complaints</p>
                </div>
                <div className="flex items-center text-xs text-purple-100 mt-3">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  <span>All time system volume</span>
                </div>
              </Card>


              {/* SLA Adherence */}
              <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <Badge label={`${ceoKPIs.overallSLAAdherence.toFixed(1)}%`} variant="success" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{ceoKPIs.overallSLAAdherence.toFixed(1)}%</h3>
                  <p className="text-green-100 text-sm font-medium">SLA Adherence</p>
                </div>
                <div className="flex items-center text-xs text-green-100 mt-3">
                  <Target className="h-3 w-3 mr-1" />
                  <span>Overall system compliance</span>
                </div>
              </Card>

              {/* Escalation Rate */}
              <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <Badge label={`${ceoKPIs.escalationRate.toFixed(1)}%`} variant="warning" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{ceoKPIs.escalationRate.toFixed(1)}%</h3>
                  <p className="text-orange-100 text-sm font-medium">Escalation Rate</p>
                </div>
                <div className="flex items-center text-xs text-orange-100 mt-3">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span>Escalated complaints</span>
                </div>
              </Card>

              {/* High Risk Hotspots */}
              <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Zap className="h-6 w-6" />
                  </div>
                  <Badge label={`${ceoKPIs.activeHighRiskHotspots} active`} variant="danger" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{ceoKPIs.activeHighRiskHotspots}</h3>
                  <p className="text-red-100 text-sm font-medium">Risk Hotspots</p>
                </div>
                <div className="flex items-center text-xs text-red-100 mt-3">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span>Require immediate attention</span>
                </div>
              </Card>
            </div>

            {/* Critical Insights Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Complaint Source Split */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Complaint Source Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dataSummary?.zones || [
                        { name: 'Web', value: 50 },
                        { name: 'Client Portal', value: 50 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      innerRadius={50}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      <Cell fill={CHART_COLORS.primary} />
                      <Cell fill={CHART_COLORS.secondary} />
                      <Cell fill={CHART_COLORS.warning} />
                      <Cell fill={CHART_COLORS.danger} />
                    </Pie>
                    <Tooltip formatter={(value) => `${value} complaints`} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Top Complaint Categories */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top Complaint Categories</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData.slice(0, 5)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" tick={{ fontSize: 10 }} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Risk Heatmap Preview */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Critical Risk Hotspots</h3>
                <div className="space-y-3">
                  {riskHotspots.slice(0, 5).map((hotspot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{hotspot.x}</p>
                        <p className="text-xs text-gray-600">{hotspot.y}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${hotspot.risk === 'critical' ? 'bg-red-100 text-red-800' :
                          hotspot.risk === 'high' ? 'bg-orange-100 text-orange-800' :
                            hotspot.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {hotspot.value} cases
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Trend Analysis */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Complaint Trends (Last 30 Days)</h3>
                  <p className="text-sm text-gray-600 mt-1">Volume and SLA performance tracking</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="New Complaints"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: CHART_COLORS.primary, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="closed"
                    name="Resolved"
                    stroke={CHART_COLORS.success}
                    strokeWidth={3}
                    dot={{ fill: CHART_COLORS.success, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="slaBreaches"
                    name="SLA Breaches"
                    stroke={CHART_COLORS.danger}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: CHART_COLORS.danger, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Zone Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Geographic Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={zoneData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill={CHART_COLORS.secondary} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Executive Summary Card */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Crown className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-purple-900 mb-2 text-lg">Executive Summary</h4>
                    <div className="space-y-2 text-sm text-purple-800">
                      <p>• System handling <strong>{ceoKPIs.totalComplaints.toLocaleString()}</strong> complaints with <strong>{ceoKPIs.resolutionRate.toFixed(1)}%</strong> resolution rate</p>
                      <p>• <strong>{ceoKPIs.activeHighRiskHotspots}</strong> critical hotspots require immediate attention</p>
                      <p>• SLA performance at <strong>{ceoKPIs.overallSLAAdherence.toFixed(1)}%</strong> across all workflows</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* BRD Compliance Status */}
            <BRDComplianceStatus
              requirements={BRD_REQUIREMENTS.ceo}
              dashboardName="CEO Executive Governance Dashboard"
            />
          </div>
        )}
      </div>
    </div>
  )
}
