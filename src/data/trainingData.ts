// Training materials data extracted from documentation

export interface CallScript {
  id: string;
  title: string;
  scenario: string;
  script: string;
  duration: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  subject: string;
  body: string;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  message: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface CommonMistake {
  id: string;
  mistake: string;
  correct: string;
}

export const callScripts: CallScript[] = [
  {
    id: 'opening',
    title: 'Opening Script',
    scenario: 'Product Complaint',
    duration: '30 seconds',
    script: `"Thank you for calling UB Cares. My name is [Your Name]. I'm here to help you with any quality concerns you may have about our products. May I have your name please?"

[Consumer shares name]

"Thank you, [Name]. How can I assist you today?"

[Consumer explains issue]

"I understand, [Name]. I'm sorry you had this experience. Let me gather some details so we can investigate this properly and resolve it for you."`
  },
  {
    id: 'gathering-info',
    title: 'Gathering Information',
    scenario: 'Product Details Collection',
    duration: '3-4 minutes',
    script: `"To help us investigate, I'll need to ask you a few questions. This will take about 3-4 minutes. Is that okay?"

**Product Details:**
"Which brand and size was this?"
"Can you see the batch number on the label? It's usually printed on the neck label or body label"
"What's the Best Before Date?"
"Where did you purchase this from?"
"When did you purchase it?"

**Issue Details:**
"Can you describe what you saw/tasted in detail?"
"Is this one bottle or multiple?"
"Is the bottle still unopened or have you consumed some?"`
  },
  {
    id: 'requesting-proofs',
    title: 'Requesting Proofs',
    scenario: 'Proof Collection',
    duration: '1-2 minutes',
    script: `"Thank you for that information, [Name]. To help our quality team investigate quickly, I'll need you to share a few photos:

1. A clear photo of the full bottle or can showing it's unopened
2. A close-up photo of the issue you mentioned
3. A photo of the product label showing the batch number clearly

You can WhatsApp these photos to +91 90354 32223 or email them to [email]. Is that something you can do?"

[If YES]
"Great! Please send them within the next 2 hours so we can start investigating right away."

[If NO]
"I understand. Without these photos, it will be difficult for us to validate the complaint. Is there anyone who can help you take these photos? I can wait while you try."`
  },
  {
    id: 'creating-ticket',
    title: 'Creating Ticket & Acknowledgment',
    scenario: 'Ticket Creation',
    duration: '1 minute',
    script: `"Thank you for providing all the details, [Name]. I'm creating a complaint ticket for you right now."

[Create ticket in system]

"Your ticket number is [TICKET ID]. Please save this for your reference. You'll also receive an SMS and email with this ticket number."`
  },
  {
    id: 'setting-expectations',
    title: 'Setting Expectations',
    scenario: 'Next Steps Communication',
    duration: '1 minute',
    script: `"Here's what happens next:

1. Our quality team will receive your complaint within 1 hour
2. If we need the physical product for testing, our logistics team will contact you within 24 hours to collect it from your location
3. Once we investigate, we'll call you back within [X days based on priority] with our findings
4. If your complaint is justified, we'll process a settlement/replacement

Is there anything else I can help you with today?"`
  },
  {
    id: 'closing',
    title: 'Closing',
    scenario: 'Call Conclusion',
    duration: '30 seconds',
    script: `"Thank you for bringing this to our attention, [Name]. We take quality very seriously and will investigate this thoroughly. You should hear from us within [X days]. If you have any questions, please call us back and quote your ticket number [TICKET ID].

Is there anything else I can assist you with?"

[If NO]

"Thank you for calling UB Cares. Have a great day!"`
  }
];

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'acknowledgment',
    title: 'Acknowledgment Email',
    subject: 'UB Cares - Your Complaint Has Been Received [TICKET ID]',
    body: `Dear [Customer Name],

Thank you for contacting UB Cares regarding your quality concern.

COMPLAINT DETAILS:
- Ticket Number: [TICKET ID]
- Product: [Brand - SKU]
- Batch Number: [Batch]
- Issue: [Brief description]
- Date Logged: [Date]

NEXT STEPS:
1. Your complaint has been assigned to our quality team for investigation
2. Expected resolution time: [X days]
3. We will contact you if we need any additional information

You can track your complaint status by calling [phone] or emailing [email] with your ticket number.

Thank you for your patience.

Regards,
UB Cares Team
United Breweries Limited`
  },
  {
    id: 'proof-request',
    title: 'Proof Request Reminder',
    subject: 'Action Required - Please Share Photos [TICKET ID]',
    body: `Dear [Customer Name],

We have registered your complaint (Ticket #[TICKET ID]) but need the following photos to proceed with investigation:

REQUIRED PHOTOS:
1. Full product image showing it's unopened
2. Close-up of the issue
3. Product label with batch number

Please WhatsApp to +91 90354 32223 or reply to this email with attachments.

WITHOUT THESE PROOFS, WE CANNOT VALIDATE YOUR COMPLAINT.

Please share within 48 hours.

Thank you,
UB Cares Team`
  }
];

