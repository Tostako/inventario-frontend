import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={`block text-sm font-medium mb-1.5 ${error ? 'text-red-600' : 'text-[--color-text-secondary]'}`}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2 text-sm bg-[--color-bg-elevated] border rounded-[--radius-md] text-[--color-text-primary] placeholder:text-[--color-text-subtle] transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20 focus:border-[--color-accent]',
            error
              ? 'border-[--color-red] focus:ring-[--color-red]/20 focus:border-[--color-red]'
              : 'border-[--color-border-default] hover:border-[--color-border-strong]',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm font-medium text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-[--color-text-muted]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';