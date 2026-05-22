import { cn } from '@/lib/cn';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-lg] shadow-[var(--shadow-card)]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('px-5 py-4 border-b border-[--color-border-default]', className)}>{children}</div>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardProps) {
  return <div className={cn('px-5 py-4 border-t border-[--color-border-default]', className)}>{children}</div>;
}