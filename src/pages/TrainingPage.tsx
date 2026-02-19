import { useState } from 'react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { MessageSquare, Mail, MessageCircle, HelpCircle, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Copy, User } from 'lucide-react'
import { callScripts, emailTemplates, whatsappTemplates, top20FAQs, commonMistakes, selfQAChecklist } from '../data/trainingData'

export default function TrainingPage() {
  const [expandedScript, setExpandedScript] = useState<string | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [agentName, setAgentName] = useState('Your Name')
  const [customerName, setCustomerName] = useState('[Customer Name]')
  const [ticketId, setTicketId] = useState('[TICKET ID]')

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Function to replace placeholders in templates
  const replaceNames = (template: string): string => {
    return template
      .replace(/\[Your Name\]/g, agentName)
      .replace(/\[Agent Name\]/g, agentName)
      .replace(/\[Name\]/g, customerName)
      .replace(/\[Customer Name\]/g, customerName)
      .replace(/\[CUSTOMER NAME\]/g, customerName)
      .replace(/\[TICKET ID\]/g, ticketId)
      .replace(/\[XXXX\]/g, ticketId)
      .replace(/\[Number\]/g, ticketId)
  }

  const faqCategories = Array.from(new Set(top20FAQs.map(faq => faq.category)))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Training Materials</h2>
        <p className="text-gray-600 mb-6">
          Complete training resources for call center agents, QAMs, and all UB Cares team members.
        </p>
      </div>

      {/* Self-QA Checklist Section - MOVED TO TOP */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold">Self-QA Checklist</h3>
        </div>
        <Card>
          <p className="text-sm text-gray-600 mb-4">Before submitting any ticket, verify:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {selfQAChecklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <label className="text-sm text-gray-700">{item}</label>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Compact Template Customizer - BELOW QA CHECKLIST */}
      <Card className="bg-blue-50 border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-3">
          <User className="text-blue-600" size={18} />
          <h3 className="font-semibold text-blue-900">Template Variables</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="[Customer Name]"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Ticket ID</label>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="[TICKET ID]"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <div className="w-full bg-blue-100 rounded px-2 py-1 text-xs text-gray-700">
              <strong>Preview:</strong> Hi {customerName}! Ticket #{ticketId}
            </div>
          </div>
        </div>
      </Card>

      {/* Call Scripts Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold">Call Scripts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {callScripts.map((script) => (
            <Card key={script.id} hover className="cursor-pointer transition-all duration-200 hover:shadow-md" onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">{script.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{script.scenario}</p>
                  <div className="flex items-center justify-between">
                    <Badge label={script.duration} variant="info" />
                    <span className="text-xs text-gray-500">Click to expand</span>
                  </div>
                </div>
                <button
                  className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedScript(expandedScript === script.id ? null : script.id)
                  }}
                >
                  {expandedScript === script.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              {expandedScript === script.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 p-4 rounded-lg relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(replaceNames(script.script), `script-${script.id}`)
                      }}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      {copiedId === `script-${script.id}` ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    </button>
                    <pre className="text-sm whitespace-pre-wrap font-sans">{replaceNames(script.script)}</pre>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* WhatsApp Templates Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="text-green-600" size={24} />
          <h3 className="text-xl font-bold">WhatsApp Templates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whatsappTemplates.map((template) => (
            <Card key={template.id} hover>
              <h4 className="font-semibold text-lg mb-2">{template.title}</h4>
              <div className="bg-green-50 p-3 rounded relative">
                <button
                  onClick={() => handleCopy(replaceNames(template.message), `whatsapp-${template.id}`)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  {copiedId === `whatsapp-${template.id}` ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                </button>
                <p className="text-sm">{replaceNames(template.message)}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Top 20 FAQs Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="text-purple-600" size={24} />
          <h3 className="text-xl font-bold">Top 20 Consumer Questions</h3>
        </div>
        <div className="space-y-3">
          {faqCategories.map((category) => (
            <Card key={category}>
              <h4 className="font-semibold text-lg mb-3 text-purple-700">{category}</h4>
              <div className="space-y-3">
                {top20FAQs.filter(faq => faq.category === category).map((faq) => (
                  <div key={faq.id} className="border-l-4 border-purple-200 pl-4">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full text-left flex items-start justify-between"
                    >
                      <p className="font-medium text-sm text-gray-900 flex-1">{faq.question}</p>
                      {expandedFAQ === faq.id ? <ChevronUp className="ml-2" size={18} /> : <ChevronDown className="ml-2" size={18} />}
                    </button>
                    {expandedFAQ === faq.id && (
                      <p className="mt-2 text-sm text-gray-600 italic">"{faq.answer}"</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-red-600" size={24} />
          <h3 className="text-xl font-bold">Common Mistakes to Avoid</h3>
        </div>
        <Card>
          <div className="space-y-4">
            {commonMistakes.map((mistake) => (
              <div key={mistake.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <div className="flex-shrink-0">
                  <span className="text-red-600 font-bold">❌</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 mb-1">{mistake.mistake}</p>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <p className="text-sm text-gray-700">{mistake.correct}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Email Templates Section - MOVED TO END */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="text-green-600" size={24} />
          <h3 className="text-xl font-bold">Email Templates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emailTemplates.map((template) => (
            <Card key={template.id} hover>
              <h4 className="font-semibold text-lg mb-3">{template.title}</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Subject:</p>
                  <p className="text-sm font-medium bg-blue-50 p-2 rounded">{replaceNames(template.subject)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Body:</p>
                  <div className="bg-gray-50 p-3 rounded relative">
                    <button
                      onClick={() => handleCopy(replaceNames(template.body), `email-${template.id}`)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      {copiedId === `email-${template.id}` ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    </button>
                    <pre className="text-sm whitespace-pre-wrap font-sans">{replaceNames(template.body)}</pre>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

