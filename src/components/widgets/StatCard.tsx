import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl p-6 shadow-sm border border-gray-200',
        'hover:shadow-md hover:border-gray-300 transition-all duration-200',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center space-x-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-500">from last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};
