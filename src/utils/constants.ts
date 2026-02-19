// Application-wide constants

export const APP_NAME = 'UB Cares Hub';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Quality Complaint Management System - Central Hub';

export const ROUTES = {
  DASHBOARD: 'dashboard',
  ISSUES: 'issues',
  PROCESS: 'process',
  BREWERIES: 'breweries',
  SLA: 'sla',
  DOCUMENTATION: 'documentation',
} as const;

export const PRIORITY_COLORS = {
  Critical: 'bg-red-500 text-white',
  Urgent: 'bg-orange-500 text-white',
  Medium: 'bg-yellow-500 text-white',
  Low: 'bg-green-500 text-white',
} as const;

export const RISK_COLORS = {
  High: 'bg-red-100 text-red-800 border-red-300',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Low: 'bg-green-100 text-green-800 border-green-300',
} as const;

export const CATEGORY_COLORS = {
  'Product Content': 'bg-red-50 border-l-4 border-red-500',
  'Primary Packaging': 'bg-blue-50 border-l-4 border-blue-500',
  'Secondary Packaging': 'bg-green-50 border-l-4 border-green-500',
} as const;

export const SUPPORT_CONTACTS = [
  {
    name: 'Ankit Desai',
    role: 'Transformation Manager',
    expertise: 'Process & policy clarification',
    phone: '8149296890',
    email: 'ankit.desai@ubmail.com',
  },
  {
    name: 'Kandhan M',
    role: 'CTC Quality Assurance',
    expertise: 'Quality parameters, SOPs, RCA, logistics',
    phone: '8861220008',
    email: 'kandan@ubmail.com',
  },
  {
    name: 'Kiran Ponugupati',
    role: 'Senior Technology Specialist',
    expertise: 'Tool issues, SFA, payout system',
    phone: '9000992199',
    email: 'kponugupati@ubmail.com',
  },
] as const;

export const LAUNCH_DATE = 'November 21, 2025';
export const PILOT_REGION = 'Andhra Pradesh';

export const STATS = {
  TOTAL_ISSUES: 44,
  TOTAL_BREWERIES: 32,
  OWNED_BREWERIES: 22,
  CONTRACT_BREWERIES: 10,
  TOTAL_OUTLETS: 4400,
  TEAM_MEMBERS: 500,
  PROCESS_STEPS: 6,
} as const;

