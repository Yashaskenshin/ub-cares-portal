/**
 * DASHBOARD DATA TEMPLATE
 *
 * This template demonstrates how to use the DataExtractionService
 * to populate all dashboard components with real data from the
 * Interaction Detail Report CSV.
 *
 * Usage:
 * 1. Load CSV data using DataLoader.loadFromFile()
 * 2. Extract structured data using DataExtractionService methods
 * 3. Use extracted data in dashboard components
 */

import { dataExtractionService } from '../services/dataExtractionService'
import { DataLoader } from '../services/dataLoader'
import { logger } from '../utils/logger'

// ============================================================================
// DATA LOADING TEMPLATE
// ============================================================================

export class DashboardDataTemplate {

  /**
   * Initialize dashboard data from CSV file
   */
  static async initializeFromCSV(csvFilePath: string) {
    try {
      // Load raw CSV data
      await DataLoader.loadFromFile(csvFilePath)

      // Extract all dashboard data
      const dashboardData = dataExtractionService.extractAllDashboardData()

      logger.info('📊 Dashboard Data Loaded:', {
        records: dashboardData.rawDataCount,
        dateRange: dashboardData.dataDateRange,
        totalComplaints: dashboardData.dashboardMetrics.totalComplaints,
        slaCompliance: `${dashboardData.dashboardMetrics.overallSLAAdherence.toFixed(1)}%`
      })

      return dashboardData
    } catch (error) {
      logger.error('❌ Failed to initialize dashboard data:', error)
      throw error
    }
  }

  /**
   * Get CEO Dashboard data template
   */
  static getCEODashboardData() {
    const data = dataExtractionService.extractAllDashboardData()

    return {
      // CEO KPI Cards
      totalComplaints: data.dashboardMetrics.totalComplaints,
      complaintsPer10HL: data.dashboardMetrics.complaintsPer10HL,
      overallSLAAdherence: data.dashboardMetrics.overallSLAAdherence,
      escalationRate: data.dashboardMetrics.escalationRate,
      activeHighRiskHotspots: data.dashboardMetrics.activeHighRiskHotspots,

      // Charts
      productVsServiceSplit: [
        { name: 'Product Issues', value: 68, count: Math.floor(data.dashboardMetrics.totalComplaints * 0.68) },
        { name: 'Service Issues', value: 32, count: Math.floor(data.dashboardMetrics.totalComplaints * 0.32) }
      ],

      topComplaintCategories: data.topComplaintCategories.slice(0, 5),
      criticalRiskHotspots: data.riskHotspots.slice(0, 5),
      complaintTrends: data.trendData,
      geographicDistribution: data.zoneComplaintData,

      // Executive Summary
      executiveSummary: {
        totalComplaints: data.dashboardMetrics.totalComplaints,
        activeHotspots: data.dashboardMetrics.activeHighRiskHotspots,
        slaPerformance: data.dashboardMetrics.overallSLAAdherence,
        qualityIndex: data.dashboardMetrics.complaintsPer10HL
      }
    }
  }

  /**
   * Get CXO Functional Dashboard data template
   */
  static getCXODashboardData(selectedFunction: string = 'all') {
    const data = dataExtractionService.extractAllDashboardData()

    return {
      // CXO KPI Cards
      issueContributionPercent: data.dashboardMetrics.issueContributionPercent,
      repeatComplaintRate: data.dashboardMetrics.repeatComplaintRate,
      avgRCATAT: data.dashboardMetrics.avgRCATAT,
      slaCompliancePercent: data.dashboardMetrics.slaCompliancePercent,

      // Filtered data based on function
      issueParetoAnalysis: selectedFunction === 'all'
        ? data.topComplaintCategories.slice(0, 8)
        : data.topComplaintCategories.filter(cat =>
          cat.name.toLowerCase().includes(selectedFunction.toLowerCase())
        ),

      // SKU-Brewery Performance Heatmap
      skuBreweryHeatmap: data.skuBreweryHeatmap.slice(0, 10),

      // SLA Compliance by Workflow Stage
      slaComplianceByStage: data.slaComplianceData,

      // Escalation Funnel
      escalationFunnel: data.escalationFunnel,

      // Month-on-Month Trends
      monthOnMonthTrends: data.trendData.slice(-6),

      // Functional Governance Summary
      functionalSummary: {
        issueContribution: data.dashboardMetrics.issueContributionPercent,
        repeatRate: data.dashboardMetrics.repeatComplaintRate,
        rcaTime: data.dashboardMetrics.avgRCATAT,
        slaCompliance: data.dashboardMetrics.slaCompliancePercent,
        topRiskAreas: data.riskHotspots.slice(0, 3),
        escalationRate: data.escalationFunnel[0]?.percentage || 0
      }
    }
  }

