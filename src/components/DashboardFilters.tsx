import { Filter, X } from 'lucide-react'
import { DashboardFilters as FilterType } from '../types'
// import { useUser } from '../contexts/UserContext'

interface DashboardFiltersProps {
  filters: FilterType
  onFiltersChange: (filters: FilterType) => void
  isOpen: boolean
  onToggle: () => void
}

export default function DashboardFilters({ filters, onFiltersChange, isOpen, onToggle }: DashboardFiltersProps) {
  // Mock data for filter options
  const filterOptions = {
    zones: ['North', 'South', 'East', 'West'],
    states: ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Delhi', 'West Bengal', 'Gujarat', 'Rajasthan'],
    breweries: ['UBL Bangalore', 'UBL Chennai', 'UBL Pune', 'UBL Delhi', 'UBL Kolkata'],
    productCategories: ['Beer', 'Wine', 'Spirits', 'RTD', 'Other'],
    skus: ['Kingfisher Premium', 'Kingfisher Ultra', 'Tuborg Green', 'Budweiser', 'Hoegaarden'],
    issueCategories: ['Primary Packaging', 'Product Content', 'Secondary Packaging', 'Logistics', 'Service'],
    subCategories: ['Sediment Beer', 'Underfilled', 'Crown Issues', 'Label Misalignment', 'Foreign Particles'],
    channels: ['SFA', 'Call Centre', 'WhatsApp', 'Email', 'Online Portal'],
    complaintTypes: ['Consumer Complaint', 'Customer Complaint', 'Quality Issue', 'Service Issue'],
    priorities: ['Critical', 'High', 'Medium', 'Low'],
    statuses: ['Open', 'In Progress', 'Resolved', 'Closed', 'Escalated']
  }

  const updateFilter = (key: keyof FilterType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      dateRange: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
      zone: undefined,
      state: undefined,
      brewery: undefined,
      productCategory: undefined,
      sku: undefined,
      issueCategory: undefined,
      subCategory: undefined,
      channel: undefined,
      complaintType: undefined,
      priority: undefined,
      status: undefined
    })
  }

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true)
  )

  if (!isOpen) {
    return (
      <div className="fixed top-32 right-4 z-50">
        <button
          onClick={onToggle}
          className={`p-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 ${hasActiveFilters
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          title="Open filters"
        >
          <Filter size={20} />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed top-32 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Dashboard Filters</h3>
          </div>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.dateRange.start.toISOString().split('T')[0]}
                onChange={(e) => updateFilter('dateRange', {
                  ...filters.dateRange,
                  start: new Date(e.target.value)
                })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.dateRange.end.toISOString().split('T')[0]}
                onChange={(e) => updateFilter('dateRange', {
                  ...filters.dateRange,
                  end: new Date(e.target.value)
                })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Geographic Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geographic Filters
            </label>
            <div className="space-y-2">
              <select
                value={filters.zone || ''}
                onChange={(e) => updateFilter('zone', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Zones</option>
                {filterOptions.zones.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>

              <select
                value={filters.state || ''}
                onChange={(e) => updateFilter('state', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All States</option>
                {filterOptions.states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <select
                value={filters.brewery || ''}
                onChange={(e) => updateFilter('brewery', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Breweries</option>
                {filterOptions.breweries.map(brewery => (
                  <option key={brewery} value={brewery}>{brewery}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Filters
            </label>
            <div className="space-y-2">
              <select
                value={filters.productCategory || ''}
                onChange={(e) => updateFilter('productCategory', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {filterOptions.productCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={filters.sku || ''}
                onChange={(e) => updateFilter('sku', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All SKUs</option>
                {filterOptions.skus.map(sku => (
                  <option key={sku} value={sku}>{sku}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Issue Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Filters
            </label>
            <div className="space-y-2">
              <select
                value={filters.issueCategory || ''}
                onChange={(e) => updateFilter('issueCategory', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {filterOptions.issueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={filters.subCategory || ''}
                onChange={(e) => updateFilter('subCategory', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sub-Categories</option>
                {filterOptions.subCategories.map(subCategory => (
                  <option key={subCategory} value={subCategory}>{subCategory}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Channel & Priority Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel & Priority
            </label>
            <div className="space-y-2">
              <select
                value={filters.channel || ''}
                onChange={(e) => updateFilter('channel', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Channels</option>
                {filterOptions.channels.map(channel => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>

              <select
                value={filters.priority || ''}
                onChange={(e) => updateFilter('priority', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                {filterOptions.priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Type Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status & Type
            </label>
            <div className="space-y-2">
              <select
                value={filters.status || ''}
                onChange={(e) => updateFilter('status', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {filterOptions.statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={filters.complaintType || ''}
                onChange={(e) => updateFilter('complaintType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {filterOptions.complaintTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear All
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onToggle}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onToggle}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
