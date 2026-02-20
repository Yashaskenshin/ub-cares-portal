import { DataLoader } from './dataLoader';
import { dataExtractionService } from './dataExtractionService';
import { logger } from '../utils/logger';

export interface PowerBIDataExport {
  rawData: any[];
  metrics: any;
  trendData: any[];
  categoryData: any[];
  zoneData: any[];
  riskHotspots: any[];
  exportTimestamp: string;
  dataQuality: {
    totalRecords: number;
    dateRange: { start: string; end: string };
    validationStatus: 'valid' | 'warning' | 'error';
    issues: string[];
  };
}

export class DataExportService {
  /**
   * Generate comprehensive data export for Power BI
   */
  static async generatePowerBIDataExport(): Promise<PowerBIDataExport> {
    logger.info('📊 Generating Power BI data export...');

    const dataSummary = DataLoader.getDataSummary();
    const validation = DataLoader.validateData();

    const exportData: PowerBIDataExport = {
      rawData: dataExtractionService.data,
      metrics: dataSummary.metrics,
      trendData: dataSummary.zones || [],
      categoryData: dataSummary.topCategories || [],
      zoneData: dataSummary.zones || [],
      riskHotspots: dataSummary.zones || [],
      exportTimestamp: new Date().toISOString(),
      dataQuality: {
        totalRecords: dataSummary.totalRecords || 0,
        dateRange: dataSummary.dateRange || { start: '', end: '' },
        validationStatus: validation.isValid ? 'valid' : validation.issues.length > 0 ? 'warning' : 'error',
        issues: validation.issues
      }
    };

    logger.info('✅ Power BI export data generated:', {
      records: exportData.rawData.length,
      metrics: Object.keys(exportData.metrics).length,
      timestamp: exportData.exportTimestamp
    });

    return exportData;
  }