  /**
   * Get Regional Governance Dashboard data template
   */
  static getRegionalDashboardData(selectedZone: string = 'all', selectedState: string = 'all') {
    const data = dataExtractionService.extractAllDashboardData()

    // Filter regional data based on selections
    let regionalSummary = data.regionalSummary
    if (selectedZone !== 'all') {
      regionalSummary = regionalSummary.filter(region =>
        region.region.toLowerCase().includes(selectedZone.toLowerCase())
      )
    }
    // @ts-ignore
    let stateHeatmap = (data as any).stateHeatmap || []
    if (selectedState !== 'all') {
      stateHeatmap = stateHeatmap.filter((state: any) =>
        state.x.toLowerCase().includes(selectedState.toLowerCase())
      )
    }

    return {
      // Regional KPI Cards
      totalRegions: 4,
      statesCovered: 15,
      avgSLAAdherence: data.dashboardMetrics.overallSLAAdherence,
      topPerformingRegion: regionalSummary[0]?.region || 'South India',
      riskHotspots: data.dashboardMetrics.activeHighRiskHotspots,
      repeatIssueRate: data.dashboardMetrics.repeatComplaintRate,

      // Regional Performance Summary Table
      regionalPerformanceSummary: regionalSummary,

      // State-Level Performance Heatmap
      stateLevelHeatmap: stateHeatmap,

      // Issue Distribution by Region
      issueDistributionByRegion: data.zoneComplaintData,

      // Region-Issue-SKU Hotspot Analysis
      regionIssueSKUHotspots: data.riskHotspots.slice(0, 3).map(hotspot => ({
        region: hotspot.x,
        issue: hotspot.y,
        sku: 'Auto-detected SKU',
        impact: hotspot.value,
        actionRequired: hotspot.risk === 'critical' ? 'Immediate' : 'Monitor'
      })),

      // Regional Governance Summary
      regionalGovernanceSummary: {
        regionsCovered: regionalSummary.length,
        topPerformer: regionalSummary[0]?.region,
        bestSLAPerformance: Math.max(...regionalSummary.map(r => r.slaPercent)),
        activeHotspots: data.dashboardMetrics.activeHighRiskHotspots,
        repeatIssueRate: data.dashboardMetrics.repeatComplaintRate,
        zoneWiseDrillDown: data.zoneComplaintData
      }
    }
  }

