import { FileText, Zap, Building2, Clock, BookOpen, GraduationCap, AlertTriangle } from 'lucide-react'

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  // All navigation items available to everyone
  // Personas/roles only affect which dashboard is shown, not page access
  // Ordered as: Issues, Training, Process, Escalation, SLA & OLA, Documentation, Brewery
  const navItems = [
    { id: 'issues', label: 'Issues', icon: FileText },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'process', label: 'Process', icon: Zap },
    { id: 'escalation', label: 'Escalation', icon: AlertTriangle },
    { id: 'sla', label: 'SLA & OLA', icon: Clock },
    { id: 'documentation', label: 'Documentation', icon: BookOpen },
    { id: 'breweries', label: 'Breweries', icon: Building2 }
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

