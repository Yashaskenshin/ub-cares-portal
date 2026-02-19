import { useState } from 'react'
import Card from '../components/Card'
import SearchBar from '../components/SearchBar'
import { FileText, BookOpen, Users, Settings, AlertCircle, CheckCircle2, Book } from 'lucide-react'
import { glossaryTerms } from '../data/glossaryData'

export default function DocumentationPage() {
  const [glossarySearch, setGlossarySearch] = useState('')
  
  const filteredGlossary = glossaryTerms.filter(term =>
    term.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    term.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  )
  const docs = [
    {
      title: 'Project Overview',
      icon: BookOpen,
      description: 'UB Cares vision, objectives, and key goals',
      items: [
        'Vision: Strengthening How We Listen, Resolve & Improve',
        'Coverage: Product content, primary, secondary packaging',
        'Scope: 44 issue types, 32 breweries, 4,400+ outlets',
        'Launch: November 21, 2025'
      ]
    },
    {
      title: 'Process Documentation',
      icon: Settings,
      description: '6-step complaint lifecycle with ownership',
      items: [
        'Capture: Multi-channel omnichannel intake',
        'Validation: 44 standardized checklists',
        'RCA: 44 SOP templates with probable causes',
        'Settlement: Standardized guideline (1:1 rule)',
        'Closure: Action plan tracking & feedback'
      ]
    },
    {
      title: 'Complaint Types',
      icon: AlertCircle,
      description: '44 issue categories with validation rules',
      items: [
        'Product Content: 13 issues (sensory, contamination)',
        'Primary Packaging: 25 issues (bottles, cans, labels)',
        'Secondary Packaging: 6 issues (cartons, seals)',
        'Each with proofs, checklists, RCA guidelines'
      ]
    },
    {
      title: 'Team & Roles',
      icon: Users,
      description: 'Organizational structure and responsibilities',
      items: [
        'Sales Teams: Capture & coordination',
        'QA Manager: Initial validation',
        'Brewery Teams: RCA & CAPA',
        'CTC: Audit & crisis management',
        'Finance: Settlement processing'
      ]
    },
    {
      title: 'SLA & OLA',
      icon: CheckCircle2,
      description: 'Response and resolution timelines',
      items: [
        'Critical: 3 hour response, 5 day resolution',
        'Urgent: 3 hour response, 5-6 day resolution',
        'Medium: 6 hour response, 7-8 day resolution',
        'Low: 12 hour response, 8-9 day resolution'
      ]
    },
    {
      title: 'Brewery Network',
      icon: FileText,
      description: '32 breweries across 4 regions',
      items: [
        'North India: 5 breweries',
        'South India: 20 breweries',
        'East India: 3 breweries',
        'West India: 3 breweries'
      ]
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Documentation & Reference</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive guide to UB Cares system, processes, and documentation.
        </p>
      </div>

      {/* Documentation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc, idx) => {
          const Icon = doc.icon
          return (
            <Card key={idx} hover>
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{doc.title}</h3>
                  <p className="text-xs text-gray-500">{doc.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {doc.items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
      </div>

      {/* Key Metrics */}
      <div>
        <h3 className="text-xl font-bold mb-4">System at a Glance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-3xl font-bold text-blue-600">44</p>
            <p className="text-gray-600 font-medium">Issue Types</p>
            <p className="text-xs text-gray-500 mt-2">Standardized with checklists & SOPs</p>
          </Card>
          <Card>
            <p className="text-3xl font-bold text-green-600">32</p>
            <p className="text-gray-600 font-medium">Breweries</p>
            <p className="text-xs text-gray-500 mt-2">22 Owned + 10 Contract</p>
          </Card>
          <Card>
            <p className="text-3xl font-bold text-purple-600">4,400+</p>
            <p className="text-gray-600 font-medium">Outlets</p>
            <p className="text-xs text-gray-500 mt-2">Across 4 regions</p>
          </Card>
          <Card>
            <p className="text-3xl font-bold text-orange-600">6</p>
            <p className="text-gray-600 font-medium">Process Steps</p>
            <p className="text-xs text-gray-500 mt-2">Capture to Closure</p>
          </Card>
        </div>
      </div>

      {/* Key Features */}
      <Card>
        <h3 className="text-xl font-bold mb-4">Key System Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-600 mb-3">Multi-Channel Capture</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✓ QR Code at retail outlets</li>
              <li>✓ SFA mobile app (sales team)</li>
              <li>✓ Toll-free hotline</li>
              <li>✓ Email feedback</li>
              <li>✓ WhatsApp messaging</li>
              <li>✓ Call center intake</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-600 mb-3">Quality Assurance</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✓ 44 validation checklists</li>
              <li>✓ 24-hour sample delivery</li>
              <li>✓ CTC parallel validation</li>
              <li>✓ Maker-checker model</li>
              <li>✓ Digital documentation</li>
              <li>✓ SLA-driven escalations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-orange-600 mb-3">RCA & CAPA</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✓ 44 SOP templates</li>
              <li>✓ Probable cause repository</li>
              <li>✓ Why-Why analysis framework</li>
              <li>✓ CTC approval workflow</li>
              <li>✓ Crisis escalation</li>
              <li>✓ Action plan tracking</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-600 mb-3">Settlement</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✓ Standardized guideline</li>
              <li>✓ 1:1 settlement rule</li>
              <li>✓ No negotiation policy</li>
              <li>✓ Fortnightly processing</li>
              <li>✓ 20-25 day payout</li>
              <li>✓ KYC requirement</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Support Contacts */}
      <Card>
        <h3 className="text-xl font-bold mb-4">Support Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-700 mb-2">Ankit Desai</h4>
            <p className="text-sm font-medium mb-1">Transformation Manager</p>
            <p className="text-xs text-gray-600 mb-2">Process & policy clarification</p>
            <p className="text-xs"><strong>📞</strong> 8149296890</p>
            <p className="text-xs text-blue-600">ankit.desai@ubmail.com</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-bold text-green-700 mb-2">Kandhan M</h4>
            <p className="text-sm font-medium mb-1">CTC Quality Assurance</p>
            <p className="text-xs text-gray-600 mb-2">Quality parameters & logistics</p>
            <p className="text-xs"><strong>📞</strong> 8861220008</p>
            <p className="text-xs text-green-600">kandan@ubmail.com</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-bold text-purple-700 mb-2">Kiran Ponugupati</h4>
            <p className="text-sm font-medium mb-1">Senior Tech Specialist</p>
            <p className="text-xs text-gray-600 mb-2">Tool & system issues</p>
            <p className="text-xs"><strong>📞</strong> 9000992199</p>
            <p className="text-xs text-purple-600">kponugupati@ubmail.com</p>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card>
        <h3 className="text-xl font-bold mb-4">Implementation Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">1</div>
            </div>
            <div>
              <p className="font-semibold">November 17, 2025</p>
              <p className="text-sm text-gray-600">Deadline: Close all legacy complaints</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-600 text-white font-bold">2</div>
            </div>
            <div>
              <p className="font-semibold">November 21, 2025</p>
              <p className="text-sm text-gray-600">Go-Live: UB Cares System</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white font-bold">3</div>
            </div>
            <div>
              <p className="font-semibold">Phase 1 (Live)</p>
              <p className="text-sm text-gray-600">Core complaint management with basic workflows</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-600 text-white font-bold">4</div>
            </div>
            <div>
              <p className="font-semibold">Phase 2 (Planned)</p>
              <p className="text-sm text-gray-600">Advanced features: OLAs, validation checklists, payout portal integration</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Glossary Section */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Book className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold">Glossary of Terms</h3>
        </div>
        <div className="mb-4">
          <SearchBar
            placeholder="Search glossary terms..."
            onSearch={setGlossarySearch}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGlossary.map((term) => (
            <div key={term.term} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <p className="font-bold text-sm text-blue-700 mb-1">{term.term}</p>
              <p className="text-xs text-gray-600">{term.definition}</p>
            </div>
          ))}
        </div>
        {filteredGlossary.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No terms found matching your search.</p>
        )}
      </Card>
    </div>
  )
}