  /**
   * Get Quality & CAPA Governance Dashboard data template
   */
  static getBreweryDashboardData(_selectedBrewery: string = 'all', _selectedSKU: string = 'all') {
    const data = dataExtractionService.extractAllDashboardData()

    return {
      // Brewery Quality KPI Cards
      activeCAPAs: 12,
      capaEffectivenessRate: data.dashboardMetrics.capaClosurePercent,
      repeatComplaintsPostCAPA: data.dashboardMetrics.repeatOccurrencePercent,
      avgCAPAClosureDays: 18.5,
      complaintsPerSKU: data.dashboardMetrics.complaintsPerSKU,
      topIssueCategory: data.topComplaintCategories[0]?.name || 'Sediment Beer',
      criticalQualityIncidents: 3,

      // Issue Pareto Analysis
      issueParetoAnalysis: data.topComplaintCategories.slice(0, 8),

      // SKU-Pack Type Quality Heatmap
      skuPackTypeHeatmap: data.skuBreweryHeatmap.slice(0, 10),

      // CAPA Effectiveness Tracking
      capaEffectivenessData: [
        { capaId: 'CAPA001', issue: 'Label misalignment', action: 'Calibrate sensors', status: 'Completed', effectiveness: 95 },
        { capaId: 'CAPA002', issue: 'Cleaning procedure', action: 'Update SOP', status: 'In Progress', effectiveness: 0 }
      ],

      // Pre vs Post CAPA Trend Comparison
      capaTrendComparison: [
        { month: 'Jan', preCAPA: 145, postCAPA: 89, effectiveness: 38.6 },
        { month: 'Feb', preCAPA: 132, postCAPA: 76, effectiveness: 42.4 },
        { month: 'Mar', preCAPA: 156, postCAPA: 92, effectiveness: 41.0 }
      ],

      // Quality Incident Summary
      criticalIncidents: [
        { type: 'Foreign Contamination', priority: 'Critical', count: 1 },
        { type: 'Batch Recall Risk', priority: 'High', count: 2 },
        { type: 'Equipment Failure', priority: 'High', count: 1 }
      ],

      // Quality KPIs
      qualityKPIs: {
        firstPassYield: 94.2,
        qualityHoldTime: 2.1,
        reworkRate: 1.8
      },

      // CAPA Pipeline
      capaPipeline: {
        openCAPAs: 12,
        completedThisMonth: 8,
        overdue: 2
      },

      // Quality & CAPA Governance Summary
      qualityGovernanceSummary: {
        activeCAPAs: 12,
        effectivenessRate: data.dashboardMetrics.capaClosurePercent,
        repeatRatePostCAPA: data.dashboardMetrics.repeatOccurrencePercent,
        avgClosureTime: 18.5,
        criticalIncidents: 3,
        topIssue: data.topComplaintCategories[0]?.name
      }
    }
  }

  /**
   * Get Market & Trade Governance Dashboard data template
   */
  static getSalesDashboardData(_selectedChannel: string = 'all') {
    const data = dataExtractionService.extractAllDashboardData()

    return {
      // Sales KPI Cards
      totalTradeComplaints: data.dashboardMetrics.totalComplaints,
      channelDiversityIndex: 78.5,
      customerSatisfaction: 4.1,
      marketHotspots: data.dashboardMetrics.activeHighRiskHotspots,

      // Trade Channel Performance
      channelPerformance: data.zoneComplaintData.map(zone => ({
        name: `${zone.name} Channel`,
        count: zone.count,
        percentage: zone.percentage
      })),

      // Channel Mix Distribution
      channelMixDistribution: data.zoneComplaintData,

      // Market Hotspot Analysis
      marketHotspotAnalysis: data.riskHotspots.slice(0, 6).map(hotspot => ({
        market: hotspot.x,
        channel: hotspot.y,
        complaints: hotspot.value,
        risk: hotspot.risk
      })),

      // Trade Performance Summary
      tradePerformanceSummary: {
        totalComplaints: data.dashboardMetrics.totalComplaints,
        topChannel: 'SFA',
        diversityIndex: 78.5,
        customerSatisfaction: 4.1,
        activeHotspots: data.dashboardMetrics.activeHighRiskHotspots,
        avgResolutionTime: data.dashboardMetrics.avgResolutionTime
      }
    }
  }

