import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface TableColumn<T> {
  key: keyof T | 'actions';
  title: string;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  className,
  onRowClick
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-16 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-sm">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full', className)}>
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  'text-left py-3 px-4 text-sm font-semibold text-gray-900',
                  column.className
                )}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <motion.tr
              key={index}
              className={cn(
                'border-b border-gray-100 hover:bg-gray-50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onRowClick?.(item, index)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={cn(
                    'py-3 px-4 text-sm text-gray-700',
                    column.className
                  )}
                >
                  {column.render
                    ? column.render(column.key === 'actions' ? null : item[column.key as keyof T], item, index)
                    : column.key === 'actions' ? null : item[column.key as keyof T]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
