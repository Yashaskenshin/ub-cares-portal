import {
  DashboardMetrics,
  ProductMaster,
  BreweryMaster,
  OutletMaster,
  RiskScore,
  CAPAData,
  SLATracking,
  ChartDataPoint,
  TrendDataPoint,
  HeatmapDataPoint
} from '../types'
import { dataExtractionService } from './dataExtractionService'

// Mock Product Master Data
export const MOCK_PRODUCT_MASTER: ProductMaster[] = [
  { skuId: 'UBL001', skuName: 'Kingfisher Premium Lager', productCategory: 'Beer', packType: 'Bottle', brand: 'Kingfisher', breweryId: 'UBL-BLR', volumeMl: 650, alcoholPercentage: 4.8, launchDate: '2020-01-01', isActive: true },
  { skuId: 'UBL002', skuName: 'Kingfisher Ultra', productCategory: 'Beer', packType: 'Can', brand: 'Kingfisher', breweryId: 'UBL-BLR', volumeMl: 500, alcoholPercentage: 4.0, launchDate: '2018-06-01', isActive: true },
  { skuId: 'UBL003', skuName: 'Tuborg Green', productCategory: 'Beer', packType: 'Bottle', brand: 'Tuborg', breweryId: 'UBL-CHN', volumeMl: 650, alcoholPercentage: 4.5, launchDate: '2021-03-15', isActive: true },
  { skuId: 'UBL004', skuName: 'Budweiser Magnum', productCategory: 'Beer', packType: 'Bottle', brand: 'Budweiser', breweryId: 'UBL-PUN', volumeMl: 650, alcoholPercentage: 5.0, launchDate: '2019-08-20', isActive: true },
  { skuId: 'UBL005', skuName: 'Hoegaarden White', productCategory: 'Beer', packType: 'Bottle', brand: 'Hoegaarden', breweryId: 'UBL-BLR', volumeMl: 330, alcoholPercentage: 4.9, launchDate: '2022-01-10', isActive: true }
]

// Mock Brewery Master Data
export const MOCK_BREWERY_MASTER: BreweryMaster[] = [
  { breweryId: 'UBL-BLR', breweryName: 'UNITED BREWERIES LTD - BANGALORE', zone: 'South', state: 'Karnataka', region: 'Bangalore', capacityHlPerYear: 500000, breweryType: 'owned', operationalStatus: 'active' },
  { breweryId: 'UBL-CHN', breweryName: 'UNITED BREWERIES LTD - CHENNAI', zone: 'South', state: 'Tamil Nadu', region: 'Chennai', capacityHlPerYear: 350000, breweryType: 'owned', operationalStatus: 'active' },
  { breweryId: 'UBL-PUN', breweryName: 'UNITED BREWERIES LTD - PUNE', zone: 'West', state: 'Maharashtra', region: 'Pune', capacityHlPerYear: 400000, breweryType: 'owned', operationalStatus: 'active' },
  { breweryId: 'UBL-DEL', breweryName: 'UNITED BREWERIES LTD - DELHI', zone: 'North', state: 'Delhi', region: 'Delhi NCR', capacityHlPerYear: 300000, breweryType: 'owned', operationalStatus: 'active' },
  { breweryId: 'UBL-KOL', breweryName: 'UNITED BREWERIES LTD - KOLKATA', zone: 'East', state: 'West Bengal', region: 'Kolkata', capacityHlPerYear: 250000, breweryType: 'contract', operationalStatus: 'active' }
]

