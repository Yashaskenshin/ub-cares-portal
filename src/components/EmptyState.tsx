import { ReactNode } from 'react';
import Card from './Card';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card hover={false}>
      <div className="text-center py-12">
        {icon && <div className="flex justify-center mb-4 text-gray-400">{icon}</div>}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </Card>
  );
}

