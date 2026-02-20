// Utility helper functions

import { PriorityType, RiskType } from '../types';

// Type declaration for setTimeout return type
type TimeoutId = ReturnType<typeof setTimeout>;

/**
 * Format a number with commas for better readability
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

/**
 * Get badge variant based on priority
 */
export const getPriorityVariant = (priority: PriorityType): 'danger' | 'warning' | 'success' => {
  switch (priority) {
    case 'Critical':
      return 'danger';
    case 'Urgent':
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'success';
  }
};

/**
 * Get badge variant based on risk level
 */
export const getRiskVariant = (risk: RiskType): 'danger' | 'warning' | 'success' => {
  switch (risk) {
    case 'High':
      return 'danger';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'success';
  }
};

/**
 * Truncate text to specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Filter array by search query
 */
export const filterBySearch = <T extends Record<string, any>>(
  items: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    searchFields.some(field =>
      String(item[field]).toLowerCase().includes(lowerQuery)
    )
  );
};

/**
 * Get color class for priority
 */
export const getPriorityColor = (priority: PriorityType): string => {
  const colors: Record<string, string> = {
    Critical: 'text-red-700 bg-red-100',
    Urgent: 'text-orange-700 bg-orange-100',
    High: 'text-red-700 bg-red-100',
    Medium: 'text-yellow-700 bg-yellow-100',
    Low: 'text-green-700 bg-green-100',
  };
  return colors[priority] || colors.Low;
};

/**
 * Get color class for risk
 */
export const getRiskColor = (risk: RiskType): string => {
  const colors: Record<string, string> = {
    High: 'text-red-700 bg-red-100',
    Medium: 'text-yellow-700 bg-yellow-100',
    Low: 'text-green-700 bg-green-100',
  };
  const normalizedRisk = risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase();
  return colors[normalizedRisk] || colors.Low;
};

/**
 * Debounce function for search optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: TimeoutId;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Group array by key
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Sort array by key
 */
export const sortBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

