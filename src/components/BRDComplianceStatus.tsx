import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react'
import Card from './Card'

interface BRDRequirement {
  id: string
  description: string
  status: 'completed' | 'in_progress' | 'pending'
  priority: 'high' | 'medium' | 'low'
}

interface BRDComplianceStatusProps {
  requirements: BRDRequirement[]
  dashboardName: string
}

export default function BRDComplianceStatus({ requirements, dashboardName }: BRDComplianceStatusProps) {
  const completedCount = requirements.filter(req => req.status === 'completed').length
  const totalCount = requirements.length
  const complianceRate = Math.round((completedCount / totalCount) * 100)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✓ Complete</span>
      case 'in_progress':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">⟳ In Progress</span>
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">⚠ Pending</span>
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Unknown</span>
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <TrendingUp className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-blue-900 text-lg">BRD Compliance: {dashboardName}</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-700">{completedCount}/{totalCount} requirements</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${complianceRate >= 90 ? 'bg-green-100 text-green-800' :
                  complianceRate >= 70 ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                }`}>
                {complianceRate}% Complete
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {requirements.map((requirement, index) => (
              <div key={requirement.id} className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg border border-blue-100">
                <div className="mt-0.5">
                  {getStatusIcon(requirement.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-900 font-medium">
                      {index + 1}. {requirement.description}
                    </span>
                    {getStatusBadge(requirement.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>BRD Reference:</strong> This dashboard implements the requirements from the UB Cares Dashboard BRD (Section 3-9).
              All KPIs are calculated consistently across dashboards with proper drill-down capabilities per persona.
              Mock data is currently used - will be replaced with real data integration.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

// BRD Requirements for each dashboard type
export const BRD_REQUIREMENTS: Record<string, BRDRequirement[]> = {
  ceo: [
    { id: 'ceo-kpi-1', description: '30-60 second executive snapshot with key KPIs', status: 'completed', priority: 'high' },
    { id: 'ceo-kpi-2', description: 'Product vs Service complaint split visualization', status: 'completed', priority: 'high' },
    { id: 'ceo-kpi-3', description: 'Top complaint categories (volume & risk-weighted)', status: 'completed', priority: 'high' },
    { id: 'ceo-kpi-4', description: 'High-risk hotspots identification', status: 'completed', priority: 'high' },
    { id: 'ceo-kpi-5', description: 'Month-on-month rolling complaint & SLA trends', status: 'completed', priority: 'high' },
    { id: 'ceo-kpi-6', description: 'Zone-wise complaint distribution', status: 'completed', priority: 'medium' },
    { id: 'ceo-kpi-7', description: 'Risk-weighted scoring algorithm', status: 'pending', priority: 'medium' }
  ],
  cxo_quality: [
    { id: 'cxo-kpi-1', description: 'Issue Pareto analysis (volume & risk)', status: 'completed', priority: 'high' },
    { id: 'cxo-kpi-2', description: 'SKU-Brewery heatmaps', status: 'completed', priority: 'high' },
    { id: 'cxo-kpi-3', description: 'SLA compliance by workflow stage', status: 'completed', priority: 'high' },
    { id: 'cxo-kpi-4', description: 'Escalation funnel (L1/L2/L3)', status: 'completed', priority: 'high' },
    { id: 'cxo-kpi-5', description: 'Month-on-month trend diagnostics', status: 'completed', priority: 'medium' },
    { id: 'cxo-kpi-6', description: 'CAPA effectiveness tracking', status: 'pending', priority: 'medium' }
  ],
  cxo_sales: [
    { id: 'cxo-sales-1', description: 'Trade complaint volume & trend analysis', status: 'completed', priority: 'high' },
    { id: 'cxo-sales-2', description: 'Channel mix analysis (SFA, Call Centre, WhatsApp, Email)', status: 'completed', priority: 'high' },
    { id: 'cxo-sales-3', description: 'Market-level hotspot heatmaps', status: 'completed', priority: 'high' },
    { id: 'cxo-sales-4', description: 'Month-on-month trade complaint movement', status: 'completed', priority: 'medium' },
    { id: 'cxo-sales-5', description: 'Outlet performance tracking', status: 'pending', priority: 'medium' }
  ],
  cxo_supply_chain: [
    { id: 'cxo-supply-1', description: 'Logistics tracking and performance', status: 'completed', priority: 'high' },
    { id: 'cxo-supply-2', description: 'Supply chain bottleneck identification', status: 'completed', priority: 'high' },
    { id: 'cxo-supply-3', description: 'Distribution efficiency metrics', status: 'pending', priority: 'medium' }
  ],
  cxo_marketing: [
    { id: 'cxo-marketing-1', description: 'Brand performance analysis', status: 'completed', priority: 'high' },
    { id: 'cxo-marketing-2', description: 'Market perception insights', status: 'pending', priority: 'medium' },
    { id: 'cxo-marketing-3', description: 'Campaign impact tracking', status: 'pending', priority: 'low' }
  ],
  extended_leadership: [
    { id: 'extended-1', description: 'Regional summary tables (complaints, SLA, escalations)', status: 'completed', priority: 'high' },
    { id: 'extended-2', description: 'State-level heatmaps with SLA overlay', status: 'completed', priority: 'high' },
    { id: 'extended-3', description: 'Issue distribution by region', status: 'completed', priority: 'high' },
    { id: 'extended-4', description: 'Region-Issue-SKU hotspot analysis', status: 'completed', priority: 'medium' }
  ],
  brewery_leadership: [
    { id: 'brewery-1', description: 'Issue Pareto at Brewery/SKU level', status: 'completed', priority: 'high' },
    { id: 'brewery-2', description: 'SKU-Pack Type complaint heatmaps', status: 'completed', priority: 'high' },
    { id: 'brewery-3', description: 'Repeat complaint tracking post CAPA', status: 'completed', priority: 'high' },
    { id: 'brewery-4', description: 'Pre vs Post CAPA trend comparison', status: 'pending', priority: 'medium' },
    { id: 'brewery-5', description: 'Batch traceability integration', status: 'pending', priority: 'low' }
  ],
  sales_leadership: [
    { id: 'sales-1', description: 'Trade complaint KPIs', status: 'completed', priority: 'high' },
    { id: 'sales-2', description: 'Channel mix visualization', status: 'completed', priority: 'high' },
    { id: 'sales-3', description: 'Market hotspot heatmaps', status: 'completed', priority: 'high' },
    { id: 'sales-4', description: 'MoM trade complaint trends', status: 'completed', priority: 'medium' },
    { id: 'sales-5', description: 'Outlet-level performance data', status: 'pending', priority: 'medium' }
  ],
  governance_ctc: [
    { id: 'governance-1', description: 'End-to-end SLA matrix (stage-wise)', status: 'completed', priority: 'high' },
    { id: 'governance-2', description: 'Escalation analysis by stage & geography', status: 'completed', priority: 'high' },
    { id: 'governance-3', description: 'Valid vs Invalid complaint trends', status: 'completed', priority: 'high' },
    { id: 'governance-4', description: 'Threshold-based hotspot alerts', status: 'completed', priority: 'medium' },
    { id: 'governance-5', description: 'Complaint-level drill-down (read-only)', status: 'pending', priority: 'low' }
  ],
  operational_cx: [
    { id: 'operational-1', description: 'Full complaint-level visibility', status: 'completed', priority: 'high' },
    { id: 'operational-2', description: 'Live queues and status tracking', status: 'completed', priority: 'high' },
    { id: 'operational-3', description: 'SLA adherence and escalations monitoring', status: 'completed', priority: 'high' },
    { id: 'operational-4', description: 'Channel response time comparison', status: 'completed', priority: 'medium' },
    { id: 'operational-5', description: 'Consumer vs Customer mix trend', status: 'completed', priority: 'medium' }
  ]
}
