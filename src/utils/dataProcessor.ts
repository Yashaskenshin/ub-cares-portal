export interface ComplaintRecord {
  interactionId: string;
  source: string;
  location: string;
  branch: string;
  department: string;
  agent: string;
  type: string;
  category: string;
  subCategory: string;
  status: string;
  state: string;
  impact: string;
  priority: string;
  urgency: string;
  dateCreated: Date;
  lastModifiedDate: Date;
  dateClosed?: Date;
  rating?: string;
  firstName?: string;
  lastName?: string;
  customerName?: string;
  email?: string;
  city?: string;
  brand?: string;
  sku?: string;
  packSize?: string;
  batchNumber?: string;
  manufacturingDate?: Date;
  manufacturingLocation?: string;
  outletName?: string;
  consumerType?: string;
  description?: string;
  phoneNumber?: string;
  productName?: string;
  isEscalated?: boolean;
  slaBreach?: boolean;
}

export class DataProcessor {
  static processComplaintData(csvData: any[]): ComplaintRecord[] {
    return csvData.map(row => {
      // Clean and standardize batch number
      const batchNumber = this.cleanBatchNumber(row['Batch No\t']);

      // Handle manufacturing date (fix future dates)
      const manufacturingDate = this.parseManufacturingDate(row['Manufacturing Date']);

      // Create customer full name
      const customerName = this.createCustomerName(row['First Name'], row['Last Name']);

      // Create product name
      const productName = this.createProductName(row['Brand type\t'], row['Pack Size']);

      // Check for escalation
      const isEscalated = this.checkEscalation(row);

      // Check SLA breach (simplified logic)
      const slaBreach = this.checkSLABreach(row);

      return {
        interactionId: row['Check'] || '',
        source: row['Source'] || 'Unknown',
        location: row['Location'] || 'Unknown',
        branch: row['Branch'] || 'Unknown',
        department: row['Department'] || 'Unknown',
        agent: row['Agent'] || 'Unknown',
        type: row['Type'] || 'Unknown',
        category: row['Category'] || 'Unknown',
        subCategory: row['Sub Category'] || 'Unknown',
        status: row['Status'] || 'Unknown',
        state: row['State'] || 'Unknown',
        impact: row['Impact'] || 'Unknown',
        priority: row['Priority'] || 'Unknown',
        urgency: row['Urgency'] || 'Unknown',
        dateCreated: new Date(row['Date Created']),
        lastModifiedDate: new Date(row['Last Modified Date']),
        dateClosed: row['Date Closed'] ? new Date(row['Date Closed']) : undefined,
        rating: row['Rating'] || undefined,
        firstName: row['First Name'] || undefined,
        lastName: row['Last Name'] || undefined,
        customerName,
        email: this.cleanEmail(row['Email Address\t']),
        city: row['City'] || undefined,
        brand: row['Brand type\t'] || undefined,
        sku: row['SKU'] || undefined,
        packSize: row['Pack Size'] || undefined,
        batchNumber,
        manufacturingDate,
        manufacturingLocation: row['Manufacturing Location'] || undefined,
        outletName: row['Outlet Name'] || undefined,
        consumerType: row['Are you a Consumer or a Customer?'] || undefined,
        description: row['Descriptions'] || undefined,
        phoneNumber: this.cleanPhoneNumber(row['Phone Number']),
        productName,
        isEscalated,
        slaBreach
      };
    });
  }

  private static cleanBatchNumber(batch: string): string | undefined {
    if (!batch || batch.trim() === '') return undefined;

    // Remove extra spaces and standardize separators
    return batch.replace(/\s+/g, '').replace(/,+/g, ',');
  }

  private static parseManufacturingDate(dateStr: string): Date | undefined {
    if (!dateStr || dateStr.trim() === '') return undefined;

    try {
      const date = new Date(dateStr);

      // Check for future dates (error in data)
      if (date > new Date()) {
        console.warn(`Future manufacturing date detected: ${dateStr} for batch`);
        // For now, return undefined for future dates
        return undefined;
      }

      return date;
    } catch {
      console.warn(`Invalid manufacturing date: ${dateStr}`);
      return undefined;
    }
  }

  private static createCustomerName(firstName?: string, lastName?: string): string | undefined {
    if (!firstName && !lastName) return undefined;
    return `${firstName || ''} ${lastName || ''}`.trim();
  }

  private static createProductName(brand?: string, packSize?: string): string | undefined {
    if (!brand && !packSize) return undefined;
    return `${brand || 'Unknown Brand'} ${packSize || ''}`.trim();
  }

  private static cleanEmail(email?: string): string | undefined {
    if (!email || email.trim() === '') return undefined;
    return email.trim().toLowerCase();
  }

