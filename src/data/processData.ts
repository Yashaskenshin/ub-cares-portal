import { ProcessStep } from '../types';

export const processSteps: ProcessStep[] = [
  {
    id: '1',
    name: 'CAPTURE',
    description: 'Collect complaints through multiple omnichannel sources',
    duration: '1-8 hours from occurrence',
    key_activities: [
      'QR Code scanning at retail outlets',
      'SFA App complaint submission by sales team',
      'Call center intake with hotline number',
      'Email feedback submission',
      'WhatsApp direct messaging',
      'First-time-right information capture'
    ],
    owner: 'Sales Teams, Call Center Agents',
    output: 'Centralized ticket with complete details'
  },
  {
    id: '2',
    name: 'TICKET GENERATION & ALLOCATION',
    description: 'Auto-create tickets and assign to single owner',
    duration: 'Real-time, within 1 hour',
    key_activities: [
      'Auto-centralized ticket generation',
      'System-based allocation to QAM',
      'Auto-acknowledgement email/SMS',
      'Ticket ID assignment',
      'Digital trail initialization'
    ],
    owner: 'System, QAM',
    output: 'Ticket with acknowledgement to complainant'
  },
  {
    id: '3',
    name: 'VALIDATION',
    description: 'Validate complaint authenticity with standardized checklist',
    duration: '24-48 hours (by priority)',
    key_activities: [
      'Sample collection via logistics partner (24hrs)',
      'Mandatory validation checklist completion',
      'Proof documentation review',
      'QAM validation decision',
      'CTC parallel validation for critical cases',
      'Digital documentation'
    ],
    owner: 'QAM, Logistics Partner, CTC (for critical)',
    output: 'Justified or Unjustified decision'
  },
  {
    id: '4',
    name: 'ANALYSE & ACTION',
    description: 'Root Cause Analysis and Corrective Action Planning',
    duration: '1-3 days post-validation',
    key_activities: [
      'Select appropriate SOP (44 available)',
      'Conduct Why-Why analysis',
      'Identify root cause & defect mode',
      'Plan corrective & preventive actions',
      'CTC approval for critical cases',
      'Crisis escalation if needed'
    ],
    owner: 'Head Brewer, Brewery Head, CTC',
    output: 'RCA & CAPA with action plan'
  },
  {
    id: '5',
    name: 'RESOLVE',
    description: 'Settlement and compensation to consumer/retailer',
    duration: 'Fortnightly processing, 20-25 working days payment',
    key_activities: [
      'Auto-calculate settlement amount',
      'Consumer: Coordinate replacement bottles',
      'Retailer: Finance processes payment',
      'KYC verification required',
      '1:1 settlement rule (no negotiation)',
      'Auto-communication on settlement'
    ],
    owner: 'Finance Team, Sales Team',
    output: 'Settlement completed and communicated'
  },
  {
    id: '6',
    name: 'CLOSURE',
    description: 'Finalize complaint with feedback and archival',
    duration: 'Post-settlement and RCA approval',
    key_activities: [
      'Action plan tracking for completion',
      'Settlement confirmation',
      'Auto-communication to consumer/customer',
      'Feedback survey deployment',
      'Call center feedback collection',
      'Complaint closure in system'
    ],
    owner: 'CTC, Call Center, System',
    output: 'Closed complaint with feedback data'
  }
];

export const slaMatrix = {
  consumer: [
    { priority: 'Critical', response: '3 hours', resolution: '5 days', slaWindow: '45 mins' },
    { priority: 'Urgent', response: '3 hours', resolution: '5 days', slaWindow: '45 mins' },
    { priority: 'Medium', response: '6 hours', resolution: '7 days', slaWindow: '63 mins' },
    { priority: 'Low', response: '12 hours', resolution: '8 days', slaWindow: '72 mins' }
  ],
  customer: [
    { priority: 'Critical', response: '3 hours', resolution: '5 days', slaWindow: '45 mins' },
    { priority: 'Urgent', response: '3 hours', resolution: '6 days', slaWindow: '45 mins' },
    { priority: 'Medium', response: '6 hours', resolution: '8 days', slaWindow: '45 mins' },
    { priority: 'Low', response: '12 hours', resolution: '9 days', slaWindow: '45 mins' }
  ]
};

export const olaMatrix = {
  consumer: [
    { priority: 'Critical', callback: '1 hour', reachout: '3 hours', sampleCollection: '24 hours', validation: '+2 days', settlement: '+2 days', rca: '+2 days' },
    { priority: 'Urgent', callback: '1 hour', reachout: '6 hours', sampleCollection: '24 hours', validation: '+2 days', settlement: '+2 days', rca: '+2 days' },
    { priority: 'Medium', callback: '1 hour', reachout: '12 hours', sampleCollection: '2 days', validation: '+3 days', settlement: '+2 days', rca: '+3 days' },
    { priority: 'Low', callback: '1 hour', reachout: '12 hours', sampleCollection: '2 days', validation: '+3 days', settlement: '+2 days', rca: '+3 days' }
  ],
  customer: [
    { priority: 'Critical', callback: '1 hour', reachout: '6 hours', sampleCollection: '24 hours', validation: '+2 days', settlement: 'Fortnightly', rca: '+2 days' },
    { priority: 'Urgent', callback: '1 hour', reachout: '6 hours', sampleCollection: '24 hours', validation: '+3 days', settlement: '-', rca: '+3 days' },
    { priority: 'Medium', callback: '2 hours', reachout: '12 hours', sampleCollection: '2 days', validation: '+3 days', settlement: '-', rca: '+4 days' },
    { priority: 'Low', callback: '2 hours', reachout: '12 hours', sampleCollection: '2 days', validation: '+3 days', settlement: '-', rca: '+4 days' }
  ]
};

