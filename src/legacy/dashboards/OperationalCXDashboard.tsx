import { useState } from 'react'
import { MessageSquare, RefreshCw, Users } from 'lucide-react'
import Card from '../components/Card'
// import Badge from '../components/Badge'
import DashboardPersonaSelector from '../components/DashboardPersonaSelector'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// import { DashboardProps } from '../types'
import { MockDataService } from '../services/mockDataService'
// import { DataLoader } from '../services/dataLoader'

const CHART_COLORS = { primary: '#06b6d4', secondary: '#8b5cf6', warning: '#f59e0b', danger: '#ef4444', success: '#10b981' }

export default function OperationalCXDashboard({ isLoading: externalLoading }: any) {
  const [internalLoading, setInternalLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const isLoading = externalLoading || internalLoading
  const cxCommunicationData = MockDataService.getCXCommunicationData()
  const channelResponseData = MockDataService.getChannelResponseData()

  const handleRefresh = async () => {
    setInternalLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastRefresh(new Date())
    } catch (error) { console.error('Error refreshing CX dashboard:', error) }
    finally { setInternalLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
      <div className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CX Communication Governance Dashboard</h1>
                <p className="text-sm text-gray-600 flex items-center mt-0.5">
                  <Users className="h-3 w-3 mr-1.5" />
                  Operational CX Leadership • Communication SLAs & channel responsiveness
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Channel response monitoring</div>
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
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading CX communication data...</p>
              <p className="text-sm text-gray-500 mt-2">Analyzing channel responsiveness and SLAs</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* CX Communication SLAs */}
            <Card className="p-6 bg-white shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">CX Communication SLA Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cxCommunicationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Bar dataKey="percentage" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Channel Response Time Comparison */}
            <Card className="p-6 bg-white shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Channel Response Time Comparison</h3>
              <div className="space-y-4">
                {channelResponseData.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${channel.channel === 'WhatsApp' ? 'bg-green-500' :
                        channel.channel === 'Call Centre' ? 'bg-blue-500' :
                          channel.channel === 'Email' ? 'bg-orange-500' : 'bg-purple-500'
                        }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{channel.channel}</p>
                        <p className="text-xs text-gray-500">Target: {channel.target}hrs</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{channel.avgResponse}hrs</p>
                        <p className="text-xs text-gray-500">Avg response</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{channel.satisfaction}/5</p>
                        <p className="text-xs text-gray-500">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">BRD-Compliant CX Dashboard</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Monitors CX communication discipline and responsiveness across consumer and customer channels with SLA tracking and channel performance analysis.
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
