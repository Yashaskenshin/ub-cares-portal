import { Users } from 'lucide-react'
import { useUser } from '../contexts/UserContext'

interface DashboardPersonaSelectorProps {
  className?: string
}

export default function DashboardPersonaSelector({ className = '' }: DashboardPersonaSelectorProps) {
  const { currentUser, switchUser, availableUsers } = useUser()

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Dashboard Persona</h3>
            <p className="text-xs text-blue-700">Switch between different governance views</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {currentUser?.role?.replace(/_/g, ' ').toUpperCase()}
            </div>
          </div>

          <select
            value={currentUser?.role || ''}
            onChange={(e) => switchUser(e.target.value as any)}
            className="text-sm border-2 border-blue-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900 min-w-[200px]"
          >
            {availableUsers.map(user => (
              <option key={user.id} value={user.role}>
                {user.role.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