export const whatsappTemplates: WhatsAppTemplate[] = [
  {
    id: 'greeting-handover',
    title: 'Greeting & Handover (Positive Flow)',
    message: `Hi! This is [Agent Name] from UB Customer Support. I've received your request regarding a product issue. I am here to resolve this for you quickly. Could you please share your name?`
  },
  {
    id: 'information-gathering',
    title: 'Information Gathering',
    message: `Thanks, [Customer Name]. To help me identify the batch and the specific plant, could you please share:
1. A photo of the bottle/can (showing the label and the issue)
2. The Manufacturing Date and Batch Number printed on the bottle/can
3. Where you purchased this (City/Store name)`
  },
  {
    id: 'sample-retention',
    title: 'Sample Retention (Critical Issue)',
    message: `Since our technical team needs to analyze this Bottle, please do not discard the bottle. We may arrange to collect it from your location within 24-48 hours.`
  },
  {
    id: 'resolution-acknowledgment',
    title: 'Resolution & Acknowledgment',
    message: `I have logged this complaint under Ticket #[TICKET ID]. Our Quality Assurance Manager (QAM) has been notified. We will come back with a resolution very soon.`
  },
  {
    id: 'escalation-alert',
    title: 'Escalation Alert (Critical/HACCP)',
    message: `Hi [Customer Name], this is [Agent Name], a Senior Support Executive. I am personally taking over this chat. I am very sorry to hear about this incident, and I am treating this with high priority.`
  },
  {
    id: 'critical-evidence',
    title: 'Evidence for Escalation',
    message: `I need to escalate this immediately to our Zonal Head and Manufacturing Head. To do that effectively, please send me:
1. A clear photo of the [Defect/Foreign Object]
2. The Batch Number so we can freeze stock if necessary`
  },
  {
    id: 'critical-closing',
    title: 'Hard Closing & Sample Retention',
    message: `Please keep the bottle/can and the object safe. Our local representative will come to collect it personally for lab analysis. Do not consume it. I have raised a Critical Incident Report (Ticket #[TICKET ID]). You will receive a call from our Escalation Team shortly.`
  }
];