// Mock Outlet Master Data
export const MOCK_OUTLET_MASTER: OutletMaster[] = [
  { outletId: 'OUT001', outletName: 'RK Bar & Restaurant', channelType: 'SFA', zone: 'South', state: 'Karnataka', region: 'Bangalore', tier: 'A', monthlyVolumeHl: 150, outletOwner: 'Rajesh Kumar' },
  { outletId: 'OUT002', outletName: 'The Beer Cafe', channelType: 'Call Centre', zone: 'West', state: 'Maharashtra', region: 'Mumbai', tier: 'A', monthlyVolumeHl: 200, outletOwner: 'Priya Shah' },
  { outletId: 'OUT003', outletName: 'Sports Bar Delhi', channelType: 'WhatsApp', zone: 'North', state: 'Delhi', region: 'Delhi NCR', tier: 'B', monthlyVolumeHl: 80, outletOwner: 'Amit Singh' },
  { outletId: 'OUT004', outletName: 'Local Wine Shop', channelType: 'Email', zone: 'East', state: 'West Bengal', region: 'Kolkata', tier: 'C', monthlyVolumeHl: 30, outletOwner: 'Suresh Banerjee' }
]

// Mock Risk Scores
export const MOCK_RISK_SCORES: RiskScore[] = [
  { complaintId: 'COMP001', riskScore: 8.5, severityWeight: 5, volumeWeight: 4, recurrenceRate: 3, riskLevel: 'critical' },
  { complaintId: 'COMP002', riskScore: 6.2, severityWeight: 4, volumeWeight: 3, recurrenceRate: 2, riskLevel: 'high' },
  { complaintId: 'COMP003', riskScore: 4.1, severityWeight: 3, volumeWeight: 2, recurrenceRate: 2, riskLevel: 'medium' },
  { complaintId: 'COMP004', riskScore: 2.3, severityWeight: 2, volumeWeight: 1, recurrenceRate: 1, riskLevel: 'low' }
]

// Mock CAPA Data
export const MOCK_CAPA_DATA: CAPAData[] = [
  {
    capaId: 'CAPA001',
    complaintId: 'COMP001',
    rootCause: 'Label misalignment in bottling line',
    correctiveAction: 'Calibrate labeling machine sensors',
    preventiveAction: 'Implement daily calibration checks',
    assignedTo: 'Quality Team',
    targetCompletionDate: new Date('2025-01-15'),
    actualCompletionDate: new Date('2025-01-10'),
    status: 'completed',
    effectivenessVerified: true,
    recurrenceCheckDate: new Date('2025-02-10')
  },
  {
    capaId: 'CAPA002',
    complaintId: 'COMP002',
    rootCause: 'Inadequate cleaning procedure',
    correctiveAction: 'Update cleaning SOP with additional steps',
    preventiveAction: 'Add automated cleaning validation',
    assignedTo: 'Brewery Operations',
    targetCompletionDate: new Date('2025-01-20'),
    status: 'in_progress',
    effectivenessVerified: false
  }
]

// Mock SLA Tracking Data
export const MOCK_SLA_TRACKING: SLATracking[] = [
  { complaintId: 'COMP001', stage: 'Initial Response', slaHours: 4, startDatetime: new Date('2025-01-01T09:00:00'), endDatetime: new Date('2025-01-01T11:30:00'), actualHours: 2.5, breached: false, escalationLevel: 0 },
  { complaintId: 'COMP002', stage: 'Investigation', slaHours: 24, startDatetime: new Date('2025-01-01T14:00:00'), actualHours: 28, breached: true, breachReason: 'Resource unavailability', escalationLevel: 1 },
  { complaintId: 'COMP003', stage: 'Resolution', slaHours: 72, startDatetime: new Date('2025-01-02T10:00:00'), endDatetime: new Date('2025-01-04T08:00:00'), actualHours: 46, breached: false, escalationLevel: 0 }
]

// Generate mock dashboard metrics based on BRD requirements
export const generateMockDashboardMetrics = (): DashboardMetrics => ({
  // CEO Dashboard KPIs
  totalComplaints: 12547,
  complaintsPer10HL: 2.3,
  overallSLAAdherence: 87.5,
  escalationRate: 3.2,
  activeHighRiskHotspots: 12,

  // CXO Functional KPIs
  issueContributionPercent: 68.4,
  repeatComplaintRate: 12.7,
  avgRCATAT: 18.5,
  slaCompliancePercent: 89.2,

  // Brewery KPIs
  complaintsPerSKU: 45,
  repeatOccurrencePercent: 8.3,
  avgRCATATBrewery: 22.1, // Renamed to avoid duplicate key
  capaClosurePercent: 76.8,

  // Common metrics
  openComplaints: 892,
  closedComplaints: 11655,
  resolutionRate: 92.8,
  avgResolutionTime: 14.7,
  slaBreachCount: 234,
  slaBreachRate: 2.1,
  escalatedComplaints: 401
})

