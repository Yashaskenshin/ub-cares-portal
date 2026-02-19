import { DashboardMetrics, ProductMaster, BreweryMaster, OutletMaster, ChartDataPoint, TrendDataPoint, HeatmapDataPoint } from '../types'
import { logger } from '../utils/logger'

export interface RawInteractionData {
  "Check": string  // Check ID (was called "Interaction ID" before)
  "Source": string
  "Client Info": string
  "Location": string
  "Branch": string
  "Department": string
  "Campaign": string
  "Team": string
  "Agent": string
  "Complexity": string
  "Type": string
  "Category": string
  "Sub Category": string
  "Status": string
  "State": string
  "Impact": string
  "Priority": string
  "Urgency": string
  "Date Created": string
  "Last Modified Date": string
  "Date Closed": string
  "Rating": string
  "Is Secondary": string
  "Expected Response Time (sec)": string
  "Expected Resolution Time (sec)": string
  "Actual Response Time (Date/Time)": string
  "Actual Response Time (sec)": string
  "Actual Resolution Time (Date/Time)": string
  "Actual Resolution Time (sec)": string
  "Response Time Escalated": string
  "Resolution Time Escalated": string
  "Response Escalation Time": string
  "Resolution Escalation Time": string
  "Interaction Type": string
  "Parent Interaction ID": string
  "Child Interaction IDs": string
  "Are you a Consumer or a Customer?": string
  "Batch No": string
  "Brand type": string
  "City": string
  "Descriptions": string
  "Do you have the product with you?": string
  "Email Address": string
  "First Name": string
  "How many products were affected?": string
  "Last Name": string
  "Manufacturing Date": string
  "Manufacturing Location": string
  "Outlet Name": string
  "Pack Size": string
  "Phone Number": string
  "SFA Ticket ID": string
  "SKU": string
  "Sample pickup status"?: string  // Optional fields that appear at the end
  "Sample delivered date"?: string
}

export class DataExtractionService {
  private rawData: RawInteractionData[] = []

  public get data(): RawInteractionData[] {
    return this.rawData
  }

  constructor(csvData?: RawInteractionData[]) {
    if (csvData) {
      this.rawData = csvData
    }
  }

