import { useState } from 'react'
import { breweries, breweriesByCluster, breweryCounts } from '../data/breweryData'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import SearchBar from '../components/SearchBar'
import FilterTabs from '../components/FilterTabs'
import { Building2, MapPin } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function BreweriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCluster, setSelectedCluster] = useState('all')

  const clusterTabs = [
    { id: 'all', label: 'All Breweries', count: breweries.length },
    { id: 'North India', label: 'North India', count: breweriesByCluster['North India'].length },
    { id: 'South India', label: 'South India', count: breweriesByCluster['South India'].length },
    { id: 'East India', label: 'East India', count: breweriesByCluster['East India'].length },
    { id: 'West India', label: 'West India', count: breweriesByCluster['West India'].length },
  ]

  const filtered = breweries.filter(brewery => {
    const matchesSearch = (brewery.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brewery.shortName?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCluster = selectedCluster === 'all' || brewery.cluster === selectedCluster
    return matchesSearch && matchesCluster
  })

  const clusterData = [
    { name: 'North India', value: breweriesByCluster['North India'].length },
    { name: 'South India', value: breweriesByCluster['South India'].length },
    { name: 'East India', value: breweriesByCluster['East India'].length },
    { name: 'West India', value: breweriesByCluster['West India'].length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Brewery Network</h2>
        <p className="text-gray-600 mb-6">
          32 breweries across India - 22 owned and 10 contract partners managing quality complaints.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Breweries"
          value="32"
          description={`${breweryCounts['Total Owned']} Owned + ${breweryCounts['Total Contract']} Contract`}
          icon={<Building2 size={24} />}
          color="blue"
        />
        <StatCard
          title="South India"
          value={breweryCounts['South India']}
          description="Largest cluster"
          icon={<MapPin size={24} />}
          color="green"
        />
        <StatCard
          title="North India"
          value={breweryCounts['North India']}
          icon={<MapPin size={24} />}
          color="purple"
        />
        <StatCard
          title="East & West"
          value={breweryCounts['East India'] + breweryCounts['West India']}
          description="Combined"
          icon={<MapPin size={24} />}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Distribution by Cluster</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clusterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Owned vs Contract</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Owned', value: breweryCounts['Total Owned'] },
                  { name: 'Contract', value: breweryCounts['Total Contract'] }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#3b82f6" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <SearchBar
          placeholder="Search brewery by name or code..."
          onSearch={setSearchQuery}
        />
        <FilterTabs
          tabs={clusterTabs}
          active={selectedCluster}
          onChange={setSelectedCluster}
        />
      </div>

      {/* Breweries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? (
          filtered.map((brewery) => (
            <Card key={brewery.id} hover>
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{brewery.shortName || brewery.name}</h3>
                  <p className="text-xs text-gray-500">{brewery.code || 'N/A'}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${(brewery.type === 'Own' || brewery.type === 'owned')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                  }`}>
                  {brewery.type || 'Partners'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{brewery.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin size={12} /> {brewery.cluster || brewery.zone}
              </p>
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-center text-gray-500 col-span-full">No breweries found.</p>
          </Card>
        )}
      </div>

      {/* Cluster Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Breweries by Cluster</h3>
        {['North India', 'South India', 'East India', 'West India'].map((cluster) => (
          <Card key={cluster}>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />
              {cluster} ({breweriesByCluster[cluster as keyof typeof breweriesByCluster].length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {breweriesByCluster[cluster as keyof typeof breweriesByCluster].map((brewery) => (
                <div key={brewery.id} className="text-sm p-2 bg-gray-50 rounded">
                  <p className="font-medium">{brewery.shortName || brewery.name}</p>
                  <p className="text-xs text-gray-600">{brewery.name}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

