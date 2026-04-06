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
      <div className="space-y-1.5 sm:space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 dark:bg-gray-700 dark:text-white',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400',
            'resize-vertical min-h-[80px] sm:min-h-[100px]',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          rows={3}
          {...props}
        />
        {error && (
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