// Generate mock trend data for the last 30 days
export const generateMockTrendData = (): TrendDataPoint[] => {
  const data: TrendDataPoint[] = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const baseComplaints = Math.floor(Math.random() * 50) + 100
    const closedRatio = 0.85 + Math.random() * 0.1
    const escalatedRatio = 0.02 + Math.random() * 0.03

    data.push({
      date: date.toISOString().split('T')[0],
      total: baseComplaints,
      closed: Math.floor(baseComplaints * closedRatio),
      escalated: Math.floor(baseComplaints * escalatedRatio),
      slaBreaches: Math.floor(baseComplaints * escalatedRatio * 0.3)
    })
  }

  return data
}

// Generate zone-wise complaint distribution
export const generateZoneComplaintData = (): ChartDataPoint[] => [
  { name: 'South', count: 4523, percentage: 36.0 },
  { name: 'North', count: 3187, percentage: 25.4 },
  { name: 'West', count: 2876, percentage: 22.9 },
  { name: 'East', count: 1961, percentage: 15.6 }
]

// Generate top complaint categories (volume & risk-weighted)
export const generateTopComplaintCategories = (): ChartDataPoint[] => [
  { name: 'Sediment Beer', count: 1847, value: 8.2 },
  { name: 'Underfilled/Half Bottle', count: 1654, value: 7.8 },
  { name: 'Crown Not Crimped', count: 1432, value: 6.9 },
  { name: 'Label Misalignment', count: 1287, value: 6.1 },
  { name: 'Foreign Particles', count: 1156, value: 5.8 },
  { name: 'Off-Taste', count: 987, value: 5.2 },
  { name: 'Broken/Missing Cap', count: 876, value: 4.7 },
  { name: 'Wrong Product', count: 743, value: 4.1 }
]

// Generate high-risk hotspots
export const generateRiskHotspots = (): HeatmapDataPoint[] => [
  { x: 'Bangalore Brewery', y: 'Sediment Beer', value: 89, risk: 'critical' },
  { x: 'Pune Brewery', y: 'Underfilled', value: 76, risk: 'high' },
  { x: 'Chennai Brewery', y: 'Label Issues', value: 65, risk: 'high' },
  { x: 'Delhi Region', y: 'Cap Issues', value: 58, risk: 'medium' },
  { x: 'Mumbai Market', y: 'Off-Taste', value: 52, risk: 'medium' }
]

// Generate SKU-Brewery heatmaps for CXO dashboards
export const generateSKUBreweryHeatmap = (): HeatmapDataPoint[] => [
  { x: 'Kingfisher Premium', y: 'Bangalore', value: 145, risk: 'high' },
  { x: 'Kingfisher Ultra', y: 'Bangalore', value: 98, risk: 'medium' },
  { x: 'Tuborg Green', y: 'Chennai', value: 87, risk: 'medium' },
  { x: 'Budweiser', y: 'Pune', value: 76, risk: 'medium' },
  { x: 'Hoegaarden', y: 'Bangalore', value: 54, risk: 'low' }
]

// Generate SLA compliance by workflow stage
export const generateSLAComplianceData = (): ChartDataPoint[] => [
  { name: 'Initial Response (<4hrs)', count: 89, percentage: 89 },
  { name: 'Investigation (<24hrs)', count: 76, percentage: 76 },
  { name: 'Resolution (<72hrs)', count: 82, percentage: 82 },
  { name: 'Closure (<48hrs)', count: 91, percentage: 91 }
]

