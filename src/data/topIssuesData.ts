// Top issues data from current state analysis

export interface TopIssue {
  rank: number;
  category: string;
  subCategory: string;
  count: string;
  percentage: number;
  priority: string;
  owner: string;
  status: string;
}

export const top10Issues: TopIssue[] = [
  {
    rank: 1,
    category: 'Primary Packaging',
    subCategory: 'Underfilled/Half-Filled Bottle',
    count: '48+',
    percentage: 40,
    priority: 'Medium',
    owner: 'Production Head',
    status: 'RCA Needed'
  },
  {
    rank: 2,
    category: 'Product Content',
    subCategory: 'Sediment Beer',
    count: '30+',
    percentage: 25,
    priority: 'Urgent',
    owner: 'Head Brewer',
    status: 'RCA Needed'
  },
  {
    rank: 3,
    category: 'Primary Packaging',
    subCategory: 'Broken/Cracked Container',
    count: '12+',
    percentage: 10,
    priority: 'Low',
    owner: 'Production Head',
    status: 'Logistics Issue'
  },
  {
    rank: 4,
    category: 'Product Content',
    subCategory: 'Taste Issue',
    count: '10+',
    percentage: 8,
    priority: 'Urgent',
    owner: 'Head Brewer',
    status: 'RCA Needed'
  },
  {
    rank: 5,
    category: 'Product Content',
    subCategory: 'Flat Beer',
    count: '8+',
    percentage: 7,
    priority: 'Urgent',
    owner: 'Head Brewer',
    status: 'RCA Needed'
  },
  {
    rank: 6,
    category: 'Primary Packaging',
    subCategory: 'Leakage',
    count: '5+',
    percentage: 4,
    priority: 'Low',
    owner: 'Production Head',
    status: 'Packaging Issue'
  },
  {
    rank: 7,
    category: 'Secondary Packaging',
    subCategory: 'Seal Shortage',
    count: '3+',
    percentage: 2.5,
    priority: 'Medium',
    owner: 'Production Head',
    status: 'QC Issue'
  },
  {
    rank: 8,
    category: 'Primary Packaging',
    subCategory: 'Crown Not Crimped',
    count: '2+',
    percentage: 1.5,
    priority: 'Low',
    owner: 'Production Head',
    status: 'Crimping Issue'
  },
  {
    rank: 9,
    category: 'Primary Packaging',
    subCategory: 'Missing Crown',
    count: '2+',
    percentage: 1,
    priority: 'Low',
    owner: 'Production Head',
    status: 'Inspection Gap'
  },
  {
    rank: 10,
    category: 'Primary Packaging',
    subCategory: 'Empty Bottle',
    count: '2+',
    percentage: 1,
    priority: 'Low',
    owner: 'Production Head',
    status: 'Filler Issue'
  }
];

export const keyInsights = [
  'Top 2 issues (Underfilled + Sediment) account for 65% of complaints → Focus here for maximum impact',
  'Srikakulam has 2x volume compared to ILIOS',
  'Underfilled bottles primarily from Srikakulam brewery',
  'Sediment beer common across both breweries - requires filtration audit'
];

