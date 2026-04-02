import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || `textarea-${React.useId()}`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            'resize-vertical',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          rows={4}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export { Textarea };
