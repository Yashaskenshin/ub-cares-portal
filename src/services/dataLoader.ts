import { dataExtractionService, RawInteractionData } from './dataExtractionService'
import { logger } from '../utils/logger'

export class DataLoader {
  /**
   * Load CSV data from file path
   */
  static async loadFromFile(filePath: string): Promise<void> {
    try {
      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`)
      }
      const csvText = await response.text()
      dataExtractionService.loadFromCSV(csvText)
      logger.info('✅ Data loaded successfully from:', filePath)
    } catch (error) {
      console.error('❌ Error loading data:', error)
      throw error
    }
  }

  /**
   * Load CSV data from string content
   */
  static loadFromString(csvContent: string): void {
    try {
      dataExtractionService.loadFromCSV(csvContent)
      logger.info('✅ Data loaded successfully from string')
    } catch (error) {
      console.error('❌ Error loading data from string:', error)
      throw error
    }
  }

  /**
   * Load sample data for development/testing
   */
  static loadSampleData(): void {
    const sampleData: RawInteractionData[] = [
      {
        "Check": "2025001001",
        "Source": "CLIENT_PORTAL",
        "Client Info": "Unknown",
        "Location": "South_India",
        "Branch": "UNITED BREWERIES LTD - SRIKAKULAM",
        "Department": "UBL-GMR",
        "Campaign": "UBL-GMR",
        "Team": "UBL-GMR-QAM",
        "Agent": "Johnson",
        "Complexity": "Product Complaint - Non HACCP",
        "Type": "Pending-Justification",
        "Category": "Primary Packaging",
        "Sub Category": "Leakage",
        "Status": "Open",
        "State": "Validation in Progress",
        "Impact": "Low Volume",
        "Priority": "Low Risk",
        "Urgency": "Low",
        "Date Created": "03/01/2026 21:31:01",
        "Last Modified Date": "03/01/2026 22:21:01",
        "Date Closed": "",
        "Rating": "",
        "Is Secondary": "No",
        "Expected Response Time (sec)": "43200",
        "Expected Resolution Time (sec)": "259200",
        "Actual Response Time (Date/Time)": "06/01/2026 03:30:00",
        "Actual Response Time (sec)": "",
        "Actual Resolution Time (Date/Time)": "13/01/2026 03:30:00",
        "Actual Resolution Time (sec)": "",
        "Response Time Escalated": "",
        "Resolution Time Escalated": "",
        "Response Escalation Time": "",
        "Resolution Escalation Time": "",
        "Interaction Type": "-",
        "Parent Interaction ID": "",
        "Child Interaction IDs": "",
        "Are you a Consumer or a Customer?": "Retailer",
        "Batch No": "477",
        "Brand type": "Kingfisher Strong Premium Beer",
        "City": "Tekkali",
        "Descriptions": "Address - Near by RTC Depo, Tekkali Mandal, Srikakulam - 532201.",
        "Do you have the product with you?": "Yes, unopened",
        "Email Address": "",
        "First Name": "veranna",
        "How many products were affected?": "1",
        "Last Name": "Gunna",
        "Manufacturing Date": "2025-11-28T05:30:00",
        "Manufacturing Location": "Gmr,srikakulam",
        "Outlet Name": "Friends wines",
        "Pack Size": "",
        "Phone Number": "9395323431",
        "SFA Ticket ID": "",
        "SKU": ""
      }
    ]

    // Create a mock CSV string from sample data
    const headers = Object.keys(sampleData[0]).map(h => `"${h}"`).join(',')
    const rows = sampleData.map(record =>
      Object.values(record).map(v => `"${v}"`).join(',')
    )
    const csvContent = [headers, ...rows].join('\n')

    this.loadFromString(csvContent)
  }

  /**
   * Get data summary
   */
  static getDataSummary() {
    logger.info('📊 DataLoader.getDataSummary() called')
    const data = dataExtractionService.extractAllDashboardData()
    logger.info('📊 Raw data count from extraction:', data.rawDataCount)
    logger.info('📊 Dashboard metrics:', data.dashboardMetrics)

    const summary = {
      totalRecords: data.rawDataCount,
      dateRange: data.dataDateRange,
      metrics: data.dashboardMetrics,
      topCategories: data.topComplaintCategories.slice(0, 5),
      zones: data.zoneComplaintData,
      breweries: data.breweryMaster.length,
      products: data.productMaster.length,
      outlets: data.outletMaster.length
    }

    logger.info('📊 Returning summary:', summary)
    return summary
  }

  /**
   * Validate data quality
   */
  static validateData(): { isValid: boolean, issues: string[] } {
    try {
      const issues: string[] = []
      const data = dataExtractionService.extractAllDashboardData()

      // Check for required fields
      if (!data || data.rawDataCount === 0) {
        issues.push('No data loaded')
        return { isValid: false, issues }
      }

      if (!data.dataDateRange?.start || !data.dataDateRange?.end) {
        issues.push('Invalid date range')
      }

      if (!data.dashboardMetrics?.totalComplaints || data.dashboardMetrics.totalComplaints === 0) {
        issues.push('No complaints found')
      }

      // Check data completeness
      const completenessThreshold = 0.8 // 80% completeness required
      const completeness = (data.dashboardMetrics?.resolutionRate || 0) / 100
      if (completeness < completenessThreshold) {
        issues.push(`Low data completeness: ${(completeness * 100).toFixed(1)}%`)
      }

      return {
        isValid: issues.length === 0,
        issues
      }
    } catch (error) {
      console.error('❌ Error validating data:', error)
      return {
        isValid: false,
        issues: ['Data validation failed: ' + (error instanceof Error ? error.message : 'Unknown error')]
      }
    }
  }
}

// Auto-load data for development - API first, then CSV fallback
if (typeof window !== 'undefined') {
  logger.info('🔄 Attempting to load data from live API...');

  // Dynamic import to avoid circular dependencies
  import('./apiService').then(({ apiService }) => {
    apiService.getLiveMetrics()
      .then(metrics => {
        logger.info('✅ API connected! Health Score:', metrics.health_score);
        logger.info('📊 Live data:', metrics.record_count, 'records from', metrics.data_source);
      })
      .catch(apiError => {
        logger.warn('⚠️ API unavailable, falling back to CSV:', apiError);
        DataLoader.loadFromFile('/data/Cleaned up data for dashboard - CSV.csv')
          .then(() => {
            logger.info('✅ Successfully loaded cleaned data');
            const summary = DataLoader.getDataSummary();
            logger.info('📊 Data Summary:', summary);
          })
          .catch(error => {
            console.error('❌ Failed to load cleaned data, falling back to sample data:', error);
            DataLoader.loadSampleData();
            logger.info('📊 Using mock data as fallback');
          })
      });
  });
}
