import React from 'react';
import { cn } from '../../utils/cn';

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'panel' | 'navbar';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const Glass: React.FC<GlassProps> = ({
  className,
  variant = 'default',
  blur = 'md',
  opacity = 0.8,
  border = true,
  shadow = 'md',
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'rounded-lg',
    card: 'rounded-xl',
    panel: 'rounded-2xl',
    navbar: 'rounded-none'
  };

  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    none: 'shadow-none'
  };

  const borderClasses = border ? 'border border-white/20' : '';

  return (
    <div
      className={cn(
        'bg-white/10',
        blurClasses[blur],
        variantClasses[variant],
        borderClasses,
        shadowClasses[shadow],
        className
      )}
      style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})` }}
      {...props}
    >
      {children}
    </div>
  );
};

// Glass Card Component
export const GlassCard: React.FC<{
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, children, className }) => (
  <Glass variant="card" blur="lg" className={cn('p-6', className)}>
    {title && (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
    )}
    {children}
  </Glass>
);

// Glass Panel Component
export const GlassPanel: React.FC<{
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, actions, children, className }) => (
  <Glass variant="panel" blur="xl" className={cn('p-8', className)}>
    {(title || actions) && (
      <div className="flex items-center justify-between mb-6">
        {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    )}
    {children}
  </Glass>
);

// Glass Navbar Component
export const GlassNavbar: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Glass
    variant="navbar"
    blur="lg"
    border
    shadow="lg"
    className={cn('sticky top-0 z-50', className)}
  >
    <div className="px-6 py-4">
      {children}
    </div>
  </Glass>
);

// Glass Button Component
export const GlassButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}> = ({ children, variant = 'primary', size = 'md', onClick, className }) => {
  const variantClasses = {
    primary: 'bg-white/20 hover:bg-white/30 text-white',
    secondary: 'bg-white/10 hover:bg-white/20 text-gray-900',
    outline: 'bg-transparent hover:bg-white/10 text-white border border-white/20'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg font-medium transition-all duration-200 backdrop-blur-md',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
};

// Glass Badge Component
export const GlassBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}> = ({ children, variant = 'default', className }) => {
  const variantClasses = {
    default: 'bg-white/20 text-white',
    success: 'bg-green-500/20 text-green-100',
    warning: 'bg-yellow-500/20 text-yellow-100',
    error: 'bg-red-500/20 text-red-100'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export { Glass };
