import { useState } from 'react'
import { TrendingUp, AlertTriangle, Target, BarChart3, RefreshCw, Microscope, Factory, ShoppingCart, Zap } from 'lucide-react'
import { logger } from '../utils/logger'
import Card from '../components/Card'
import Badge from '../components/Badge'
import DashboardPersonaSelector from '../components/DashboardPersonaSelector'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { DashboardProps } from '../types'
import { MockDataService } from '../services/mockDataService'
import { DataLoader } from '../services/dataLoader'

// Color palette for CXO dashboard
const CHART_COLORS = {
  quality: '#10b981',    // Green for Quality
  sales: '#3b82f6',      // Blue for Sales
  supply: '#f59e0b',     // Orange for Supply Chain
  marketing: '#ec4899',  // Pink for Marketing
  primary: '#6366f1',    // Indigo
  secondary: '#8b5cf6',  // Purple
  warning: '#f59e0b',    // Amber
  danger: '#ef4444'      // Red
}

export default function CXODashboard({
  user: _user,
  filters: _filters,
  onFiltersChange: _onFiltersChange,
  isLoading: externalLoading,
  lastUpdated: _lastUpdated
}: DashboardProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const [selectedFunction, setSelectedFunction] = useState<string>('all')
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const isLoading = externalLoading || internalLoading

  // Load CXO-specific data from real data if available, otherwise use mock
  const dataSummary = DataLoader.getDataSummary()
  logger.info('🔍 CXO Dashboard - Data Summary:', dataSummary)

  const useRealData = dataSummary && dataSummary.totalRecords > 50 // Only use if we have real data
  logger.info('🔍 CXO Dashboard - Using Real Data?', useRealData)

  const metrics = useRealData
    ? {
      ...dataSummary.metrics
    }
    : MockDataService.getDashboardMetrics()

  const trendData = useRealData ? dataSummary.zones : MockDataService.getTrendData()
  const categoryData = useRealData ? dataSummary.topCategories : MockDataService.getTopComplaintCategories()

  const skuBreweryHeatmap = MockDataService.getSKUBreweryHeatmap()
  const slaComplianceData = MockDataService.getSLAComplianceData()
  const escalationFunnel = MockDataService.getEscalationFunnel()

  // CXO-specific KPIs calculation
  const getFunctionalDetails = (role: string) => {
    switch (role) {
      case 'cxo_quality': return { color: CHART_COLORS.quality, icon: Microscope, focus: 'Quality Compliance' }
      case 'cxo_sales': return { color: CHART_COLORS.sales, icon: ShoppingCart, focus: 'Sales Performance' }
      case 'cxo_supply_chain': return { color: CHART_COLORS.supply, icon: Factory, focus: 'Supply Chain Distribution' }
      case 'cxo_marketing': return { color: CHART_COLORS.marketing, icon: Zap, focus: 'Brand Perception' }
      default: return { color: CHART_COLORS.primary, icon: BarChart3, focus: 'Cross-functional Governance' }
    }
  }

  const functionalDetails = getFunctionalDetails(_user.role)

  const cxoKPIs = {
    totalComplaints: metrics.totalComplaints,
    issueContributionPercent: metrics.issueContributionPercent,
    repeatComplaintRate: metrics.repeatComplaintRate,
    avgRCATAT: metrics.avgRCATAT,
    slaCompliancePercent: metrics.slaCompliancePercent,
    escalationRate: metrics.escalationRate,
    resolutionRate: metrics.resolutionRate,
    openComplaints: metrics.openComplaints,
    ...functionalDetails
  }

  const handleRefresh = async () => {
    setInternalLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error refreshing CXO dashboard:', error)
    } finally {
      setInternalLoading(false)
    }
  }

  // Filter data based on selected function
  const getFilteredData = () => {
    if (selectedFunction === 'all') return categoryData
    // In real implementation, this would filter by function/department
    return categoryData.slice(0, Math.floor(categoryData.length * 0.7))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CXO Governance Dashboard</h1>
                <p className="text-sm text-gray-600 flex items-center mt-0.5">
                  <BarChart3 className="h-3 w-3 mr-1.5" />
                  Executive Leadership • Cross-functional governance & risk management
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Function Filter */}
              <select
                value={selectedFunction}
                onChange={(e) => setSelectedFunction(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Functions</option>
                <option value="quality">Quality</option>
                <option value="sales">Sales</option>
                <option value="supply">Supply Chain</option>
                <option value="marketing">Marketing</option>
              </select>

              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{metrics.totalComplaints.toLocaleString()} total issues</div>
                <div className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                title="Refresh functional data"
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
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading functional governance data...</p>
              <p className="text-sm text-gray-500 mt-2">Analyzing cross-functional performance and risks</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* CXO Complaint Management KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Complaints */}
              <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <Badge label={`${cxoKPIs.totalComplaints.toLocaleString()} total`} variant="danger" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{cxoKPIs.totalComplaints.toLocaleString()}</h3>
                  <p className="text-red-100 text-sm font-medium">Total Complaints</p>
                </div>
                <div className="flex items-center text-xs text-red-100 mt-3">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  <span>Cross-functional complaint volume</span>
                </div>
              </Card>

              {/* Resolution Rate */}
              <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <Badge label={`${cxoKPIs.resolutionRate.toFixed(1)}%`} variant="success" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{cxoKPIs.resolutionRate.toFixed(1)}%</h3>
                  <p className="text-green-100 text-sm font-medium">Resolution Rate</p>
                </div>
                <div className="flex items-center text-xs text-green-100 mt-3">
                  <Target className="h-3 w-3 mr-1" />
                  <span>Complaints resolved</span>
                </div>
              </Card>

              {/* SLA Adherence */}
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <Badge label={`${cxoKPIs.slaCompliancePercent.toFixed(1)}%`} variant="info" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{cxoKPIs.slaCompliancePercent.toFixed(1)}%</h3>
                  <p className="text-blue-100 text-sm font-medium">SLA Adherence</p>
                </div>
                <div className="flex items-center text-xs text-blue-100 mt-3">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Response time compliance</span>
                </div>
              </Card>

              {/* Escalation Rate */}
              <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Zap className="h-6 w-6" />
                  </div>
                  <Badge label={`${cxoKPIs.escalationRate.toFixed(1)}%`} variant="warning" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{cxoKPIs.escalationRate.toFixed(1)}%</h3>
                  <p className="text-orange-100 text-sm font-medium">Escalation Rate</p>
                </div>
                <div className="flex items-center text-xs text-orange-100 mt-3">
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
                  <BarChart data={getFilteredData()} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" tick={{ fontSize: 10 }} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill={cxoKPIs.totalComplaints > 0 ? CHART_COLORS.primary : CHART_COLORS.secondary} radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* SKU-Brewery Heatmap */}
              <Card className="p-6 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">SKU-Brewery Performance Heatmap</h3>
                    <p className="text-sm text-gray-600 mt-1">Complaint density by product and location</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {skuBreweryHeatmap.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.x}</p>
                        <p className="text-xs text-gray-600">{item.y}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((item.value / 200) * 100, 100)}%`,
                              backgroundColor: item.risk === 'critical' ? '#ef4444' :
                                item.risk === 'high' ? '#f59e0b' :
                                  item.risk === 'medium' ? '#3b82f6' : '#10b981'
                            }}
                          ></div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.risk === 'critical' ? 'bg-red-100 text-red-800' :
                          item.risk === 'high' ? 'bg-orange-100 text-orange-800' :
                            item.risk === 'medium' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* SLA & Escalation Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SLA Compliance by Stage */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">SLA Compliance by Stage</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={slaComplianceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name.split(' ')[0]}: ${percentage}%`}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {slaComplianceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={[CHART_COLORS.quality, CHART_COLORS.sales, CHART_COLORS.supply, CHART_COLORS.marketing][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Escalation Funnel */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Escalation Funnel</h3>
                <div className="space-y-4">
                  {escalationFunnel.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-red-500' :
                          index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                          }`}></div>
                        <span className="text-sm font-medium text-gray-900">{stage.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">{stage.count}</span>
                        <span className="text-xs text-gray-500 ml-2">({stage.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Month-on-Month Trends */}
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">MoM Trend Diagnostics</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData.slice(-6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke={cxoKPIs.color}
                      strokeWidth={2}
                      dot={{ fill: cxoKPIs.color, r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="escalated"
                      stroke={CHART_COLORS.danger}
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      dot={{ fill: CHART_COLORS.danger, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Function-Specific Insights */}
            <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <cxoKPIs.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-indigo-900 mb-2 text-lg">Functional Governance Summary - {cxoKPIs.focus}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
                    <div>
                      <p>• <strong>{cxoKPIs.issueContributionPercent.toFixed(1)}%</strong> of total system issues attributed to function</p>
                      <p>• <strong>{cxoKPIs.repeatComplaintRate.toFixed(1)}%</strong> repeat complaint rate indicates systemic issues</p>
                      <p>• Average RCA turnaround: <strong>{cxoKPIs.avgRCATAT.toFixed(1)} days</strong></p>
                    </div>
                    <div>
                      <p>• SLA compliance: <strong>{cxoKPIs.slaCompliancePercent.toFixed(1)}%</strong> across all workflows</p>
                      <p>• Top risk areas identified in SKU-brewery analysis</p>
                      <p>• Escalation trends showing <strong>{escalationFunnel[0].percentage}%</strong> L1 conversion rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* BRD Compliance Notice */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">BRD-Compliant CXO Dashboard</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    This dashboard enables function-wise governance as specified in the BRD, identifying recurring issues,
                    systemic risks, and prioritization areas. All visualizations support drill-down to SKU/brewery level
                    and will automatically populate with real data integration.
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