  /**
   * Convert data to CSV format
   */
  static convertToCSV(data: any[], headers?: string[]): string {
    if (!data || data.length === 0) return '';

    // Get headers from first object if not provided
    const csvHeaders = headers || Object.keys(data[0]);

    // Create CSV header row
    const csvRows = [csvHeaders.join(',')];

    // Create data rows
    data.forEach(row => {
      const values = csvHeaders.map(header => {
        const value = row[header];
        // Handle different data types
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`; // Escape quotes and wrap in quotes
        }
        return String(value);
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Generate multiple CSV files for Power BI import
   */
  static async generatePowerBICSVs(): Promise<{ [filename: string]: string }> {
    logger.info('📊 Generating Power BI CSV files...');

    const exportData = await this.generatePowerBIDataExport();
    const csvFiles: { [filename: string]: string } = {};

    // 1. Raw complaint data
    csvFiles['complaints_raw.csv'] = this.convertToCSV(exportData.rawData);

    // 2. Daily trend data
    const trendData = exportData.trendData.map(trend => ({
      date: trend.date,
      total_complaints: trend.total || 0,
      resolved_complaints: trend.closed || 0,
      escalated_complaints: trend.escalated || 0,
      sla_breaches: trend.slaBreaches || 0
    }));
    csvFiles['complaints_trends.csv'] = this.convertToCSV(trendData);

    // 3. Category breakdown
    const categoryData = exportData.categoryData.map(cat => ({
      category: cat.name || cat.category,
      complaint_count: cat.count,
      percentage: cat.percentage
    }));
    csvFiles['complaint_categories.csv'] = this.convertToCSV(categoryData);

    // 4. Zone/Source breakdown
    const zoneData = exportData.zoneData.map(zone => ({
      zone: zone.name,
      complaint_count: zone.count,
      percentage: zone.percentage
    }));
    csvFiles['complaint_zones.csv'] = this.convertToCSV(zoneData);

    // 5. Risk hotspots
    const riskData = exportData.riskHotspots.map(hotspot => ({
      department: hotspot.x,
      subcategory: hotspot.y,
      complaint_count: hotspot.value,
      risk_level: hotspot.risk
    }));
    csvFiles['risk_hotspots.csv'] = this.convertToCSV(riskData);

    // 6. Key metrics summary
    const metricsData = [{
      metric: 'Total Complaints',
      value: exportData.metrics.totalComplaints,
      unit: 'count'
    }, {
      metric: 'Resolution Rate',
      value: exportData.metrics.resolutionRate,
      unit: 'percentage'
    }, {
      metric: 'SLA Adherence',
      value: exportData.metrics.overallSLAAdherence,
      unit: 'percentage'
    }, {
      metric: 'Escalation Rate',
      value: exportData.metrics.escalationRate,
      unit: 'percentage'
    }, {
      metric: 'Open Complaints',
      value: exportData.metrics.openComplaints,
      unit: 'count'
    }, {
      metric: 'Active Risk Hotspots',
      value: exportData.metrics.activeHighRiskHotspots,
      unit: 'count'
    }];
    csvFiles['key_metrics.csv'] = this.convertToCSV(metricsData);

    // 7. Data quality report
    const qualityData = [{
      total_records: exportData.dataQuality.totalRecords,
      date_range_start: exportData.dataQuality.dateRange.start,
      date_range_end: exportData.dataQuality.dateRange.end,
      validation_status: exportData.dataQuality.validationStatus,
      issues_count: exportData.dataQuality.issues.length,
      export_timestamp: exportData.exportTimestamp
    }];
    csvFiles['data_quality.csv'] = this.convertToCSV(qualityData);

    logger.info('✅ Generated CSV files for Power BI:', Object.keys(csvFiles));
    return csvFiles;
  }

  /**
   * Download a single CSV file
   */
  static downloadCSV(filename: string, csvContent: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Download all CSV files as a ZIP
   */
  static async downloadAllCSVs(): Promise<void> {
    try {
      logger.info('📦 Preparing Power BI data export...');

      const csvFiles = await this.generatePowerBICSVs();

      // Create a simple text file with all CSVs (since we don't have ZIP library)
      const exportContent = Object.entries(csvFiles)
        .map(([filename, content]) => `=== ${filename} ===\n${content}`)
        .join('\n\n');

      const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `powerbi_export_${timestamp}.txt`;

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      logger.info('✅ Power BI export downloaded:', filename);
    } catch (error) {
      logger.error('❌ Error generating Power BI export:', error);
      throw error;
    }
  }

  /**
   * Generate Power BI import instructions
   */
  static getPowerBIImportInstructions(): string {
    return `
# Power BI Dashboard Import Instructions

## Step 1: Download Data
1. Click "Export for Power BI" button in the dashboard
2. Save the exported file (powerbi_export_YYYY-MM-DD.txt)

## Step 2: Extract CSV Files
1. Open the downloaded .txt file
2. Copy each CSV section (between === filename.csv === markers)
3. Save each section as a separate .csv file

## Step 3: Import into Power BI Desktop
1. Open Power BI Desktop
2. Click "Get Data" → "Text/CSV"
3. Import each CSV file:
   - complaints_raw.csv (main fact table)
   - complaints_trends.csv (time series)
   - complaint_categories.csv (dimensions)
   - complaint_zones.csv (geographic data)
   - risk_hotspots.csv (risk analysis)
   - key_metrics.csv (KPIs)
   - data_quality.csv (metadata)

## Step 4: Create Relationships
1. Set up relationships between tables using appropriate keys
2. complaints_raw.Check → Primary key for joins
3. complaints_raw["Date Created"] → Link to trends
4. complaints_raw.Category → Link to categories

## Step 5: Create Visualizations
- Use the processed data to recreate dashboard visualizations
- Leverage the cleaned and aggregated data for advanced analytics

## Data Quality Notes
- All Sequel Logistics campaigns have been filtered out
- Duplicate complaints removed using unique Check IDs
- SLA calculations based on date created vs response time
- Risk analysis based on Priority (High/Medium) fields
`;
  }
}

// Export singleton
export const dataExportService = DataExportService;
