import Card from '../components/Card'
import Badge from '../components/Badge'
import { AlertTriangle, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { escalationMatrix, crisisDefinitions, crisisRules, escalationTriggers } from '../data/escalationData'

export default function EscalationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Escalation Matrix & Crisis Management</h2>
        <p className="text-gray-600 mb-6">
          Complete escalation procedures and crisis management guidelines for handling critical complaints.
        </p>
      </div>

      {/* Escalation Matrix Table */}
      <section>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-red-600" size={24} />
            <h3 className="text-xl font-bold">Escalation Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="text-left py-3 px-4 font-bold">Issue Severity</th>
                  <th className="text-left py-3 px-4 font-bold">Level 1 Escalation</th>
                  <th className="text-left py-3 px-4 font-bold">Level 2 Escalation</th>
                  <th className="text-left py-3 px-4 font-bold">Crisis Escalation</th>
                </tr>
              </thead>
              <tbody>
                {escalationMatrix.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      <Badge 
                        label={row.severity} 
                        variant={row.severity.includes('Critical') ? 'danger' : row.severity.includes('Urgent') ? 'warning' : 'default'} 
                      />
                    </td>
                    <td className="py-3 px-4">{row.level1}</td>
                    <td className="py-3 px-4">{row.level2}</td>
                    <td className="py-3 px-4 font-semibold text-red-600">{row.crisis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Your Role:</strong> Create ticket, escalate to Level 1 (via supervisor)
            </p>
          </div>
        </Card>
      </section>

      {/* When to Escalate */}
      <section>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-orange-600" size={24} />
            <h3 className="text-xl font-bold">When to Escalate</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Escalate to Supervisor IMMEDIATELY if:</p>
          <div className="space-y-2">
            {escalationTriggers.map((trigger, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                <AlertTriangle className="text-orange-600 mt-0.5" size={16} />
                <p className="text-sm text-gray-700">{trigger}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-800 mb-2">How to Escalate:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Call supervisor immediately (don't wait)</li>
              <li>• Send email with "URGENT - ESCALATION" in subject</li>
              <li>• Include ticket ID and brief summary</li>
              <li>• Continue monitoring until supervisor responds</li>
            </ul>
          </div>
        </Card>
      </section>

      {/* Crisis Management */}
      <section>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="text-red-600" size={24} />
            <h3 className="text-xl font-bold">Crisis Management</h3>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-3">Definition of Crisis:</h4>
            <div className="space-y-2">
              {crisisDefinitions.map((crisis) => (
                <div key={crisis.id} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                  <XCircle className="text-red-600 mt-0.5" size={16} />
                  <p className="text-sm text-gray-700">{crisis.definition}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Crisis Communication Rules:</h4>
            <div className="space-y-3">
              {crisisRules.map((rule) => (
                <div key={rule.id} className={`flex items-start gap-3 p-3 rounded-lg ${rule.type === 'do' ? 'bg-green-50' : 'bg-red-50'}`}>
                  {rule.type === 'do' ? (
                    <CheckCircle2 className="text-green-600 mt-0.5" size={18} />
                  ) : (
                    <XCircle className="text-red-600 mt-0.5" size={18} />
                  )}
                  <p className={`text-sm font-medium ${rule.type === 'do' ? 'text-green-800' : 'text-red-800'}`}>
                    {rule.rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