export const top20FAQs: FAQ[] = [
  {
    id: '1',
    question: 'How long will it take to resolve my complaint?',
    answer: 'Based on the issue type, we typically resolve within [X] days. I\'ll follow up with you in 48 hours with a status update.',
    category: 'Resolution'
  },
  {
    id: '2',
    question: 'Will I get a refund or replacement?',
    answer: 'Once our quality team investigates and if your complaint is justified, we\'ll offer an appropriate settlement. This could be a replacement, refund, or other compensation.',
    category: 'Settlement'
  },
  {
    id: '3',
    question: 'Why do you need photos? Can\'t you just believe me?',
    answer: 'I absolutely believe you. The photos help our quality engineers investigate the root cause so we can prevent this from happening again. It\'s for improving our processes.',
    category: 'Process'
  },
  {
    id: '4',
    question: 'I don\'t have the batch number. Can you still help?',
    answer: 'Unfortunately, without the batch number, we cannot trace which production line this came from, making investigation difficult. Can you check the label again? It\'s usually near the neck or on the body label.',
    category: 'Process'
  },
  {
    id: '5',
    question: 'I already drank/opened the beer. Can I still complain?',
    answer: 'Yes, you can still complain. However, validation will be limited without the unopened product. We\'ll do our best to investigate based on your description and any remaining evidence.',
    category: 'Process'
  },
  {
    id: '6',
    question: 'I bought this 6 months ago. Is it too late to complain?',
    answer: 'You can still log the complaint, but please note that storage conditions over 6 months can affect beer quality. We\'ll investigate and consider this factor.',
    category: 'Process'
  },
  {
    id: '7',
    question: 'Can someone come pick up the product from my home?',
    answer: 'Yes! If we need the physical product for testing, our logistics team will schedule a convenient time to collect it from your location within 24-48 hours.',
    category: 'Process'
  },
  {
    id: '8',
    question: 'I want to speak to a manager!',
    answer: 'I understand your frustration. Let me see if my supervisor is available. In the meantime, let me create a ticket so we don\'t lose any time. What\'s your name and mobile number?',
    category: 'Escalation'
  },
  {
    id: '9',
    question: 'I\'m posting this on social media if you don\'t resolve immediately!',
    answer: '[Escalate to supervisor immediately] "I understand you\'re upset. Let me escalate this to my supervisor right away so we can prioritize your complaint. Can you give me 5 minutes?"',
    category: 'Escalation'
  },
  {
    id: '10',
    question: 'This is the third time I\'m facing this issue!',
    answer: 'I apologize for the repeated inconvenience. Let me check your previous complaints... [Pull history] I see your previous tickets. Let me escalate this as a repeat complaint so it gets special attention.',
    category: 'Escalation'
  },
  {
    id: '11',
    question: 'What\'s the status of my complaint from last week?',
    answer: 'Let me check. Can you share your ticket number?... [Look up ticket] Your complaint is currently [status]. Expected resolution is [date]. Would you like me to request an update from the team?',
    category: 'Status'
  },
  {
    id: '12',
    question: 'I don\'t trust UBL. This is the last time I\'m buying Kingfisher!',
    answer: 'I\'m truly sorry we\'ve disappointed you. We take quality very seriously, which is why we have this dedicated system. Please give us a chance to make this right. Let me ensure your complaint gets the attention it deserves.',
    category: 'Relationship'
  },
  {
    id: '13',
    question: 'Can you tell me what went wrong in the brewery?',
    answer: 'I don\'t have the technical details yet as the quality team needs to investigate first. Once they complete the investigation, we\'ll share the findings with you. Typically takes [X] days.',
    category: 'Technical'
  },
  {
    id: '14',
    question: 'I want compensation for the inconvenience, not just replacement!',
    answer: 'I understand your concern. Our team will evaluate the situation and offer a fair settlement. This will be communicated to you once the investigation is complete.',
    category: 'Settlement'
  },
  {
    id: '15',
    question: 'I bought this for a party and it ruined my event!',
    answer: 'I\'m so sorry this happened during your special occasion. Let me mark this complaint as high priority and ensure it gets immediate attention. Can you share all the details?',
    category: 'Priority'
  },
  {
    id: '16',
    question: 'The retailer refused to take it back. That\'s why I\'m calling you!',
    answer: 'I understand. The retailer may not have the authority to accept returns, which is why UB Cares exists. We\'ll handle this directly. Let me create a ticket for you.',
    category: 'Process'
  },
  {
    id: '17',
    question: 'How do I know you\'re not just ignoring my complaint?',
    answer: 'Great question. You\'ll receive an SMS and email with a unique ticket number. You can call us anytime with that number to check status. I\'ll also personally follow up with you in 48 hours.',
    category: 'Process'
  },
  {
    id: '18',
    question: 'I\'m a regular customer. I buy Kingfisher every week!',
    answer: 'Thank you for being a loyal customer! We value your business, which is why we want to resolve this quickly. Let me make sure your complaint gets the priority it deserves.',
    category: 'Relationship'
  },
  {
    id: '19',
    question: 'Can I get this resolved today itself?',
    answer: 'I understand the urgency. While I\'m creating the ticket immediately, the investigation typically takes [X] days because our quality engineers need to test the product. However, I\'ll mark this for expedited handling.',
    category: 'Resolution'
  },
  {
    id: '20',
    question: 'What if I\'m not satisfied with your resolution?',
    answer: 'If you\'re not satisfied, you can request to re-open the complaint or escalate it to our senior management. We\'ll work with you until you\'re satisfied with the outcome.',
    category: 'Resolution'
  }
];

export const commonMistakes: CommonMistake[] = [
  {
    id: '1',
    mistake: 'Creating ticket without batch number',
    correct: 'Always insist on batch number - it\'s mandatory'
  },
  {
    id: '2',
    mistake: 'Not requesting proofs',
    correct: 'No proofs = Cannot validate = Complaint rejected'
  },
  {
    id: '3',
    mistake: 'Promising consumer a specific outcome',
    correct: 'Say "We\'ll investigate and get back within X days"'
  },
  {
    id: '4',
    mistake: 'Entering wrong priority (Low for a HACCP issue)',
    correct: 'HACCP = always Critical or Urgent'
  }
];

export const selfQAChecklist = [
  'Consumer name, mobile, email captured',
  'Product brand, SKU, batch number captured',
  'Batch number verified (alphanumeric, looks legitimate)',
  'Issue category & sub-category selected correctly',
  'Priority assigned (Critical/Urgent/Medium/Low)',
  'HACCP vs Non-HACCP classification correct',
  'Detailed description entered (consumer\'s words + your notes)',
  'Proofs requested and consumer agreed to send',
  'Acknowledgment sent (auto-email triggered)',
  'Ticket ID shared with consumer',
  'Follow-up scheduled (marked in calendar/system)'
];

