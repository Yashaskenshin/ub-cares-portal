import { useState } from 'react'
import { Scale, RefreshCw, AlertTriangle } from 'lucide-react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import DashboardPersonaSelector from '../components/DashboardPersonaSelector'
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
// import { DashboardProps } from '../types'
import { MockDataService } from '../services/mockDataService'
// import { DataLoader } from '../services/dataLoader'

// const CHART_COLORS = { primary: '#f59e0b', secondary: '#8b5cf6', warning: '#f59e0b', danger: '#ef4444', success: '#10b981' }

export default function GovernanceDashboard({ isLoading: externalLoading }: any) {
  const [internalLoading, setInternalLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const isLoading = externalLoading || internalLoading
  const slaMatrix = MockDataService.getSLAMatrix()

  const handleRefresh = async () => {
    setInternalLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastRefresh(new Date())
    } catch (error) { console.error('Error refreshing governance dashboard:', error) }
    finally { setInternalLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SLA & Escalation Governance Dashboard</h1>
                <p className="text-sm text-gray-600 flex items-center mt-0.5">
                  <AlertTriangle className="h-3 w-3 mr-1.5" />
                  Governance / CTC Teams • SLA discipline & escalation control
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">End-to-end SLA tracking</div>
                <div className="text-xs text-gray-500">Updated: {lastRefresh.toLocaleTimeString()}</div>
              </div>
              <button onClick={handleRefresh} disabled={isLoading} className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50">
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Persona Selector */}
        <div className="mb-8">
          <DashboardPersonaSelector />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading SLA governance data...</p>
              <p className="text-sm text-gray-500 mt-2">Analyzing compliance and escalation metrics</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* SLA Matrix */}
            <Card className="p-6 bg-white shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">End-to-End SLA Matrix</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breaches</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {slaMatrix.map((stage, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stage.stage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stage.sla}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge label={`${stage.compliance.toFixed(1)}%`} variant={stage.compliance >= 90 ? 'success' : stage.compliance >= 80 ? 'warning' : 'danger'} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stage.breaches}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stage.compliance >= 90 ? 'bg-green-100 text-green-800' :
                            stage.compliance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {stage.compliance >= 90 ? 'Excellent' : stage.compliance >= 80 ? 'Good' : 'Needs Attention'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-blue-50 to-amber-50 border-2 border-blue-200 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Scale className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">BRD-Compliant Governance Dashboard</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Ensures SLA adherence, escalation discipline, and audit readiness across the organization with end-to-end SLA matrix tracking and threshold-based hotspot alerts.
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
