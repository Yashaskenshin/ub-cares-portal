import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'purple'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-700',
  red: 'bg-red-50 text-red-700',
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-yellow-50 text-yellow-700',
  purple: 'bg-purple-50 text-purple-700',
}

const iconBackgrounds = {
  blue: 'bg-blue-100',
  red: 'bg-red-100',
  green: 'bg-green-100',
  yellow: 'bg-yellow-100',
  purple: 'bg-purple-100',
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  color = 'blue',
}: StatCardProps) {
  return (
    <div className={`rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {description && <p className="text-xs mt-2 opacity-75">{description}</p>}
        </div>
        {icon && <div className={`${iconBackgrounds[color]} p-3 rounded-lg`}>{icon}</div>}
      </div>
    </div>
  )
}

