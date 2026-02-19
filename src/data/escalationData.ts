// Escalation matrix and crisis management data from training manual

export interface EscalationRow {
  severity: string;
  level1: string;
  level2: string;
  crisis: string;
}

export interface CrisisDefinition {
  id: string;
  definition: string;
}

export interface CrisisRule {
  id: string;
  rule: string;
  type: 'do' | 'dont';
}

export const escalationMatrix: EscalationRow[] = [
  {
    severity: 'Critical (HACCP)',
    level1: 'Brewery Head + Zonal Head',
    level2: 'Manufacturing Head',
    crisis: 'CEO, CSCO, CSO, CMO, Legal'
  },
  {
    severity: 'Urgent (High Risk)',
    level1: 'Brewery Head + Zonal Head',
    level2: 'Manufacturing Head',
    crisis: 'CSCO, CTC Head, Mfg Head'
  },
  {
    severity: 'Medium',
    level1: 'Brewery Head',
    level2: 'Zonal Head',
    crisis: 'CSCO, CTC Head'
  },
  {
    severity: 'Low',
    level1: 'Brewery Head',
    level2: 'Zonal Head',
    crisis: 'Manufacturing Head'
  }
];

export const crisisDefinitions: CrisisDefinition[] = [
  {
    id: '1',
    definition: 'Consumer injury with potential legal action'
  },
  {
    id: '2',
    definition: 'Foreign matter with high viral risk'
  },
  {
    id: '3',
    definition: 'Media coverage (negative)'
  },
  {
    id: '4',
    definition: 'Batch recall situation'
  }
];

export const crisisRules: CrisisRule[] = [
  {
    id: '1',
    rule: 'DO NOT speak to media - Refer to Corporate Communications',
    type: 'dont'
  },
  {
    id: '2',
    rule: 'DO NOT admit fault - Say "We\'re investigating"',
    type: 'dont'
  },
  {
    id: '3',
    rule: 'DO NOT promise compensation - Say "We\'ll do what\'s right"',
    type: 'dont'
  },
  {
    id: '4',
    rule: 'DO escalate immediately - Within 15 minutes',
    type: 'do'
  },
  {
    id: '5',
    rule: 'DO document everything - Every call, email, conversation',
    type: 'do'
  }
];

export const escalationTriggers = [
  'HACCP Issue Reported (Foreign Matter, Damaged Rim)',
  'Consumer Threatens Legal Action',
  'Consumer Claims Injury/Hospitalization',
  'Media Involvement',
  'VIP/High-Profile Consumer',
  'Repeat Complainant (3+ complaints in 30 days)'
];

