// Page types for navigation
export type PageType =
  | 'dashboard'
  | 'issues'
  | 'process'
  | 'breweries'
  | 'sla'
  | 'documentation'
  | 'training'
  | 'escalation'

// User roles and permissions as per BRD
export type UserRole =
  | 'ceo'
  | 'cxo_quality'
  | 'cxo_sales'
  | 'cxo_supply_chain'
  | 'cxo_marketing'
  | 'extended_leadership'
  | 'brewery_leadership'
  | 'sales_leadership'
  | 'governance_ctc'
  | 'operational_cx'
  | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  zone?: string
  state?: string
  region?: string
  brewery?: string
  department?: string
  permissions: Permission[]
}

export interface Permission {
  resource: string
  action: 'read' | 'write' | 'delete' | 'admin'
  scope?: string // e.g., 'national', 'regional', 'brewery'
}

// Dashboard metrics as per BRD requirements
export interface DashboardMetrics {
  // CEO Dashboard KPIs
  totalComplaints: number
  complaintsPer10HL: number
  overallSLAAdherence: number
  escalationRate: number
  activeHighRiskHotspots: number

  // CXO Functional KPIs
  issueContributionPercent: number
  repeatComplaintRate: number
  avgRCATAT: number
  slaCompliancePercent: number

  // Brewery KPIs
  complaintsPerSKU: number
  repeatOccurrencePercent: number
  avgRCATATBrewery: number // Renamed from avgRCATAT to avoid duplicate
  capaClosurePercent: number

  // Common metrics
  openComplaints: number
  closedComplaints: number
  resolutionRate: number
  avgResolutionTime: number
  slaBreachCount: number
  slaBreachRate: number
  escalatedComplaints: number
}

// Master data interfaces (to be populated later)
export interface ProductMaster {
  skuId: string
  skuName: string
  productCategory: string
  packType: string
  brand: string
  breweryId: string
  volumeMl: number
  alcoholPercentage: number
  launchDate: string
  isActive: boolean
}

export interface BreweryMaster {
  breweryId: string
  breweryName: string
  zone: string
  state: string
  region: string
  capacityHlPerYear: number
  breweryType: 'owned' | 'contract' | 'Own' | 'Contract'
  operationalStatus: 'active' | 'inactive'
}

export interface OutletMaster {
  outletId: string
  outletName: string
  channelType: 'SFA' | 'Call Centre' | 'WhatsApp' | 'Email'
  zone: string
  state: string
  region: string
  tier: 'A' | 'B' | 'C'
  monthlyVolumeHl: number
  outletOwner: string
}

// Common filter interface per BRD
export interface DashboardFilters {
  dateRange: {
    start: Date
    end: Date
  }
  zone?: string[]
  state?: string[]
  brewery?: string[]
  productCategory?: string[]
  sku?: string[]
  issueCategory?: string[]
  subCategory?: string[]
  channel?: string[]
  complaintType?: string[]
  priority?: string[]
  status?: string[]
}

// Risk scoring interface
export interface RiskScore {
  complaintId: string
  riskScore: number
  severityWeight: number
  volumeWeight: number
  recurrenceRate: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'Low' | 'Medium' | 'High' | 'Critical'
}

// CAPA tracking interface
export interface CAPAData {
  capaId: string
  complaintId: string
  rootCause: string
  correctiveAction: string
  preventiveAction: string
  assignedTo: string
  targetCompletionDate: Date
  actualCompletionDate?: Date
  status: 'open' | 'in_progress' | 'completed' | 'overdue'
  effectivenessVerified: boolean
  recurrenceCheckDate?: Date
}

// SLA tracking interface
export interface SLATracking {
  complaintId: string
  stage: string
  slaHours: number
  startDatetime: Date
  endDatetime?: Date
  actualHours: number
  breached: boolean
  breachReason?: string
  escalationLevel: number
}

// Geographic hierarchy
export interface GeographicHierarchy {
  zone: string
  state: string
  region: string
  district: string
  city: string
  pincode: string
}

// Dashboard component props
export interface DashboardProps {
  user: User
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
  isLoading?: boolean
  lastUpdated?: Date
}

// Chart data interfaces
export interface ChartDataPoint {
  name: string
  count: number
  percentage?: number
  value?: number
  trend?: number
}

export interface TrendDataPoint {
  date: string
  total: number
  closed: number
  escalated: number
  slaBreaches?: number
}

export interface HeatmapDataPoint {
  x: string
  y: string
  value: number
  risk?: 'low' | 'medium' | 'high' | 'critical'
}

// Priority and Risk types used in helpers
export type PriorityType = 'Critical' | 'Urgent' | 'Medium' | 'Low' | 'High'
export type RiskType = 'High' | 'Medium' | 'Low' | 'Critical' | 'urgent' | 'high' | 'medium' | 'low' | 'critical'

// Brewery interface for brewery data
export interface Brewery {
  id: string
  name: string
  zone?: string
  state?: string
  region?: string
  totalComplaints?: number
  openComplaints?: number
  closedComplaints?: number
  resolutionRate?: number
  avgResolutionTime?: number
  slaCompliance?: number
  topIssues?: string[]
  shortName?: string
  cluster?: string
  code?: string
  type?: 'owned' | 'contract' | 'Own' | 'Contract'
}

// Issue interface for issue data
export interface Issue {
  id: string
  ticketId?: string
  title?: string
  description: string
  category: string
  subcategory: string
  priority: PriorityType
  status?: string
  createdDate?: Date
  closedDate?: Date
  brewery?: string
  zone?: string
  state?: string
  assignedTo?: string
  escalationLevel?: number
  slaBreached?: boolean
  rootCause?: string
  resolution?: string
  proofOfDelivery?: string[]
  investigationNotes?: string[]
  whyAnalysis?: string[]
  // Additional fields used in issues pages/data
  risk?: RiskType | string
  volume?: number | string
  sampleRequired?: boolean
  consumerSettlement?: string
  customerSettlement?: string
  acceptableProofs?: string[]
  validationChecklist?: string[]
  probableCauses?: string[]
  escalationL1?: string
  escalationL2?: string
}

// ProcessStep interface for process data
export interface ProcessStep {
  id: string
  name: string
  description: string
  slaHours?: number
  order?: number
  department?: string
  activities?: string[]
  inputs?: string[]
  outputs?: string[]
  escalationPath?: string
  // Additional fields used in process pages/data
  duration?: string
  key_activities?: string[]
  owner?: string
  output?: string
}