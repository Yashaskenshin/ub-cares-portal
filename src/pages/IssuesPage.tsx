import { useState, useMemo } from 'react'
import { issues } from '../data/issueData'
import Card from '../components/Card'
import SearchBar from '../components/SearchBar'
import FilterTabs from '../components/FilterTabs'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import { ChevronDown, ChevronUp, FileQuestion, AlertTriangle } from 'lucide-react'
import { commonMistakes } from '../data/trainingData'

export default function IssuesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'All Issues', count: issues.length },
    { id: 'Product Content', label: 'Product Content', count: issues.filter(i => i.category === 'Product Content').length },
    { id: 'Primary Packaging', label: 'Primary Packaging', count: issues.filter(i => i.category === 'Primary Packaging').length },
    { id: 'Secondary Packaging', label: 'Secondary Packaging', count: issues.filter(i => i.category === 'Secondary Packaging').length }
  ]

  const filtered = useMemo(() => {
    return issues.filter(issue => {
      const subcat = issue.subcategory || '';
      const desc = issue.description || '';
      const matchesSearch = subcat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Issue Categorization (44 Types)</h2>
        <p className="text-gray-600 mb-6">
          Browse all complaint types with validation requirements, settlement guidelines, and RCA resources.
        </p>
      </div>

      {/* Common Mistakes Alert */}
      <Card className="bg-red-50 border-l-4 border-red-500">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-600 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 mb-2">Common Mistakes to Avoid</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {commonMistakes.map((mistake) => (
                <div key={mistake.id} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">❌</span>
                  <span className="text-gray-700">{mistake.mistake}</span>
                  <span className="text-green-600 font-bold ml-1">→</span>
                  <span className="text-gray-700">{mistake.correct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          placeholder="Search issues by name or description..."
          onSearch={setSearchQuery}
        />
        <FilterTabs
          tabs={categories}
          active={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 mb-6">
        <strong>Found {filtered.length} of {issues.length} issues</strong>
        {searchQuery && ` matching "${searchQuery}"`}
        {selectedCategory !== 'all' && ` in ${selectedCategory}`}
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((issue) => (
            <Card key={issue.id} hover className="cursor-pointer transition-all duration-200 hover:shadow-md" onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{issue.subcategory || 'Unnamed Issue'}</h3>
                    <Badge label={issue.category || 'Uncategorized'} variant="info" />
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge label={`Priority: ${issue.priority || 'Medium'}`} variant={
                      issue.priority === 'Critical' ? 'danger' :
                        issue.priority === 'Urgent' ? 'warning' :
                          issue.priority === 'Medium' ? 'warning' : 'success'
                    } />
                    <Badge label={`Risk: ${issue.risk || 'Medium'}`} variant={
                      issue.risk === 'High' ? 'danger' :
                        issue.risk === 'Medium' ? 'warning' : 'success'
                    } />
                    <Badge label={`Volume: ${issue.volume || 'N/A'}`} variant="default" />
                    <Badge label={issue.sampleRequired ? 'Sample Required' : 'No Sample'} variant={issue.sampleRequired ? 'warning' : 'success'} />
                  </div>
                  <div className="text-xs text-gray-500">
                    Click to view details, checklists, and settlement guidelines
                  </div>
                </div>
                <button
                  className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedId(expandedId === issue.id ? null : issue.id)
                  }}
                >
                  {expandedId === issue.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Expanded Content */}
              {expandedId === issue.id && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-sm text-gray-700 mb-2">Consumer Settlement</p>
                      <p className="text-lg font-bold text-blue-600">{issue.consumerSettlement || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-700 mb-2">Customer Settlement</p>
                      <p className="text-lg font-bold text-green-600">{issue.customerSettlement || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Acceptable Proofs (up to 5)</h4>
                    <ul className="space-y-1 text-sm">
                      {(issue.acceptableProofs || []).map((proof, idx) => (
                        <li key={idx} className="text-gray-600">• {proof}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Validation Checklist</h4>
                    <ul className="space-y-1 text-sm">
                      {(issue.validationChecklist || []).map((item, idx) => (
                        <li key={idx} className="text-gray-600">• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Probable Causes (RCA)</h4>
                    <ul className="space-y-1 text-sm">
                      {(issue.probableCauses || []).map((cause, idx) => (
                        <li key={idx} className="text-gray-600">• {cause}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Level 1 Escalation</p>
                      <p className="text-sm font-medium">{issue.escalationL1 || 'Not defined'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Level 2 Escalation</p>
                      <p className="text-sm font-medium">{issue.escalationL2 || 'Not defined'}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<FileQuestion size={48} />}
            title="No issues found"
            description={`No issues match your search "${searchQuery}" or selected filters. Try adjusting your search criteria.`}
          />
        )}
      </div>
    </div>
  )
}

