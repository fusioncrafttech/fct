import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  ...props
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const defaultDimensions = {
    text: { width: '100%', height: '1rem' },
    circular: { width: '2.5rem', height: '2.5rem' },
    rectangular: { width: '100%', height: '2rem' },
    rounded: { width: '100%', height: '2rem' }
  };

  const dimensions = {
    width: width || defaultDimensions[variant].width,
    height: height || defaultDimensions[variant].height
  };

  return (
    <div
      className={cn(
        'bg-gray-200',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={dimensions}
      {...props}
    />
  );
};

// Card Skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-xl shadow-sm border border-gray-200 p-6', className)}>
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={16} />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton height={16} />
        <Skeleton height={16} />
        <Skeleton width="80%" height={16} />
      </div>
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 4,
  className
}) => (
  <div className={cn('bg-white rounded-xl shadow-sm border border-gray-200', className)}>
    <div className="p-4 border-b border-gray-200">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} height={20} />
        ))}
      </div>
    </div>
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} height={16} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-xl shadow-sm border border-gray-200 p-6', className)}>
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton width="50%" height={16} />
        <Skeleton width="30%" height={24} />
      </div>
      <Skeleton variant="rounded" width={48} height={48} />
    </div>
  </div>
);

// List Skeleton
export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({
  items = 5,
  className
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="40%" height={16} />
          <Skeleton width="60%" height={14} />
        </div>
        <Skeleton width={80} height={32} />
      </div>
    ))}
  </div>
);

export { Skeleton };
