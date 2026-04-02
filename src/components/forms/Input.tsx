import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, id, ...props }, ref) => {
    const inputId = id || `input-${React.useId()}`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
