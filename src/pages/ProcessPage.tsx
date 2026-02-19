import { processSteps } from '../data/processData'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { ArrowRight } from 'lucide-react'

export default function ProcessPage() {
  const stepColors = ['bg-blue-50', 'bg-purple-50', 'bg-green-50', 'bg-yellow-50', 'bg-red-50', 'bg-indigo-50']

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">End-to-End Process Flow</h2>
        <p className="text-gray-600 mb-6">
          Six-step complaint lifecycle from capture to closure with defined SLAs and ownership.
        </p>
      </div>

      {/* Process Timeline */}
      <div className="space-y-4">
        {processSteps.map((step, index) => (
          <div key={step.id}>
            <Card className={`${stepColors[index]} border-l-4 border-blue-600`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full font-bold text-lg text-blue-600 border-2 border-blue-600">
                      {step.id}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{step.name}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
                <Badge label={step.duration || `${step.slaHours}h`} variant="info" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Activities</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {(step.key_activities || step.activities || []).map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Ownership</h4>
                  <p className="text-sm text-gray-600">{step.owner || step.department || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Output</h4>
                  <p className="text-sm text-gray-600">{step.output || (step.outputs?.[0]) || 'N/A'}</p>
                </div>
              </div>
            </Card>

            {index < processSteps.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowRight className="text-blue-600 transform -rotate-90" size={24} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Process Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <h3 className="font-semibold text-lg mb-4">Critical Priority Timeline</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Capture:</strong> 1 hour callback</p>
            <p><strong>Validation:</strong> 24-48 hours</p>
            <p><strong>RCA:</strong> 1-2 days</p>
            <p><strong>Settlement:</strong> Fortnightly</p>
            <p className="font-bold text-red-600 mt-3">Total: 5 days</p>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-lg mb-4">Sample Collection</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Provider:</strong> Sequel Logistics</p>
            <p><strong>Coverage:</strong> Pan-India</p>
            <p><strong>Timeline:</strong> Within 24 hours</p>
            <p><strong>Success Rate:</strong> &gt;90%</p>
            <p className="text-blue-600 font-semibold mt-3">Key: Sample reaches brewery untampered</p>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-lg mb-4">Key Governance</h3>
          <div className="space-y-2 text-sm">
            <p><strong>1:</strong> 44 standardized checklists</p>
            <p><strong>2:</strong> 44 SOP templates</p>
            <p><strong>3:</strong> Multi-level escalation</p>
            <p><strong>4:</strong> CTC audit & approval</p>
            <p className="text-green-600 font-semibold mt-3">Result: Consistency & Transparency</p>
          </div>
        </Card>
      </div>

      {/* Process Improvements */}
      <Card>
        <h3 className="text-xl font-bold mb-4">Before vs After: Key Improvements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-red-600 mb-3">❌ Previous State</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 15-30 days to raise complaint</li>
              <li>• 90% samples lost/tampered</li>
              <li>• Subjective validation</li>
              <li>• Inconsistent RCA approach</li>
              <li>• Manual settlement (3-4 months)</li>
              <li>• No digital trail</li>
              <li>• High customer dissatisfaction</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-600 mb-3">✅ New State (UB Cares)</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 1-8 hours to capture</li>
              <li>• 24-hour guaranteed delivery</li>
              <li>• 44 standardized checklists</li>
              <li>• 44 SOP templates</li>
              <li>• Digital fortnightly processing</li>
              <li>• Complete audit trail</li>
              <li>• Faster, fairer resolution</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