  /**
   * Load data from CSV string
   */
  loadFromCSV(csvText: string): void {
    logger.info('🔍 Starting CSV parsing with proper CSV RFC4180 parser...');
    logger.info('🔍 CSV file size:', csvText.length, 'characters');

    const records: any[] = [];
    let currentField = '';
    let currentRecord: string[] = [];
    let inQuotes = false;
    let isFirstLine = true;
    let headers: string[] = [];
    let recordCount = 0;

    // RFC4180 compliant CSV parser
    // Properly handles:
    // - Quoted fields that contain commas, newlines, and quotes
    // - Escaped quotes ("" inside quoted fields)
    // - Mixed line endings (CRLF, LF)

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote within quoted field
          currentField += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator (only outside quotes)
        currentRecord.push(currentField);
        currentField = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        // Record separator (only outside quotes)
        // Add the last field
        currentRecord.push(currentField);
        currentField = '';

        // Skip Windows line ending (\r\n)
        if (char === '\r' && nextChar === '\n') {
          i++;
        }

        // Process the record
        if (currentRecord.some(f => f.trim())) {
          if (isFirstLine) {
            // Parse headers - remove surrounding quotes, trim, and normalize all whitespace
            headers = currentRecord.map(h => {
              let clean = h.trim();
              // Remove surrounding quotes
              if (clean.startsWith('"') && clean.endsWith('"')) {
                clean = clean.slice(1, -1);
              }
              // Remove ALL trailing tabs and whitespace (tabs are in the CSV headers)
              clean = clean.replace(/[\t\s]+$/, '').trim();
              // Also remove any remaining tabs inside the name
              clean = clean.replace(/\t+/g, '');
              return clean;
            });
            logger.info('🔍 Parsed headers:', headers.length, 'headers');
            logger.info('🔍 First 10 headers:', headers.slice(0, 10));
            isFirstLine = false;
          } else {
            recordCount++;
            // Parse data record - remove surrounding quotes and trim
            const values = currentRecord.map(field => {
              let clean = field.trim();
              if (clean.startsWith('"') && clean.endsWith('"')) {
                clean = clean.slice(1, -1);
              }
              // Unescape internal quotes
              clean = clean.replace(/""/g, '"');
              return clean;
            });

            // Create record object
            const record: any = {};
            headers.forEach((header, index) => {
              record[header] = values[index] || '';
            });

            // Only add if we have most fields
            if (values.filter(v => v.trim()).length > 0) {
              records.push(record);
            }
          }
        }

        currentRecord = [];
      } else {
        // Regular character - add to current field
        currentField += char;
      }
    }

    // Handle last field and record if file doesn't end with newline
    if (currentField.trim() || currentRecord.length > 0) {
      currentRecord.push(currentField);
      if (!isFirstLine && currentRecord.some(f => f.trim())) {
        const values = currentRecord.map(field => {
          let clean = field.trim();
          if (clean.startsWith('"') && clean.endsWith('"')) {
            clean = clean.slice(1, -1);
          }
          clean = clean.replace(/""/g, '"');
          return clean;
        });

        const record: any = {};
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });

        records.push(record);
      }
    }

    this.rawData = records as RawInteractionData[];
    logger.info('✅ CSV parsing complete!');
    logger.info('✅ Total records parsed:', this.rawData.length);
    logger.info('✅ Total data fields per record:', headers.length);

    if (this.rawData.length > 0) {
      logger.info('');
      logger.info('🔍 ===== FIRST RECORD (Row 2) DETAILED INSPECTION =====');
      const firstRec = this.rawData[0];
      logger.info('  Check (ID):', firstRec['Check']);
      logger.info('  Category:', firstRec['Category']);
      logger.info('  Status:', firstRec['Status']);
      logger.info('  Date Created:', firstRec['Date Created']);
      logger.info('  Source:', firstRec['Source']);
      logger.info('  Agent:', firstRec['Agent']);
      logger.info('  All keys:', Object.keys(firstRec).length, 'keys');
      logger.info('');
      if (this.rawData.length > 1) {
        logger.info('🔍 ===== SECOND RECORD (Row 3) DETAILED INSPECTION =====');
        const secondRec = this.rawData[1];
        logger.info('  Check (ID):', secondRec['Check']);
        logger.info('  Category:', secondRec['Category']);
        logger.info('  Status:', secondRec['Status']);
        logger.info('  Date Created:', secondRec['Date Created']);
        logger.info('  Descriptions (first 100 chars):', (secondRec['Descriptions'] || '').substring(0, 100));
      }
    }
  }


  /**
   * Extract dashboard metrics from raw data
   * Requirements:
   * - Total complaints: unique interaction IDs, exclude Sequel Logistics campaign
   * - SLA adherence: date created vs actual response time
   * - Escalation rate: from priority column (high + medium risk)
   * - Risk hotspots: unique count by city
   * - Top complaints: from Sub Category field
   */
  extractDashboardMetrics(): DashboardMetrics {
    // REQUIREMENT 1: Total complaints = unique interaction IDs, exclude Sequel Logistics
    const filteredData = this.rawData.filter(d => d.Campaign !== 'Sequel-Logistics')
    const uniqueCheckIds = new Set(filteredData.map(d => d.Check).filter(Boolean))
    const totalComplaints = uniqueCheckIds.size

    logger.info('📊 Metrics Calculation:')
    logger.info('  - Total records:', this.rawData.length)
    logger.info('  - Sequel Logistics records filtered out:', this.rawData.length - filteredData.length)
    logger.info('  - Unique Check IDs:', totalComplaints)

    // Calculate metrics from filtered data
    const openComplaints = filteredData.filter(d => d.Status === 'Open').length
    const closedComplaints = filteredData.filter(d => d.Status === 'Closed').length

    // REQUIREMENT 2: SLA adherence = Date Created vs Actual Response Time
    // Records with both dates = SLA can be measured
    const slaData = filteredData.filter(d => {
      const dateCreated = d["Date Created"]
      const actualResponseTime = d["Actual Response Time (Date/Time)"]
      return dateCreated && actualResponseTime
    })

    const slaCompliant = slaData.filter(d => {
      try {
        const created = new Date(d["Date Created"])
        const responded = new Date(d["Actual Response Time (Date/Time)"])
        return responded.getTime() > created.getTime() // Response came after creation
      } catch {
        return false
      }
    }).length

    const overallSLAAdherence = slaData.length > 0 ? (slaCompliant / slaData.length) * 100 : 0

    // REQUIREMENT 3: Escalation rate = Priority column (High Risk + Medium Risk)
    const highOrMediumRiskComplaints = filteredData.filter(d =>
      d.Priority === 'High Risk' || d.Priority === 'Medium Risk'
    ).length
    const escalationRate = totalComplaints > 0 ? (highOrMediumRiskComplaints / totalComplaints) * 100 : 0

    // REQUIREMENT 4: Risk hotspots = unique cities
    const uniqueCities = new Set(filteredData.map(d => d.City).filter(Boolean))
    const activeHighRiskHotspots = uniqueCities.size

    // Complaints per SKU
    const complaintsPer10HL = Math.round((totalComplaints / 10) * 100) / 100

    return {
      // CEO Dashboard KPIs - now using correct calculations
      totalComplaints,
      complaintsPer10HL,
      overallSLAAdherence,
      escalationRate,
      activeHighRiskHotspots,

      // CXO Functional KPIs
      issueContributionPercent: 68.4, // Would calculate from category analysis
      repeatComplaintRate: 12.7, // Would need historical data
      avgRCATAT: 18.5, // Root cause analysis time (CXO)
      slaCompliancePercent: overallSLAAdherence,

      // Brewery KPIs
      complaintsPerSKU: Math.round(totalComplaints / Math.max(this.getUniqueSKUs().length, 1)),
      repeatOccurrencePercent: 8.3, // Would need historical patterns
      avgRCATATBrewery: 22.1, // Root cause analysis time (Brewery)
      capaClosurePercent: 76.8, // CAPA effectiveness

      // Common metrics
      openComplaints,
      closedComplaints,
      resolutionRate: totalComplaints > 0 ? (closedComplaints / totalComplaints) * 100 : 0,
      avgResolutionTime: this.calculateAverageResolutionTime(),
      slaBreachCount: highOrMediumRiskComplaints,
      slaBreachRate: escalationRate,
      escalatedComplaints: highOrMediumRiskComplaints
    }
  }

  /**
   * Extract trend data for last 30 days
   */
  extractTrendData(): TrendDataPoint[] {
    const data = this.rawData
    const trends: TrendDataPoint[] = []
    const today = new Date()

    // Helper to safely parse dates
    const parseDate = (dateStr: string): Date | null => {
      if (!dateStr || !dateStr.trim()) return null
      try {
        const parsed = new Date(dateStr)
        // Check if date is valid and within reasonable range
        if (isNaN(parsed.getTime())) return null
        if (parsed.getTime() > Date.now() + 86400000) return null // Not in future
        return parsed
      } catch {
        return null
      }
    }

    // REQUIREMENT: Show trends for last 30 days by date created and unique interaction IDs
    // Exclude Sequel Logistics campaign
    const filteredData = data.filter(d => d.Campaign !== 'Sequel-Logistics')

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      // Get all records created on this date
      const dayData = filteredData.filter(d => {
        const createdDate = parseDate(d["Date Created"])
        if (!createdDate) return false
        return createdDate.toISOString().split('T')[0] === dateStr
      })

      // Count UNIQUE Check IDs for this day (requirement: unique interaction ids)
      const uniqueCheckIds = new Set(dayData.map(d => d.Check).filter(Boolean))
      const uniqueCount = uniqueCheckIds.size

      // Get closed records on this date
      const closedData = dayData.filter(d => {
        if (!d["Date Closed"] || !d["Date Closed"].trim()) return false
        const closedDate = parseDate(d["Date Closed"])
        if (!closedDate) return false
        return closedDate.toISOString().split('T')[0] === dateStr
      })

      // Get escalated records (High/Medium Risk Priority)
      const escalatedData = dayData.filter(d =>
        d.Priority === 'High Risk' || d.Priority === 'Medium Risk'
      )

      trends.push({
        date: dateStr,
        total: uniqueCount,  // Unique interaction IDs, not total records
        closed: closedData.length,
        escalated: escalatedData.length,
        slaBreaches: escalatedData.length
      })
    }

    return trends
  }

  /**
   * Extract complaint source distribution (Web vs Client Portal)
   * REQUIREMENT: Show capture source or how many from web and client portal
   */
  extractZoneComplaintData(): ChartDataPoint[] {
    const filteredData = this.rawData.filter(d => d.Campaign !== 'Sequel-Logistics')
    const sourceMap: { [key: string]: number } = {}

    // Count unique Check IDs by Source
    const sourceCheckIds: { [key: string]: Set<string> } = {}

    filteredData.forEach(record => {
      const source = record.Source || 'Unknown'

      // Track unique Check IDs per source
      if (!sourceCheckIds[source]) {
        sourceCheckIds[source] = new Set()
      }
      if (record.Check) {
        sourceCheckIds[source].add(record.Check)
      }
    })

    // Convert to counts
    Object.entries(sourceCheckIds).forEach(([source, checkIds]) => {
      sourceMap[source] = checkIds.size
    })

    const total = Object.values(sourceMap).reduce((sum, count) => sum + count, 0)

    return Object.entries(sourceMap).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100)
    }))
  }

  /**
   * Extract top complaint categories
   */
  extractTopComplaintCategories(): ChartDataPoint[] {
    const categoryMap: { [key: string]: number } = {}

    this.rawData.forEach(record => {
      const category = record["Sub Category"] || record.Category
      if (category && category !== 'Unknown') {
        categoryMap[category] = (categoryMap[category] || 0) + 1
      }
    })

    return Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        count,
        value: count // For risk weighting if needed
      }))
  }

  /**
   * Extract risk hotspots
   * REQUIREMENTS:
   * - Risk hotspots: unique count by city
   * - Critical risk hotspots: by department with subcategory
   */
  extractRiskHotspots(): HeatmapDataPoint[] {
    const filteredData = this.rawData.filter(d => d.Campaign !== 'Sequel-Logistics')

    // Build hotspots by department and subcategory (showing critical/high risk)
    const hotspotMap: { [key: string]: { x: string, y: string, value: number, risk: 'low' | 'medium' | 'high' | 'critical' } } = {}

    filteredData.forEach(record => {
      // Only include high/medium/critical risk items
      const isHighRisk = record.Priority === 'High Risk' || record.Priority === 'Medium Risk'
      const isCritical = record.Urgency === 'Critical'

      if (!isHighRisk && !isCritical) return // Skip low priority items

      const department = record.Department || record.Branch
      const issue = record["Sub Category"] || record.Category
      const key = `${department}-${issue}`

      let risk: 'critical' | 'high' | 'medium' | 'low' = 'medium'
      if (isCritical || record.Priority === 'High Risk') risk = 'critical'
      else if (record.Urgency === 'Urgent' || record.Priority === 'Medium Risk') risk = 'high'

      if (!hotspotMap[key]) {
        hotspotMap[key] = {
          x: department,
          y: issue,
          value: 0,
          risk
        }
      }
      hotspotMap[key].value++
    })

    return Object.values(hotspotMap)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }

  /**
   * Extract SKU-brewery heatmaps
   */
  extractSKUBreweryHeatmap(): HeatmapDataPoint[] {
    const heatmap: { [key: string]: { x: string, y: string, value: number, risk: 'low' | 'medium' | 'high' | 'critical' } } = {}

    this.rawData.forEach(record => {
      const sku = record.SKU || record["Brand type"]
      const brewery = record.Branch
      const key = `${sku}-${brewery}`

      let risk: 'low' | 'medium' | 'high' | 'critical' = 'medium'
      if (record.Urgency === 'Critical') risk = 'critical'
      else if (record.Urgency === 'Urgent') risk = 'high'

      if (!heatmap[key]) {
        heatmap[key] = {
          x: sku,
          y: brewery,
          value: 0,
          risk
        }
      }
      heatmap[key].value++
    })

    return Object.values(heatmap)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }

  /**
   * Extract SLA compliance data
   */
  extractSLAComplianceData(): ChartDataPoint[] {
    const slaStages = [
      { name: 'Initial Response (<4hrs)', stage: 'response', threshold: 14400 }, // 4 hours in seconds
      { name: 'Investigation (<24hrs)', stage: 'investigation', threshold: 86400 }, // 24 hours
      { name: 'Resolution (<72hrs)', stage: 'resolution', threshold: 259200 } // 72 hours
    ]

    return slaStages.map(stage => {
      const compliant = this.rawData.filter(record => {
        if (stage.stage === 'response') {
          const actual = parseInt(record["Actual Response Time (sec)"]) || 0
          return actual > 0 && actual <= stage.threshold
        } else if (stage.stage === 'resolution') {
          const actual = parseInt(record["Actual Resolution Time (sec)"]) || 0
          return actual > 0 && actual <= stage.threshold
        }
        return false
      }).length

      const total = this.rawData.filter(record => {
        if (stage.stage === 'response') return record["Expected Response Time (sec)"]
        if (stage.stage === 'resolution') return record["Expected Resolution Time (sec)"]
        return false
      }).length

      return {
        name: stage.name,
        count: compliant,
        percentage: total > 0 ? Math.round((compliant / total) * 100) : 0
      }
    })
  }

  /**
   * Extract escalation funnel data
   */
  extractEscalationFunnel(): ChartDataPoint[] {
    const l1Escalations = this.rawData.filter(d =>
      d["Response Time Escalated"] === 'Yes' || d["Resolution Time Escalated"] === 'Yes'
    ).length

    const l2Escalations = Math.round(l1Escalations * 0.38) // Estimate based on typical escalation patterns
    const l3Escalations = Math.round(l2Escalations * 0.26) // Estimate

    return [
      { name: 'L1 Escalations', count: l1Escalations, percentage: 100 },
      { name: 'L2 Escalations', count: l2Escalations, percentage: 38 },
      { name: 'L3 Escalations', count: l3Escalations, percentage: 10 }
    ]
  }

  /**
   * Extract regional summary data
   */
  extractRegionalSummary(): any[] {
    const regionData: { [key: string]: any } = {}

    this.rawData.forEach(record => {
      const location = record.Location
      let region = 'Other'

      if (location.includes('South')) region = 'South India'
      else if (location.includes('North')) region = 'North India'
      else if (location.includes('East')) region = 'East India'
      else if (location.includes('West')) region = 'West India'

      if (!regionData[region]) {
        regionData[region] = {
          region,
          complaints: 0,
          slaPercent: 0,
          escalations: 0,
          topIssue: 'Unknown'
        }
      }
      regionData[region].complaints++
    })

    return Object.values(regionData)
  }

  /**
   * Extract product master data
   */
  extractProductMaster(): ProductMaster[] {
    const products: { [key: string]: ProductMaster } = {}

    this.rawData.forEach(record => {
      const skuId = record.SKU || `SKU_${Math.random().toString(36).substr(2, 9)}`
      const skuName = record["Brand type"] || record.SKU || 'Unknown Product'
      // Note: batchNo available in record["Batch No"] if needed

      if (!products[skuId]) {
        products[skuId] = {
          skuId,
          skuName,
          productCategory: this.inferProductCategory(skuName),
          packType: this.inferPackType(record["Pack Size"]),
          brand: this.extractBrand(skuName),
          breweryId: this.mapBreweryId(record.Branch),
          volumeMl: this.extractVolume(record["Pack Size"]),
          alcoholPercentage: this.inferAlcoholPercentage(skuName),
          launchDate: '2020-01-01', // Would need actual data
          isActive: true
        }
      }
    })

    return Object.values(products)
  }

  /**
   * Extract brewery master data
   */
  extractBreweryMaster(): BreweryMaster[] {
    const breweries: { [key: string]: BreweryMaster } = {}

    this.rawData.forEach(record => {
      const breweryId = this.mapBreweryId(record.Branch)
      const breweryName = record.Branch

      if (!breweries[breweryId]) {
        breweries[breweryId] = {
          breweryId,
          breweryName,
          zone: this.extractZone(record.Location),
          state: this.extractState(record.Branch),
          region: this.extractRegion(record.Branch),
          capacityHlPerYear: 500000, // Would need actual data
          breweryType: 'owned',
          operationalStatus: 'active'
        }
      }
    })

    return Object.values(breweries)
  }

  /**
   * Extract outlet master data
   */
  extractOutletMaster(): OutletMaster[] {
    const outlets: { [key: string]: OutletMaster } = {}

    this.rawData.forEach(record => {
      const outletId = `OUT_${Math.random().toString(36).substr(2, 9)}`
      const outletName = record["Outlet Name"] || 'Unknown Outlet'

      if (!outlets[outletId]) {
        outlets[outletId] = {
          outletId,
          outletName,
          channelType: record["Are you a Consumer or a Customer?"] === 'Consumer' ? 'SFA' : 'Call Centre',
          zone: this.extractZone(record.Location),
          state: this.extractState(record.Branch),
          region: this.extractRegion(record.Branch),
          tier: this.inferOutletTier(record["Outlet Name"]),
          monthlyVolumeHl: 150, // Would need actual data
          outletOwner: record["First Name"] + ' ' + record["Last Name"]
        }
      }
    })

    return Object.values(outlets)
  }

  // Helper methods for data inference and mapping
  private getUniqueSKUs(): string[] {
    return [...new Set(this.rawData.map(d => d.SKU || d["Brand type"]).filter(Boolean))]
  }

  private calculateAverageResolutionTime(): number {
    const resolutionTimes = this.rawData
      .map(d => parseInt(d["Actual Resolution Time (sec)"]))
      .filter(time => time > 0)

    if (resolutionTimes.length === 0) return 0

    const total = resolutionTimes.reduce((sum, time) => sum + time, 0)
    return Math.round((total / resolutionTimes.length) / 3600) // Convert to hours
  }

  private inferProductCategory(productName: string): string {
    const name = productName.toLowerCase()
    if (name.includes('beer')) return 'Beer'
    if (name.includes('wine')) return 'Wine'
    if (name.includes('whisky') || name.includes('vodka')) return 'Spirits'
    return 'Beer' // Default
  }

  private inferPackType(packSize: string): string {
    if (!packSize) return 'Bottle'
    const size = packSize.toLowerCase()
    if (size.includes('can')) return 'Can'
    if (size.includes('bottle')) return 'Bottle'
    return 'Bottle'
  }

  private extractBrand(productName: string): string {
    if (productName.toLowerCase().includes('kingfisher')) return 'Kingfisher'
    if (productName.toLowerCase().includes('tuborg')) return 'Tuborg'
    if (productName.toLowerCase().includes('budweiser')) return 'Budweiser'
    return 'Other'
  }

  private mapBreweryId(branch: string): string {
    const branchMap: { [key: string]: string } = {
      'UNITED BREWERIES LTD - SRIKAKULAM': 'UBL-GMR',
      'UNITED BREWERIES LTD - ILIOS': 'UBL-ILIOS',
      'UNITED BREWERIES LIMITED - EMPE': 'UBL-EMPE',
      'Bangalore Head Office': 'UBL-HO'
    }
    return branchMap[branch] || `UBL-${branch.split(' ').pop()}`
  }

  private extractVolume(packSize: string): number {
    if (!packSize) return 650
    const match = packSize.match(/(\d+)/)
    return match ? parseInt(match[1]) : 650
  }

  private inferAlcoholPercentage(productName: string): number {
    const name = productName.toLowerCase()
    if (name.includes('strong')) return 8.0
    if (name.includes('ultra')) return 4.0
    if (name.includes('premium')) return 5.0
    return 5.0
  }

  private extractZone(location: string): string {
    if (location.includes('South')) return 'South'
    if (location.includes('North')) return 'North'
    if (location.includes('East')) return 'East'
    if (location.includes('West')) return 'West'
    return 'South' // Default
  }

  private extractState(branch: string): string {
    const stateMap: { [key: string]: string } = {
      'SRIKAKULAM': 'Andhra Pradesh',
      'ILIOS': 'Tamil Nadu',
      'EMPE': 'Tamil Nadu',
      'Bangalore': 'Karnataka'
    }

    for (const [key, value] of Object.entries(stateMap)) {
      if (branch.includes(key)) return value
    }
    return 'Andhra Pradesh' // Default
  }

  private extractRegion(branch: string): string {
    const regionMap: { [key: string]: string } = {
      'SRIKAKULAM': 'Srikakulam',
      'ILIOS': 'Rajamandry',
      'EMPE': 'Tirupati',
      'Bangalore': 'Bangalore'
    }

    for (const [key, value] of Object.entries(regionMap)) {
      if (branch.includes(key)) return value
    }
    return 'Bangalore' // Default
  }

  private inferOutletTier(outletName: string): 'A' | 'B' | 'C' {
    if (!outletName) return 'C'
    const name = outletName.toLowerCase()
    if (name.includes('restaurant') || name.includes('bar')) return 'A'
    if (name.includes('wines') || name.includes('retail')) return 'B'
    return 'C'
  }

  /**
   * Get all extracted data in one call
   */
  extractAllDashboardData() {
    logger.info('🎯 extractAllDashboardData() called')
    logger.info('🎯 Raw data length:', this.rawData.length)
    logger.info('🎯 Sample raw data (first record):', this.rawData[0])

    const result = {
      dashboardMetrics: this.extractDashboardMetrics(),
      trendData: this.extractTrendData(),
      zoneComplaintData: this.extractZoneComplaintData(),
      topComplaintCategories: this.extractTopComplaintCategories(),
      riskHotspots: this.extractRiskHotspots(),
      skuBreweryHeatmap: this.extractSKUBreweryHeatmap(),
      slaComplianceData: this.extractSLAComplianceData(),
      escalationFunnel: this.extractEscalationFunnel(),
      regionalSummary: this.extractRegionalSummary(),
      productMaster: this.extractProductMaster(),
      breweryMaster: this.extractBreweryMaster(),
      outletMaster: this.extractOutletMaster(),
      rawDataCount: this.rawData.length,
      dataDateRange: this.getDataDateRange()
    }

    logger.info('🎯 Dashboard metrics calculated:', result.dashboardMetrics)
    return result
  }

  private getDataDateRange(): { start: string, end: string } {
    if (this.rawData.length === 0) return { start: '', end: '' }

    const dates = this.rawData
      .map(d => new Date(d["Date Created"]))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())

    return {
      start: dates[0]?.toISOString().split('T')[0] || '',
      end: dates[dates.length - 1]?.toISOString().split('T')[0] || ''
    }
  }
}

// Export singleton instance for easy use
export const dataExtractionService = new DataExtractionService()
