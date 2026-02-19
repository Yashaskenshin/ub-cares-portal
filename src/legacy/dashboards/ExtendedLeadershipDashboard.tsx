import { useState } from 'react'
import { MapPin, TrendingUp, Target, BarChart3, RefreshCw, Globe, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import DashboardPersonaSelector from '../components/DashboardPersonaSelector'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// import { DashboardProps } from '../types'
import { MockDataService } from '../services/mockDataService'
import { DataLoader } from '../services/dataLoader'

// Color palette for Regional dashboard
const CHART_COLORS = {
  north: '#3b82f6',     // Blue for North
  south: '#10b981',     // Green for South
  east: '#f59e0b',      // Orange for East
  west: '#ec4899',      // Pink for West
  primary: '#6366f1',   // Indigo
  secondary: '#8b5cf6', // Purple
  warning: '#f59e0b',   // Amber
  danger: '#ef4444'     // Red
}

export default function ExtendedLeadershipDashboard({ isLoading: externalLoading }: any) {
  const [internalLoading, setInternalLoading] = useState(false)
  const [selectedZone, setSelectedZone] = useState<string>('all')
  const [selectedState, setSelectedState] = useState<string>('all')
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const isLoading = externalLoading || internalLoading

  // Load regional data from real data if available
  const dataSummary = DataLoader.getDataSummary()
  const useRealData = dataSummary && dataSummary.totalRecords > 50


  const regionalSummary = MockDataService.getRegionalSummary()
  const stateHeatmap = MockDataService.getStateHeatmap()
  const zoneData = useRealData ? dataSummary.zones : MockDataService.getZoneComplaintData()

  // Regional KPIs
  const regionalKPIs = {
    totalRegions: 4,
    statesCovered: 15,
    avgSLAAdherence: 86.2,
    topPerformingRegion: 'South India',
    riskHotspots: 8,
    repeatIssueRate: 14.7
  }

  const handleRefresh = async () => {
    setInternalLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error refreshing regional dashboard:', error)
    } finally {
      setInternalLoading(false)
    }
  }

  // Filter data based on zone/state selection
  const getFilteredRegionalData = () => {
    if (selectedZone === 'all') return regionalSummary
    return regionalSummary.filter(region => region.region.toLowerCase().includes(selectedZone.toLowerCase()))
  }

  const getFilteredStateData = () => {
    if (selectedState === 'all') return stateHeatmap
    return stateHeatmap.filter(state => state.x.toLowerCase().includes(selectedState.toLowerCase()))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Regional Governance Dashboard</h1>
                <p className="text-sm text-gray-600 flex items-center mt-0.5">
                  <MapPin className="h-3 w-3 mr-1.5" />
                  Extended Leadership • Region-first visibility & SLA discipline
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Zone Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Zone:</label>
                <select
                  value={selectedZone}
                  onChange={(e) => {
                    setSelectedZone(e.target.value)
                    setSelectedState('all')
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">All Zones</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                </select>
              </div>

              {/* State Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">State:</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">All States</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="tamil">Tamil Nadu</option>
                  <option value="delhi">Delhi</option>
                </select>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{regionalKPIs.statesCovered} states monitored</div>
                <div className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                title="Refresh regional data"
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

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading regional governance data...</p>
              <p className="text-sm text-gray-500 mt-2">Analyzing zone-wise performance and SLA metrics</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Regional KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Regions */}
              <Card className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Globe className="h-6 w-6" />
                  </div>
                  <Badge label={`${regionalKPIs.totalRegions} zones`} variant="info" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{regionalKPIs.totalRegions}</h3>
                  <p className="text-cyan-100 text-sm font-medium">Regions Covered</p>
                </div>
                <div className="flex items-center text-xs text-cyan-100 mt-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>North, South, East, West India</span>
                </div>
              </Card>

              {/* Avg SLA Adherence */}
              <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <Badge label={`${regionalKPIs.avgSLAAdherence.toFixed(1)}%`} variant="success" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{regionalKPIs.avgSLAAdherence.toFixed(1)}%</h3>
                  <p className="text-green-100 text-sm font-medium">Avg SLA Compliance</p>
                </div>
                <div className="flex items-center text-xs text-green-100 mt-3">
                  <Target className="h-3 w-3 mr-1" />
                  <span>Across all regions</span>
                </div>
              </Card>

              {/* Risk Hotspots */}
              <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <Badge label={`${regionalKPIs.riskHotspots} active`} variant="warning" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{regionalKPIs.riskHotspots}</h3>
                  <p className="text-orange-100 text-sm font-medium">Risk Hotspots</p>
                </div>
                <div className="flex items-center text-xs text-orange-100 mt-3">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span>State-level alerts</span>
                </div>
              </Card>

              {/* Repeat Issue Rate */}
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <Badge label={`${regionalKPIs.repeatIssueRate.toFixed(1)}%`} variant="info" />
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold">{regionalKPIs.repeatIssueRate.toFixed(1)}%</h3>
                  <p className="text-blue-100 text-sm font-medium">Repeat Issues</p>
                </div>
                <div className="flex items-center text-xs text-blue-100 mt-3">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  <span>Recurring problems</span>
                </div>
              </Card>
            </div>

            {/* Regional Summary Table */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Regional Performance Summary</h3>
                  <p className="text-sm text-gray-600 mt-1">Zone & state-wise complaint metrics and SLA tracking</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaints</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escalations</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Issue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredRegionalData().map((region, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${region.region.includes('North') ? 'bg-blue-500' :
                              region.region.includes('South') ? 'bg-green-500' :
                                region.region.includes('East') ? 'bg-orange-500' : 'bg-pink-500'
                              }`}></div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{region.region}</div>
                              <div className="text-sm text-gray-500">{region.complaints} total</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{region.complaints.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">~{Math.floor(region.complaints / 30)} per day</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            label={`${region.slaPercent.toFixed(1)}%`}
                            variant={region.slaPercent >= 90 ? 'success' : region.slaPercent >= 80 ? 'warning' : 'danger'}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{region.escalations}</div>
                          <div className="text-sm text-gray-500">({((region.escalations / region.complaints) * 100).toFixed(1)}% rate)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{region.topIssue}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${region.slaPercent >= 90 ? 'bg-green-100 text-green-800' :
                            region.slaPercent >= 80 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {region.slaPercent >= 90 ? 'Excellent' : region.slaPercent >= 80 ? 'Good' : 'Needs Attention'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* State-Level Heatmap and Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* State-Level Heatmap */}
              <Card className="p-6 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">State-Level Performance Heatmap</h3>
                    <p className="text-sm text-gray-600 mt-1">Complaint density with SLA overlay</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {getFilteredStateData().map((state, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${state.x.includes('Maharashtra') ? 'bg-pink-500' :
                            state.x.includes('Karnataka') ? 'bg-green-500' :
                              state.x.includes('Tamil') ? 'bg-orange-500' :
                                state.x.includes('Delhi') ? 'bg-blue-500' : 'bg-purple-500'
                            }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{state.x}</p>
                            <p className="text-xs text-gray-600">{state.y}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900">{state.value}</div>
                          <div className="text-xs text-gray-500">complaints</div>
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((state.value / 400) * 100, 100)}%`,
                              backgroundColor: state.risk === 'critical' ? '#ef4444' :
                                state.risk === 'high' ? '#f59e0b' :
                                  state.risk === 'medium' ? '#3b82f6' : '#10b981'
                            }}
                          ></div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${state.risk === 'critical' ? 'bg-red-100 text-red-800' :
                          state.risk === 'high' ? 'bg-orange-100 text-orange-800' :
                            state.risk === 'medium' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {state.risk}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Issue Distribution by Region */}
              <Card className="p-6 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Issue Distribution by Region</h3>
                    <p className="text-sm text-gray-600 mt-1">Top complaint categories across zones</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={zoneData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill={CHART_COLORS.secondary} radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                {/* Regional Insights */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Highest Volume</p>
                    <p className="text-lg font-bold text-blue-600">South India</p>
                    <p className="text-xs text-blue-700">4,523 complaints</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Best SLA</p>
                    <p className="text-lg font-bold text-green-600">South India</p>
                    <p className="text-xs text-green-700">89.7% compliance</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Region-Issue-SKU Hotspot Analysis */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Region-Issue-SKU Hotspot Analysis</h3>
                  <p className="text-sm text-gray-600 mt-1">Deep-dive into specific problem areas requiring attention</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hotspot 1 */}
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Critical Hotspot</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Region:</strong> Bangalore Brewery</p>
                    <p className="text-sm"><strong>Issue:</strong> Sediment Beer</p>
                    <p className="text-sm"><strong>SKU:</strong> Kingfisher Premium 650ml</p>
                    <p className="text-sm"><strong>Impact:</strong> 89 complaints</p>
                    <Badge label="Immediate Action Required" variant="danger" />
                  </div>
                </div>

                {/* Hotspot 2 */}
                <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">High Priority</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Region:</strong> Pune Brewery</p>
                    <p className="text-sm"><strong>Issue:</strong> Underfilled Bottles</p>
                    <p className="text-sm"><strong>SKU:</strong> Tuborg Green 650ml</p>
                    <p className="text-sm"><strong>Impact:</strong> 76 complaints</p>
                    <Badge label="Monitor Closely" variant="warning" />
                  </div>
                </div>

                {/* Hotspot 3 */}
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Watch List</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Region:</strong> Chennai Brewery</p>
                    <p className="text-sm"><strong>Issue:</strong> Label Misalignment</p>
                    <p className="text-sm"><strong>SKU:</strong> Budweiser 650ml</p>
                    <p className="text-sm"><strong>Impact:</strong> 65 complaints</p>
                    <Badge label="Track Progress" variant="info" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Regional Governance Summary */}
            <Card className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <Globe className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-cyan-900 mb-2 text-lg">Regional Governance Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-cyan-800">
                    <div>
                      <p>• <strong>{regionalKPIs.statesCovered} states</strong> across 4 zones under active monitoring</p>
                      <p>• <strong>{regionalKPIs.topPerformingRegion}</strong> leads with best SLA compliance (89.7%)</p>
                      <p>• <strong>{regionalKPIs.riskHotspots} state-level hotspots</strong> identified for immediate attention</p>
                    </div>
                    <div>
                      <p>• Average regional SLA adherence: <strong>{regionalKPIs.avgSLAAdherence.toFixed(1)}%</strong></p>
                      <p>• Repeat issue rate across regions: <strong>{regionalKPIs.repeatIssueRate.toFixed(1)}%</strong></p>
                      <p>• Zone-wise drill-down capabilities enable targeted interventions</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* BRD Compliance Notice */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">BRD-Compliant Regional Dashboard</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    This dashboard provides region-first visibility as specified in the BRD, with zone/state summary tables,
                    SLA discipline tracking, and repeat issue analysis. The hierarchical drill-down (Zone → State → Brewery)
                    enables extended leadership to focus on their specific geographic areas of responsibility.
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
