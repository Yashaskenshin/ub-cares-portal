import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2, Clock, TrendingUp, BarChart3, RefreshCw, Bell, Users, Target, Zap, Activity } from 'lucide-react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { DataProcessor, ComplaintRecord } from '../utils/dataProcessor'

// Load complaint data
const loadComplaintData = async (): Promise<ComplaintRecord[]> => {
  try {
    // Load CSV data from public directory
    const response = await fetch('/data/interaction_detail_report.csv')
    const csvText = await response.text()
    const rows = csvText.split('\n').slice(1) // Skip header

    const data = rows
      .filter(row => row.trim())
      .map(row => {
        const cols = row.split(',')
        return {
          'Check': cols[0]?.trim(),
          'Source': cols[1]?.trim(),
          'Client Info': cols[2]?.trim(),
          'Location': cols[3]?.trim(),
          'Branch': cols[4]?.trim(),
          'Department': cols[5]?.trim(),
          'Campaign': cols[6]?.trim(),
          'Team': cols[7]?.trim(),
          'Agent': cols[8]?.trim(),
          'Complexity': cols[9]?.trim(),
          'Type': cols[10]?.trim(),
          'Category': cols[11]?.trim(),
          'Sub Category': cols[12]?.trim(),
          'Status': cols[13]?.trim(),
          'State': cols[14]?.trim(),
          'Impact': cols[15]?.trim(),
          'Priority': cols[16]?.trim(),
          'Urgency': cols[17]?.trim(),
          'Date Created': cols[18]?.trim(),
          'Last Modified Date': cols[19]?.trim(),
          'Date Closed': cols[20]?.trim(),
          'Rating': cols[21]?.trim(),
          'Is Secondary': cols[22]?.trim(),
          'Expected Response Time (sec)': cols[23]?.trim(),
          'Expected Resolution Time (sec)': cols[24]?.trim(),
          'Actual Response Time (Date/Time)': cols[25]?.trim(),
          'Actual Response Time (sec)': cols[26]?.trim(),
          'Actual Resolution Time (Date/Time)': cols[27]?.trim(),
          'Actual Resolution Time (sec)': cols[28]?.trim(),
          'Response Time Escalated': cols[29]?.trim(),
          'Resolution Time Escalated': cols[30]?.trim(),
          'Response Escalation Time': cols[31]?.trim(),
          'Resolution Escalation Time': cols[32]?.trim(),
          'Interaction Type': cols[33]?.trim(),
          'Parent Interaction ID': cols[34]?.trim(),
          'Child Interaction IDs': cols[35]?.trim(),
          'Are you a Consumer or a Customer?': cols[36]?.trim(),
          'Batch No': cols[37]?.trim(),
          'Brand type': cols[38]?.trim(),
          'City': cols[39]?.trim(),
          'Descriptions': cols[40]?.trim(),
          'Do you have the product with you?': cols[41]?.trim(),
          'Email Address': cols[42]?.trim(),
          'First Name': cols[43]?.trim(),
          'How many products were affected?': cols[44]?.trim(),
          'Last Name': cols[45]?.trim(),
          'Manufacturing Date': cols[46]?.trim(),
          'Manufacturing Location': cols[47]?.trim(),
          'Outlet Name': cols[48]?.trim(),
          'Pack Size': cols[49]?.trim(),
          'Phone Number': cols[50]?.trim(),
          'SFA Ticket ID': cols[51]?.trim(),
          'SKU': cols[52]?.trim()
        }
      })

    return DataProcessor.processComplaintData(data)
  } catch (error) {
    console.error('Error loading complaint data:', error)
    return []
  }
}

// Color palette for charts
const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#8b5cf6',
  success: '#06b6d4'
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6']

// ============= MAIN COMPONENT =============

