import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-[--radius-md] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent]/30 disabled:opacity-40 disabled:cursor-not-allowed',
          {
            'bg-[--color-accent] text-white hover:bg-[--color-accent-hover] active:bg-[--color-accent]': variant === 'primary',
            'bg-white text-[--color-text-primary] border border-[--color-border-strong] hover:bg-[--color-bg-hover] hover:border-[--color-border-strong]': variant === 'secondary',
            'bg-transparent text-[--color-text-muted] hover:text-[--color-text-primary] hover:bg-[--color-bg-hover]': variant === 'ghost',
            'bg-[--color-error-muted] text-[--color-red] hover:bg-red-100 active:bg-[--color-error-muted]': variant === 'danger',
            'bg-emerald-400 text-white hover:bg-emerald-700 active:bg-emerald-500': variant === 'success',
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-2.5 text-sm': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';