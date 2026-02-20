import { slaMatrix, olaMatrix } from '../data/processData'
import Card from '../components/Card'
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SLAPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">SLA & OLA Matrices</h2>
        <p className="text-gray-600 mb-6">
          Service Level Agreements (SLA) and Operational Level Agreements (OLA) for Consumer and Customer complaints.
        </p>
      </div>

      {/* Consumer Complaints */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle size={24} className="text-red-600" />
          Consumer Complaints
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SLA */}
          <Card>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Service Level Agreement (SLA)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 px-2 font-bold">Priority</th>
                    <th className="text-left py-2 px-2 font-bold">Response</th>
                    <th className="text-left py-2 px-2 font-bold">Resolution</th>
                    <th className="text-left py-2 px-2 font-bold">SLA Window</th>
                  </tr>
                </thead>
                <tbody>
                  {slaMatrix.consumer.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{row.priority}</td>
                      <td className="py-3 px-2">{row.response}</td>
                      <td className="py-3 px-2">{row.resolution}</td>
                      <td className="py-3 px-2 font-semibold text-blue-600">{row.slaWindow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* OLA */}
          <Card>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />
              Operational Level Agreement (OLA)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 px-2 font-bold">Priority</th>
                    <th className="text-left py-2 px-2 font-bold">Callback</th>
                    <th className="text-left py-2 px-2 font-bold">Sample</th>
                    <th className="text-left py-2 px-2 font-bold">Validation</th>
                  </tr>
                </thead>
                <tbody>
                  {olaMatrix.consumer.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{row.priority}</td>
                      <td className="py-3 px-2">{row.callback}</td>
                      <td className="py-3 px-2">{row.sampleCollection}</td>
                      <td className="py-3 px-2">{row.validation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Customer/Retailer Complaints */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle size={24} className="text-orange-600" />
          Customer/Retailer Complaints
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SLA */}
          <Card>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Service Level Agreement (SLA)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 px-2 font-bold">Priority</th>
                    <th className="text-left py-2 px-2 font-bold">Response</th>
                    <th className="text-left py-2 px-2 font-bold">Resolution</th>
                    <th className="text-left py-2 px-2 font-bold">SLA Window</th>
                  </tr>
                </thead>
                <tbody>
                  {slaMatrix.customer.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{row.priority}</td>
                      <td className="py-3 px-2">{row.response}</td>
                      <td className="py-3 px-2">{row.resolution}</td>
                      <td className="py-3 px-2 font-semibold text-blue-600">{row.slaWindow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* OLA */}
          <Card>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />
              Operational Level Agreement (OLA)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 px-2 font-bold">Priority</th>
                    <th className="text-left py-2 px-2 font-bold">Callback</th>
                    <th className="text-left py-2 px-2 font-bold">Sample</th>
                    <th className="text-left py-2 px-2 font-bold">Settlement</th>
                  </tr>
                </thead>
                <tbody>
                  {olaMatrix.customer.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{row.priority}</td>
                      <td className="py-3 px-2">{row.callback}</td>
                      <td className="py-3 px-2">{row.sampleCollection}</td>
                      <td className="py-3 px-2">{row.settlement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Key Definitions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h4 className="font-semibold mb-3">What is SLA?</h4>
          <p className="text-sm text-gray-600">
            Service Level Agreement defines the expected performance standards for complaint resolution from the customer perspective. It includes response time and total resolution time targets.
          </p>
        </Card>

        <Card>
          <h4 className="font-semibold mb-3">What is OLA?</h4>
          <p className="text-sm text-gray-600">
            Operational Level Agreement defines internal milestones and handoff timelines between departments (callback, sample collection, validation, settlement) to ensure SLA compliance.
          </p>
        </Card>

        <Card>
          <h4 className="font-semibold mb-3">SLA Window</h4>
          <p className="text-sm text-gray-600">
            The acceptable time frame for complaint resolution. Critical: 45 mins, Urgent: 45 mins, Medium: 63 mins, Low: 72 mins for escalation triggers if missed.
          </p>
        </Card>
      </div>

      {/* Priority Legend */}
      <Card>
        <h3 className="font-semibold text-lg mb-4">Priority Level Definitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-600">
            <h5 className="font-bold text-red-700 mb-2">🔴 CRITICAL</h5>
            <p className="text-sm text-gray-600">
              Foreign matter, damaged bottle rim, carton adhesive failure. Safety-related high-risk issues.
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
            <h5 className="font-bold text-orange-700 mb-2">🟠 URGENT</h5>
            <p className="text-sm text-gray-600">
              Product content issues (sediment, flat, taste), high-volume packaging defects.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
            <h5 className="font-bold text-yellow-700 mb-2">🟡 MEDIUM</h5>
            <p className="text-sm text-gray-600">
              Moderate risk issues with medium volume or handling-related damages.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
            <h5 className="font-bold text-green-700 mb-2">🟢 LOW</h5>
            <p className="text-sm text-gray-600">
              Low-risk packaging defects with minimal impact on product quality.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