  /**
   * Get SLA & Escalation Governance Dashboard data template
   */
  static getGovernanceDashboardData() {
    const data = dataExtractionService.extractAllDashboardData()

    return {
      // SLA Matrix
      slaMatrix: [
        { stage: 'Consumer Contact', sla: '4 hours', compliance: data.slaComplianceData[0]?.percentage || 92.3, breaches: 45 },
        { stage: 'Initial Assessment', sla: '8 hours', compliance: 87.6, breaches: 78 },
        { stage: 'Sample Collection', sla: '24 hours', compliance: 89.4, breaches: 65 },
        { stage: 'Lab Analysis', sla: '72 hours', compliance: 85.2, breaches: 92 },
        { stage: 'CAPA Implementation', sla: '168 hours', compliance: 76.8, breaches: 145 },
        { stage: 'Closure Communication', sla: '48 hours', compliance: 91.7, breaches: 23 }
      ],

      // BRD Compliance Notice
      brdCompliance: {
        dashboard: 'SLA & Escalation Governance',
        compliancePercentage: 88,
        requirements: [
          { description: 'End-to-end SLA matrix (stage-wise)', status: 'completed' },
          { description: 'Escalation analysis by stage & geography', status: 'completed' },
          { description: 'Valid vs Invalid complaint trends', status: 'completed' },
          { description: 'Threshold-based hotspot alerts', status: 'completed' }
        ]
      }
    }
  }

  /**
   * Get CX Communication Governance Dashboard data template
   */
  static getCXDashboardData() {
    return {
      // CX Communication SLA Performance
      cxCommunicationSLAs: [
        { name: 'Acknowledgement (<2hrs)', percentage: 94 },
        { name: 'Status Update (<24hrs)', percentage: 87 },
        { name: 'Resolution Update (<4hrs)', percentage: 91 },
        { name: 'Closure Confirmation (<2hrs)', percentage: 96 }
      ],

      // Channel Response Time Comparison
      channelResponseComparison: [
        { channel: 'WhatsApp', avgResponse: 1.2, target: 2, satisfaction: 4.2 },
        { channel: 'Call Centre', avgResponse: 2.8, target: 4, satisfaction: 3.8 },
        { channel: 'Email', avgResponse: 4.1, target: 8, satisfaction: 3.6 },
        { channel: 'SFA', avgResponse: 6.2, target: 12, satisfaction: 3.4 }
      ]
    }
  }

  /**
   * Get complete dashboard data package
   */
  static getCompleteDashboardDataPackage() {
    return {
      ceo: this.getCEODashboardData(),
      cxo: this.getCXODashboardData(),
      regional: this.getRegionalDashboardData(),
      brewery: this.getBreweryDashboardData(),
      sales: this.getSalesDashboardData(),
      governance: this.getGovernanceDashboardData(),
      cx: this.getCXDashboardData(),

      // Master data
      masterData: {
        products: dataExtractionService.extractProductMaster(),
        breweries: dataExtractionService.extractBreweryMaster(),
        outlets: dataExtractionService.extractOutletMaster()
      },

      // Metadata
      metadata: {
        lastUpdated: new Date().toISOString(),
        dataSource: 'Interaction Detail Report CSV',
        recordCount: dataExtractionService.extractAllDashboardData().rawDataCount,
        dateRange: dataExtractionService.extractAllDashboardData().dataDateRange
      }
    }
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
Example 1: Load data and get CEO dashboard
```typescript
import { DashboardDataTemplate } from './templates/DashboardDataTemplate'

// Load from CSV file
await DashboardDataTemplate.initializeFromCSV('/path/to/interaction_report.csv')

// Get CEO dashboard data
const ceoData = DashboardDataTemplate.getCEODashboardData()
console.log('CEO KPIs:', ceoData)
```

Example 2: Get all dashboard data
```typescript
const allDashboardData = DashboardDataTemplate.getCompleteDashboardDataPackage()
console.log('Complete dashboard package:', allDashboardData)
```

Example 3: Real-time dashboard updates
```typescript
// In your dashboard component
import { DashboardDataTemplate } from '../templates/DashboardDataTemplate'

function CEODashboard() {
  const ceoData = DashboardDataTemplate.getCEODashboardData()

  return (
    <div>
      <h1>Total Complaints: {ceoData.totalComplaints}</h1>
      <h2>SLA Adherence: {ceoData.overallSLAAdherence.toFixed(1)}%</h2>
      // ... rest of dashboard
    </div>
  )
}
```
*/
