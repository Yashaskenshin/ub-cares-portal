/**
 * DATA LOADING EXAMPLE
 *
 * This example shows how to load real data from the Interaction Detail Report CSV
 * and use it to populate the dashboards.
 */

import { DataLoader } from '../services/dataLoader'
import { DashboardDataTemplate } from '../templates/DashboardDataTemplate'
import { dataExtractionService } from '../services/dataExtractionService'
import { logger } from '../utils/logger'

export class DataLoadingExample {

  /**
   * Example 1: Load data from CSV file
   */
  static async loadFromCSVFile() {
    logger.info('🔄 Loading data from CSV file...')

    try {
      // Load the CSV file (adjust path as needed)
      await DataLoader.loadFromFile('/data/Interaction_Detail_Report_Asia_Kolkata_From_23-11-2025_23-19_04-01-2026_23-19_exported_04-01-2026_23-19.csv')

      // Get data summary
      const summary = DataLoader.getDataSummary()
      logger.info('📊 Data Summary:', summary)

      // Validate data quality
      const validation = DataLoader.validateData()
      logger.info('✅ Data Validation:', validation)

      // Extract dashboard data
      const dashboardData = DashboardDataTemplate.getCompleteDashboardDataPackage()
      logger.info('🎯 Dashboard Data Package:', dashboardData.metadata)

      return dashboardData

    } catch (error) {
      logger.error('❌ Error loading data:', error)
      throw error
    }
  }

  /**
   * Example 2: Load data from CSV string (for testing)
   */
  static loadFromCSVString() {
    logger.info('🔄 Loading data from CSV string...')

    // Sample CSV content (first few rows)
    const sampleCSV = `"Check","Source","Client Info","Location","Branch","Department","Campaign","Team","Agent","Complexity","Type","Category","Sub Category","Status","State","Impact","Priority","Urgency","Date Created","Last Modified Date","Date Closed","Rating","Is Secondary","Expected Response Time (sec)","Expected Resolution Time (sec)","Actual Response Time (Date/Time)","Actual Response Time (sec)","Actual Resolution Time (Date/Time)","Actual Resolution Time (sec)","Response Time Escalated","Resolution Time Escalated","Response Escalation Time","Resolution Escalation Time","Interaction Type","Parent Interaction ID","Child Interaction IDs","Are you a Consumer or a Customer?","Batch No","Brand type","City","Descriptions","Do you have the product with you?","Email Address","First Name","How many products were affected?","Last Name","Manufacturing Date","Manufacturing Location","Outlet Name","Pack Size","Phone Number","SFA Ticket ID","SKU"
"2025001064","CLIENT_PORTAL","Unknown","Head Office","Bangalore Head Office","call-center","UBL-callcenter","call-center","Unassigned","Unknown","Pending-Justification","Unknown","Unknown","Open","Pending Information","Unknown","Unknown","Unknown","05/01/2026 00:55:08","05/01/2026 00:55:09","","","No","","","","","","","","","","","-","","","Retailer","461","Kingfisher Strong Premium Beer","Vijayawada ","","Yes, opened","taicoonsrestaurantbar@gmail.com","TYCOONS ","1","Restaurant and bar ","2025-11-20T05:30:00","","Nidamanuru ","","9948707978","",""
"2025001063","CLIENT_PORTAL","Unknown","South_India","UNITED BREWERIES LTD - SRIKAKULAM","UBL-GMR","UBL-GMR","UBL-GMR-QAM","Johnson","Product Complaint - Non HACCP","Pending-Justification","Primary Packaging","Leakage","Open","Validation in Progress","Low Volume","Low Risk","Low","03/01/2026 21:31:01","03/01/2026 22:21:01","","","No","43200","259200","06/01/2026 03:30:00","","13/01/2026 03:30:00","","","","","","-","","","Retailer","477","Kingfisher Strong Premium Beer","Tekkali ","Address - Near by RTC Depo, Tekkali Mandal, Srikakulam - 532201.","Yes, unopened","","veranna","1","Gunna","2025-11-28T05:30:00","Gmr,srikakulam ","Friends wines","","9395323431","",""`

    try {
      DataLoader.loadFromString(sampleCSV)

      const summary = DataLoader.getDataSummary()
      logger.info('📊 Sample Data Summary:', summary)

      return DashboardDataTemplate.getCompleteDashboardDataPackage()

    } catch (error) {
      logger.error('❌ Error loading sample data:', error)
      throw error
    }
  }

  /**
   * Example 3: Monitor data quality and statistics
   */
  static monitorDataQuality() {
    const data = dataExtractionService.extractAllDashboardData()

    const qualityMetrics = {
      totalRecords: data.rawDataCount,
      dateRange: data.dataDateRange,
      dataCompleteness: {
        complaintsWithSKUs: data.productMaster.length > 0,
        complaintsWithBreweries: data.breweryMaster.length > 0,
        complaintsWithOutlets: data.outletMaster.length > 0,
        slaDataAvailable: data.slaComplianceData.length > 0
      },
      businessMetrics: {
        totalComplaints: data.dashboardMetrics.totalComplaints,
        openComplaints: data.dashboardMetrics.openComplaints,
        closedComplaints: data.dashboardMetrics.closedComplaints,
        resolutionRate: `${data.dashboardMetrics.resolutionRate.toFixed(1)}%`,
        slaCompliance: `${data.dashboardMetrics.overallSLAAdherence.toFixed(1)}%`,
        escalationRate: `${data.dashboardMetrics.escalationRate.toFixed(1)}%`
      },
      topIssues: data.topComplaintCategories.slice(0, 5),
      geographicDistribution: data.zoneComplaintData,
      riskProfile: data.riskHotspots.slice(0, 3)
    }

    logger.info('📈 Data Quality Report:', qualityMetrics)
    return qualityMetrics
  }

  /**
   * Example 4: Real-time dashboard refresh simulation
   */
  static simulateRealTimeUpdates() {
    logger.info('🔄 Simulating real-time dashboard updates...')

    // Simulate periodic data refresh
    const refreshInterval = setInterval(() => {
      const dashboardData = DashboardDataTemplate.getCompleteDashboardDataPackage()

      logger.info('📊 Real-time Update:', {
        timestamp: new Date().toISOString(),
        totalComplaints: dashboardData.ceo.totalComplaints,
        slaCompliance: dashboardData.ceo.overallSLAAdherence,
        activeHotspots: dashboardData.ceo.activeHighRiskHotspots
      })
    }, 5000) // Update every 5 seconds

    // Stop after 30 seconds for demo
    setTimeout(() => {
      clearInterval(refreshInterval)
      logger.info('⏹️ Stopped real-time updates')
    }, 30000)
  }
}

// ============================================================================
// QUICK START GUIDE
// ============================================================================

/*
To use this with real data:

1. Place your CSV file in the public/data/ folder
2. Import and use:

```typescript
import { DataLoadingExample } from './examples/DataLoadingExample'

// Load real data
await DataLoadingExample.loadFromCSVFile()

// Get dashboard data
const dashboardData = DashboardDataTemplate.getCompleteDashboardDataPackage()

// Use in components
console.log('CEO Dashboard:', dashboardData.ceo)
console.log('CXO Dashboard:', dashboardData.cxo)
// ... etc
```

3. The MockDataService will automatically use real data when available

4. Monitor data quality:
```typescript
DataLoadingExample.monitorDataQuality()
```
*/