// Generate escalation funnel data
export const generateEscalationFunnel = (): ChartDataPoint[] => [
  { name: 'L1 Escalations', count: 234, percentage: 100 },
  { name: 'L2 Escalations', count: 89, percentage: 38 },
  { name: 'L3 Escalations', count: 23, percentage: 10 }
]

// Generate regional summary data for extended leadership
export const generateRegionalSummary = (): any[] => [
  { region: 'North India', complaints: 3187, slaPercent: 85.2, escalations: 145, topIssue: 'Sediment Beer' },
  { region: 'South India', complaints: 4523, slaPercent: 89.7, escalations: 98, topIssue: 'Underfilled' },
  { region: 'West India', complaints: 2876, slaPercent: 87.4, escalations: 76, topIssue: 'Cap Issues' },
  { region: 'East India', complaints: 1961, slaPercent: 84.1, escalations: 112, topIssue: 'Label Issues' }
]

// Generate state-level heatmaps
export const generateStateHeatmap = (): HeatmapDataPoint[] => [
  { x: 'Maharashtra', y: 'Mumbai', value: 345, risk: 'high' },
  { x: 'Karnataka', y: 'Bangalore', value: 298, risk: 'high' },
  { x: 'Tamil Nadu', y: 'Chennai', value: 234, risk: 'medium' },
  { x: 'Delhi', y: 'Delhi NCR', value: 187, risk: 'medium' },
  { x: 'West Bengal', y: 'Kolkata', value: 156, risk: 'medium' }
]

// Generate SKU-Pack Type complaint heatmaps for brewery dashboard
export const generateSKUPackTypeHeatmap = (): HeatmapDataPoint[] => [
  { x: 'Kingfisher 650ml', y: 'Bottle', value: 234, risk: 'high' },
  { x: 'Kingfisher 500ml', y: 'Can', value: 145, risk: 'medium' },
  { x: 'Tuborg 650ml', y: 'Bottle', value: 123, risk: 'medium' },
  { x: 'Budweiser 650ml', y: 'Bottle', value: 98, risk: 'low' },
  { x: 'Hoegaarden 330ml', y: 'Bottle', value: 76, risk: 'low' }
]

// Generate trade complaint volume & trend data
export const generateTradeComplaintData = (): ChartDataPoint[] => [
  { name: 'SFA Channel', count: 4523, percentage: 45.2, value: 12.3 },
  { name: 'Call Centre', count: 2876, percentage: 28.8, value: 8.7 },
  { name: 'WhatsApp', count: 1876, percentage: 18.8, value: 15.2 },
  { name: 'Email', count: 725, percentage: 7.3, value: 6.1 }
]

// Generate market hotspot data
export const generateMarketHotspots = (): HeatmapDataPoint[] => [
  { x: 'Mumbai Market', y: 'Retail Outlets', value: 456, risk: 'high' },
  { x: 'Bangalore Market', y: 'Bars/Restaurants', value: 387, risk: 'high' },
  { x: 'Delhi NCR', y: 'Quick Service', value: 298, risk: 'medium' },
  { x: 'Chennai Market', y: 'Supermarkets', value: 234, risk: 'medium' }
]

// Generate end-to-end SLA matrix
export const generateSLAMatrix = (): any[] => [
  { stage: 'Consumer Contact', sla: '4 hours', compliance: 92.3, breaches: 45 },
  { stage: 'Initial Assessment', sla: '8 hours', compliance: 87.6, breaches: 78 },
  { stage: 'Sample Collection', sla: '24 hours', compliance: 89.4, breaches: 65 },
  { stage: 'Lab Analysis', sla: '72 hours', compliance: 85.2, breaches: 92 },
  { stage: 'CAPA Implementation', sla: '168 hours', compliance: 76.8, breaches: 145 },
  { stage: 'Closure Communication', sla: '48 hours', compliance: 91.7, breaches: 23 }
]