export default function Dashboard() {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Load complaint data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await loadComplaintData()
        setComplaints(data)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const data = await loadComplaintData()
      setComplaints(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate dashboard metrics
  const metrics = DataProcessor.getDashboardMetrics(complaints)
  const categoryData = DataProcessor.getCategoryBreakdown(complaints)
  const statusData = DataProcessor.getStatusBreakdown(complaints)
  const locationData = DataProcessor.getLocationBreakdown(complaints)
  const priorityData = DataProcessor.getPriorityBreakdown(complaints)
  const agentData = DataProcessor.getAgentPerformance(complaints)
  const sourceData = DataProcessor.getSourceBreakdown(complaints)
  const trendData = DataProcessor.getTrendData(complaints)
  const typeData = DataProcessor.getTypeBreakdown(complaints)
  const brandData = DataProcessor.getBrandBreakdown(complaints)
  const avgResolutionTime = DataProcessor.getAverageResolutionTime(complaints)

  // Calculate additional metrics
  const openRate = complaints.length > 0 ? (metrics.openComplaints / complaints.length) * 100 : 0
  const escalationRate = complaints.length > 0 ? (metrics.escalatedComplaints / complaints.length) * 100 : 0

  // Render main dashboard
  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Header Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <AlertCircle className="h-5 w-5" />
              </div>
              <Badge label={`${openRate.toFixed(1)}% Open`} variant="info" />
            </div>
            <div className="mb-1">
              <h3 className="text-3xl font-bold">{metrics.totalComplaints.toLocaleString()}</h3>
              <p className="text-blue-100 text-sm font-medium">Total Complaints</p>
            </div>
            <div className="flex items-center text-xs text-blue-100 mt-2">
              <Activity className="h-3 w-3 mr-1" />
              <span>All time records</span>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <Badge label={`${metrics.resolutionRate.toFixed(1)}%`} variant="success" />
            </div>
            <div className="mb-1">
              <h3 className="text-3xl font-bold">{metrics.closedComplaints.toLocaleString()}</h3>
              <p className="text-green-100 text-sm font-medium">Resolved</p>
            </div>
            <div className="flex items-center text-xs text-green-100 mt-2">
              <Target className="h-3 w-3 mr-1" />
              <span>Avg: {avgResolutionTime} days</span>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock className="h-5 w-5" />
              </div>
              <Badge label={`${metrics.slaBreachRate.toFixed(1)}%`} variant="warning" />
            </div>
            <div className="mb-1">
              <h3 className="text-3xl font-bold">{metrics.slaBreachCount.toLocaleString()}</h3>
              <p className="text-yellow-100 text-sm font-medium">SLA Breaches</p>
            </div>
            <div className="flex items-center text-xs text-yellow-100 mt-2">
              <Zap className="h-3 w-3 mr-1" />
              <span>Requires attention</span>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-5 w-5" />
              </div>
              <Badge label={`${escalationRate.toFixed(1)}%`} variant="danger" />
            </div>
            <div className="mb-1">
              <h3 className="text-3xl font-bold">{metrics.escalatedComplaints.toLocaleString()}</h3>
              <p className="text-red-100 text-sm font-medium">Escalated</p>
            </div>
            <div className="flex items-center text-xs text-red-100 mt-2">
              <Users className="h-3 w-3 mr-1" />
              <span>Action needed</span>
            </div>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Open Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.openComplaints}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-gray-900">{avgResolutionTime} days</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{agentData.length}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Trend Chart */}
        {trendData.length > 0 && (
          <Card className="p-6 bg-white shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Complaint Trends (Last 30 Days)</h3>
                <p className="text-sm text-gray-600 mt-1">Daily complaint volume and resolution tracking</p>
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
                  dataKey="escalated" 
                  name="Escalated" 
                  stroke={CHART_COLORS.danger} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: CHART_COLORS.danger, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Charts Grid Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="p-6 bg-white shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${Math.round(percentage)}%`}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Priority Breakdown */}
          <Card className="p-6 bg-white shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
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
                <Bar dataKey="count" fill={CHART_COLORS.warning} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Grid Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card className="p-6 bg-white shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Complaint Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" tick={{ fontSize: 11 }} width={120} />
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

          {/* Source Breakdown */}
          <Card className="p-6 bg-white shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Complaint Sources</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${Math.round(percentage)}%`}
                  outerRadius={100}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {sourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Grid Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Performance */}
          {agentData.length > 0 && (
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Agent Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Total" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="closed" name="Resolved" fill={CHART_COLORS.success} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="escalated" name="Escalated" fill={CHART_COLORS.danger} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Type Breakdown */}
          <Card className="p-6 bg-white shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Complaint Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill={CHART_COLORS.info} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Location and Brand Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <Card className="p-6 bg-white shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Geographic Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
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

          {/* Brand Breakdown */}
          {brandData.length > 0 && (
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Affected Brands</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={brandData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" stroke="#6b7280" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill={CHART_COLORS.warning} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {/* Data Quality Notice */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 shadow-md">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Bell className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-900 mb-2 text-lg">Data Quality Enhancement in Progress</h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                This dashboard displays current data with known inconsistencies (batch format variations, future dates, missing values).
                Data cleanup is being performed in parallel to improve accuracy. All metrics are calculated from the available data
                and will automatically improve as data quality enhancements are completed.
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">UB Cares Complaint Dashboard</h1>
                <p className="text-sm text-gray-600 flex items-center mt-0.5">
                  <Activity className="h-3 w-3 mr-1.5" />
                  Real-time analytics & insights
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{complaints.length.toLocaleString()} records</div>
                <div className="text-xs text-gray-500">Updated: {lastUpdated.toLocaleTimeString()}</div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading complaint data...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we process your data</p>
            </div>
          </div>
        ) : (
          renderDashboard()
        )}
      </div>
    </div>
  )
}
