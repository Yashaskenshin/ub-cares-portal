import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole } from '../types'

// Mock users for different BRD personas
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@ub-group.com',
    role: 'ceo',
    permissions: [
      { resource: 'all', action: 'read' },
      { resource: 'executive_dashboard', action: 'read' }
    ]
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@ub-group.com',
    role: 'cxo_quality',
    department: 'Quality',
    permissions: [
      { resource: 'quality_dashboard', action: 'read' },
      { resource: 'functional_dashboard', action: 'read' },
      { resource: 'brewery_data', action: 'read' }
    ]
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@ub-group.com',
    role: 'cxo_sales',
    department: 'Sales & Marketing',
    permissions: [
      { resource: 'sales_dashboard', action: 'read' },
      { resource: 'functional_dashboard', action: 'read' },
      { resource: 'market_data', action: 'read' }
    ]
  },
  {
    id: '4',
    name: 'Vikram Singh',
    email: 'vikram.singh@ub-group.com',
    role: 'extended_leadership',
    zone: 'North',
    permissions: [
      { resource: 'regional_dashboard', action: 'read' },
      { resource: 'zone_data', action: 'read', scope: 'north' }
    ]
  },
  {
    id: '5',
    name: 'Dr. Meera Reddy',
    email: 'meera.reddy@ub-brewery.com',
    role: 'brewery_leadership',
    brewery: 'UNITED BREWERIES LTD - BANGALORE',
    permissions: [
      { resource: 'brewery_dashboard', action: 'read' },
      { resource: 'capa_dashboard', action: 'read' },
      { resource: 'brewery_data', action: 'read', scope: 'bangalore' }
    ]
  },
  {
    id: '6',
    name: 'Rohit Gupta',
    email: 'rohit.gupta@ub-group.com',
    role: 'sales_leadership',
    zone: 'West',
    permissions: [
      { resource: 'market_dashboard', action: 'read' },
      { resource: 'trade_data', action: 'read', scope: 'west' }
    ]
  },
  {
    id: '7',
    name: 'Anjali Nair',
    email: 'anjali.nair@ub-group.com',
    role: 'governance_ctc',
    department: 'Governance & CTC',
    permissions: [
      { resource: 'sla_dashboard', action: 'read' },
      { resource: 'escalation_dashboard', action: 'read' },
      { resource: 'all_complaints', action: 'read' }
    ]
  },
  {
    id: '8',
    name: 'Karan Mehta',
    email: 'karan.mehta@ub-group.com',
    role: 'operational_cx',
    department: 'Customer Experience',
    permissions: [
      { resource: 'cx_dashboard', action: 'read' },
      { resource: 'communication_data', action: 'read' }
    ]
  }
]

// Role display names and descriptions
export const ROLE_CONFIG = {
  ceo: {
    displayName: 'CEO / Managing Director',
    description: 'Executive Governance Dashboard',
    color: 'bg-purple-500',
    icon: '👑'
  },
  cxo_quality: {
    displayName: 'CXO - Quality',
    description: 'Functional Governance Dashboard',
    color: 'bg-blue-500',
    icon: '🔬'
  },
  cxo_sales: {
    displayName: 'CXO - Sales & Marketing',
    description: 'Functional Governance Dashboard',
    color: 'bg-green-500',
    icon: '📈'
  },
  cxo_supply_chain: {
    displayName: 'CXO - Supply Chain',
    description: 'Functional Governance Dashboard',
    color: 'bg-orange-500',
    icon: '🚛'
  },
  cxo_marketing: {
    displayName: 'CXO - Marketing',
    description: 'Functional Governance Dashboard',
    color: 'bg-pink-500',
    icon: '🎯'
  },
  extended_leadership: {
    displayName: 'Extended Leadership',
    description: 'Regional Governance Dashboard',
    color: 'bg-indigo-500',
    icon: '🌍'
  },
  brewery_leadership: {
    displayName: 'Brewery Leadership',
    description: 'Quality & CAPA Governance Dashboard',
    color: 'bg-red-500',
    icon: '🏭'
  },
  sales_leadership: {
    displayName: 'Sales Leadership',
    description: 'Market & Trade Governance Dashboard',
    color: 'bg-emerald-500',
    icon: '🛒'
  },
  governance_ctc: {
    displayName: 'Governance / CTC Teams',
    description: 'SLA & Escalation Governance Dashboard',
    color: 'bg-amber-500',
    icon: '⚖️'
  },
  operational_cx: {
    displayName: 'Operational CX Leadership',
    description: 'CX Communication Governance Dashboard',
    color: 'bg-cyan-500',
    icon: '💬'
  },
  admin: {
    displayName: 'Administrator',
    description: 'Full System Access',
    color: 'bg-gray-800',
    icon: '⚙️'
  }
}

interface UserContextType {
  currentUser: User | null
  setCurrentUser: (user: User) => void
  availableUsers: User[]
  switchUser: (role: UserRole) => void
  hasPermission: (resource: string, action: string, scope?: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Initialize with CEO user by default for demo
  useEffect(() => {
    const defaultUser = MOCK_USERS.find(user => user.role === 'ceo')
    if (defaultUser) {
      setCurrentUser(defaultUser)
    }
  }, [])

  const switchUser = (role: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === role)
    if (user) {
      setCurrentUser(user)
    }
  }

  const hasPermission = (resource: string, action: string, scope?: string): boolean => {
    if (!currentUser) return false

    // Admin has all permissions
    if (currentUser.role === 'admin') return true

    // CEO has read access to everything
    if (currentUser.role === 'ceo' && action === 'read') return true

    return currentUser.permissions.some(permission =>
      permission.resource === resource &&
      permission.action === action &&
      (!scope || !permission.scope || permission.scope === scope)
    )
  }

  const value: UserContextType = {
    currentUser,
    setCurrentUser,
    availableUsers: MOCK_USERS,
    switchUser,
    hasPermission
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