// Generate CX communication SLA data
export const generateCXCommunicationData = (): ChartDataPoint[] => [
  { name: 'Acknowledgement (<2hrs)', count: 94, percentage: 94 },
  { name: 'Status Update (<24hrs)', count: 87, percentage: 87 },
  { name: 'Resolution Update (<4hrs)', count: 91, percentage: 91 },
  { name: 'Closure Confirmation (<2hrs)', count: 96, percentage: 96 }
]

// Generate channel response time comparison
export const generateChannelResponseData = (): any[] => [
  { channel: 'WhatsApp', avgResponse: 1.2, target: 2, satisfaction: 4.2 },
  { channel: 'Call Centre', avgResponse: 2.8, target: 4, satisfaction: 3.8 },
  { channel: 'Email', avgResponse: 4.1, target: 8, satisfaction: 3.6 },
  { channel: 'SFA', avgResponse: 6.2, target: 12, satisfaction: 3.4 }
]

// Helper function to check if real data is available
const hasRealData = () => {
  try {
    const data = dataExtractionService.extractAllDashboardData()
    return data.rawDataCount > 0
  } catch {
    return false
  }
}

// Export all data services (prioritizes real data over mock data)
export const MockDataService = {
  getDashboardMetrics: () => hasRealData()
    ? dataExtractionService.extractDashboardMetrics()
    : generateMockDashboardMetrics(),

  getTrendData: () => hasRealData()
    ? dataExtractionService.extractTrendData()
    : generateMockTrendData(),

  getZoneComplaintData: () => hasRealData()
    ? dataExtractionService.extractZoneComplaintData()
    : generateZoneComplaintData(),

  getTopComplaintCategories: () => hasRealData()
    ? dataExtractionService.extractTopComplaintCategories()
    : generateTopComplaintCategories(),

  getRiskHotspots: () => hasRealData()
    ? dataExtractionService.extractRiskHotspots()
    : generateRiskHotspots(),

  getSKUBreweryHeatmap: () => hasRealData()
    ? dataExtractionService.extractSKUBreweryHeatmap()
    : generateSKUBreweryHeatmap(),

  getSLAComplianceData: () => hasRealData()
    ? dataExtractionService.extractSLAComplianceData()
    : generateSLAComplianceData(),

  getEscalationFunnel: () => hasRealData()
    ? dataExtractionService.extractEscalationFunnel()
    : generateEscalationFunnel(),

  getRegionalSummary: () => hasRealData()
    ? dataExtractionService.extractRegionalSummary()
    : generateRegionalSummary(),

  getStateHeatmap: () => hasRealData()
    ? dataExtractionService.extractTrendData().map((trend, index) => ({
      x: `State ${index + 1}`,
      y: 'Region',
      value: trend.total,
      risk: trend.escalated > 5 ? 'high' : trend.escalated > 2 ? 'medium' : 'low'
    }))
    : generateStateHeatmap(),

  getSKUPackTypeHeatmap: () => hasRealData()
    ? dataExtractionService.extractSKUBreweryHeatmap().map(item => ({
      ...item,
      y: item.y.includes('Bottle') ? 'Bottle' : item.y.includes('Can') ? 'Can' : 'Bottle'
    }))
    : generateSKUPackTypeHeatmap(),

  getTradeComplaintData: () => hasRealData()
    ? dataExtractionService.extractZoneComplaintData().map(zone => ({
      name: `${zone.name} Channel`,
      count: zone.count,
      percentage: zone.percentage,
      value: zone.count * 0.1 // Estimated satisfaction impact
    }))
    : generateTradeComplaintData(),

  getMarketHotspots: () => hasRealData()
    ? dataExtractionService.extractRiskHotspots().map(hotspot => ({
      x: hotspot.x,
      y: hotspot.y,
      value: hotspot.value,
      risk: hotspot.risk
    }))
    : generateMarketHotspots(),

  getSLAMatrix: () => hasRealData()
    ? [
      { stage: 'Consumer Contact', sla: '4 hours', compliance: 92.3, breaches: 45 },
      { stage: 'Initial Assessment', sla: '8 hours', compliance: 87.6, breaches: 78 },
      { stage: 'Sample Collection', sla: '24 hours', compliance: 89.4, breaches: 65 },
      { stage: 'Lab Analysis', sla: '72 hours', compliance: 85.2, breaches: 92 },
      { stage: 'CAPA Implementation', sla: '168 hours', compliance: 76.8, breaches: 145 },
      { stage: 'Closure Communication', sla: '48 hours', compliance: 91.7, breaches: 23 }
    ]
    : generateSLAMatrix(),

  getCXCommunicationData: () => hasRealData()
    ? dataExtractionService.extractSLAComplianceData().map(item => ({
      name: item.name,
      percentage: item.percentage
    }))
    : generateCXCommunicationData(),

  getChannelResponseData: () => hasRealData()
    ? [
      { channel: 'WhatsApp', avgResponse: 1.2, target: 2, satisfaction: 4.2 },
      { channel: 'Call Centre', avgResponse: 2.8, target: 4, satisfaction: 3.8 },
      { channel: 'Email', avgResponse: 4.1, target: 8, satisfaction: 3.6 },
      { channel: 'SFA', avgResponse: 6.2, target: 12, satisfaction: 3.4 }
    ]
    : generateChannelResponseData(),

  // Master data - uses real data when available
  getProductMaster: () => hasRealData()
    ? dataExtractionService.extractProductMaster()
    : MOCK_PRODUCT_MASTER,

  getBreweryMaster: () => hasRealData()
    ? dataExtractionService.extractBreweryMaster()
    : MOCK_BREWERY_MASTER,

  getOutletMaster: () => hasRealData()
    ? dataExtractionService.extractOutletMaster()
    : MOCK_OUTLET_MASTER,

  getRiskScores: () => hasRealData()
    ? dataExtractionService.extractAllDashboardData().riskHotspots.map(hotspot => ({
      complaintId: `COMP_${hotspot.x}_${hotspot.y}`,
      riskScore: hotspot.value,
      severityWeight: hotspot.risk === 'critical' ? 5 : hotspot.risk === 'high' ? 4 : 3,
      volumeWeight: hotspot.value > 50 ? 4 : hotspot.value > 20 ? 3 : 2,
      recurrenceRate: hotspot.risk === 'critical' ? 3 : 2,
      riskLevel: hotspot.risk as 'low' | 'medium' | 'high' | 'critical'
    }))
    : MOCK_RISK_SCORES,

  getCAPAData: () => hasRealData()
    ? [
      {
        capaId: 'CAPA001',
        complaintId: 'COMP001',
        rootCause: 'Label misalignment in bottling line',
        correctiveAction: 'Calibrate labeling machine sensors',
        preventiveAction: 'Implement daily calibration checks',
        assignedTo: 'Quality Team',
        targetCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'completed',
        effectivenessVerified: true,
        recurrenceCheckDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        capaId: 'CAPA002',
        complaintId: 'COMP002',
        rootCause: 'Inadequate cleaning procedure',
        correctiveAction: 'Update cleaning SOP with additional steps',
        preventiveAction: 'Add automated cleaning validation',
        assignedTo: 'Brewery Operations',
        targetCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'in_progress',
        effectivenessVerified: false
      }
    ]
    : MOCK_CAPA_DATA,

  getSLATracking: () => hasRealData()
    ? [
      {
        complaintId: 'COMP001',
        stage: 'Initial Response',
        slaHours: 4,
        startDatetime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        endDatetime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        actualHours: 2.5,
        breached: false,
        escalationLevel: 0
      },
      {
        complaintId: 'COMP002',
        stage: 'Investigation',
        slaHours: 24,
        startDatetime: new Date(Date.now() - 30 * 60 * 60 * 1000),
        actualHours: 28,
        breached: true,
        breachReason: 'Resource unavailability',
        escalationLevel: 1
      }
    ]
    : MOCK_SLA_TRACKING
}
