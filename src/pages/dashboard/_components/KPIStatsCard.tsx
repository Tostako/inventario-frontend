import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/utils';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Receipt,
  Target,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const iconMap = {
  dollar: DollarSign,
  cart: ShoppingCart,
  package: Package,
  users: Users,
  receipt: Receipt,
  target: Target,
} as const;

interface KPIStatsCardProps {
  title: string;
  value: number;
  previousValue: number;
  change: number;
  positive: boolean;
  icon: keyof typeof iconMap;
  format: 'currency' | 'number' | 'percent';
}

export function KPIStatsCard({ title, value, change, positive, icon, format }: KPIStatsCardProps) {
  const IconComponent = iconMap[icon];

  const formattedValue = (() => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return `${value}%`;
      default:
        return value.toLocaleString('es-CO');
    }
  })();

  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-lg] p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[--color-text-muted] truncate">{title}</p>
          <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{formattedValue}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-sm font-medium px-1.5 py-0.5 rounded-full',
                {
                  'bg-[--color-success-muted] text-[--color-success]': positive,
                  'bg-[--color-error-muted] text-[--color-red]': !positive,
                }
              )}
            >
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {positive ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-[--color-text-subtle]">vs mes anterior</span>
          </div>
        </div>
        <div className="p-3 rounded-[--radius-md] bg-[--color-bg-base]">
          <IconComponent className="h-5 w-5 text-[--color-accent]" />
        </div>
      </div>
    </div>
  );
}