  private static cleanPhoneNumber(phone?: string): string | undefined {
    if (!phone || phone.trim() === '') return undefined;

    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Ensure it starts with country code
    if (cleaned.startsWith('+91')) {
      return cleaned;
    } else if (cleaned.length === 10) {
      // Add Indian country code for 10-digit numbers
      return `+91${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }

    return cleaned;
  }

  private static checkEscalation(row: any): boolean {
    // Check if any escalation flags are set
    return (row['Response Time Escalated'] === 'Yes' ||
            row['Resolution Time Escalated'] === 'Yes');
  }

  private static checkSLABreach(row: any): boolean {
    // Simplified SLA breach check
    const expectedResponse = parseInt(row['Expected Response Time (sec)']) || 0;
    const actualResponse = parseInt(row['Actual Response Time (sec)']) || 0;

    if (expectedResponse > 0 && actualResponse > 0) {
      return actualResponse > expectedResponse;
    }

    return false;
  }

  // Dashboard-ready data aggregations
  static getDashboardMetrics(records: ComplaintRecord[]) {
    const total = records.length;
    const open = records.filter(r => r.status === 'Open').length;
    const closed = records.filter(r => r.status === 'Closed').length;
    const escalated = records.filter(r => r.isEscalated).length;
    const slaBreached = records.filter(r => r.slaBreach).length;

    return {
      totalComplaints: total,
      openComplaints: open,
      closedComplaints: closed,
      escalatedComplaints: escalated,
      slaBreachCount: slaBreached,
      slaBreachRate: total > 0 ? (slaBreached / total) * 100 : 0,
      resolutionRate: total > 0 ? (closed / total) * 100 : 0
    };
  }

  static getCategoryBreakdown(records: ComplaintRecord[]) {
    const categories = records.reduce((acc, record) => {
      const category = record.category || 'Unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  static getStatusBreakdown(records: ComplaintRecord[]) {
    const statuses = records.reduce((acc, record) => {
      const status = record.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statuses)
      .map(([name, count]) => ({ name, count, percentage: (count / records.length) * 100 }))
      .sort((a, b) => b.count - a.count);
  }

  static getLocationBreakdown(records: ComplaintRecord[]) {
    const locations = records.reduce((acc, record) => {
      const location = record.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locations)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  static getPriorityBreakdown(records: ComplaintRecord[]) {
    const priorities = records.reduce((acc, record) => {
      const priority = record.priority || 'Unknown';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(priorities)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  static getAgentPerformance(records: ComplaintRecord[]) {
    const agentStats = records.reduce((acc, record) => {
      const agent = record.agent || 'Unknown';
      if (!acc[agent]) {
        acc[agent] = { total: 0, closed: 0, escalated: 0, slaBreached: 0 };
      }
      acc[agent].total++;
      if (record.status === 'Closed') acc[agent].closed++;
      if (record.isEscalated) acc[agent].escalated++;
      if (record.slaBreach) acc[agent].slaBreached++;
      return acc;
    }, {} as Record<string, { total: number; closed: number; escalated: number; slaBreached: number }>);

    return Object.entries(agentStats)
      .map(([name, stats]) => ({
        name,
        total: stats.total,
        closed: stats.closed,
        escalated: stats.escalated,
        slaBreached: stats.slaBreached,
        resolutionRate: stats.total > 0 ? (stats.closed / stats.total) * 100 : 0,
        escalationRate: stats.total > 0 ? (stats.escalated / stats.total) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 agents
  }

  static getSourceBreakdown(records: ComplaintRecord[]) {
    const sources = records.reduce((acc, record) => {
      const source = record.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sources)
      .map(([name, count]) => ({ name, count, percentage: (count / records.length) * 100 }))
      .sort((a, b) => b.count - a.count);
  }

  static getTrendData(records: ComplaintRecord[]) {
    // Group by date created (daily)
    const dailyData = records.reduce((acc, record) => {
      try {
        const date = record.dateCreated instanceof Date ? record.dateCreated : new Date(record.dateCreated);
        if (isNaN(date.getTime())) return acc; // Skip invalid dates
        
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey, total: 0, closed: 0, escalated: 0 };
        }
        acc[dateKey].total++;
        if (record.status === 'Closed') acc[dateKey].closed++;
        if (record.isEscalated) acc[dateKey].escalated++;
      } catch (error) {
        console.warn('Error processing date for trend:', error);
      }
      return acc;
    }, {} as Record<string, { date: string; total: number; closed: number; escalated: number }>);

    return Object.values(dailyData)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  }

  static getAverageResolutionTime(records: ComplaintRecord[]): number {
    const closedRecords = records.filter(r => {
      try {
        return r.dateClosed && r.dateCreated && 
               r.dateClosed instanceof Date && r.dateCreated instanceof Date &&
               !isNaN(r.dateClosed.getTime()) && !isNaN(r.dateCreated.getTime());
      } catch {
        return false;
      }
    });
    
    if (closedRecords.length === 0) return 0;

    const totalTime = closedRecords.reduce((sum, record) => {
      try {
        if (record.dateClosed && record.dateCreated) {
          const closedDate = record.dateClosed instanceof Date ? record.dateClosed : new Date(record.dateClosed);
          const createdDate = record.dateCreated instanceof Date ? record.dateCreated : new Date(record.dateCreated);
          const diff = closedDate.getTime() - createdDate.getTime();
          return sum + (diff > 0 ? diff : 0); // Only positive differences
        }
      } catch (error) {
        console.warn('Error calculating resolution time:', error);
      }
      return sum;
    }, 0);

    return Math.round(totalTime / closedRecords.length / (1000 * 60 * 60 * 24)); // Days
  }

  static getTypeBreakdown(records: ComplaintRecord[]) {
    const types = records.reduce((acc, record) => {
      const type = record.type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(types)
      .map(([name, count]) => ({ name, count, percentage: (count / records.length) * 100 }))
      .sort((a, b) => b.count - a.count);
  }

  static getBrandBreakdown(records: ComplaintRecord[]) {
    const brands = records.reduce((acc, record) => {
      const brand = record.brand || 'Unknown';
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(brands)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 brands
  }
}
