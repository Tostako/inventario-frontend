import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Receipt, Users, Target, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/utils';
import { kpiMetrics } from './mockData';

const iconMap = {
 dollar: DollarSign,
 cart: ShoppingCart,
 receipt: Receipt,
 users: Users,
 target: Target,
 alert: AlertTriangle,
};

export function AnalyticsKPIs() {
 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
 {kpiMetrics.map((stat) => {
 const Icon = iconMap[stat.icon];
 return (
 <div key={stat.title} className="bg-[--color-bg-surface] rounded-[--radius-lg] p-5 shadow-sm hover:shadow-md transition-shadow">
 <div className="flex items-start justify-between">
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-[--color-text-muted] truncate">{stat.title}</p>
 <p className="text-2xl font-bold text-[--color-text-primary] mt-1">
 {stat.format === 'currency' ? formatCurrency(stat.value) : stat.format === 'percent' ? `${stat.value}%` : stat.value.toLocaleString('es-CO')}
 </p>
 <div className="flex items-center gap-1.5 mt-2">
 <span className={cn('inline-flex items-center gap-0.5 text-sm font-medium px-1.5 py-0.5 rounded-full', {
 'bg-[--color-success-muted] text-[--color-success]': stat.positive,
 'bg-red-100 text-red-700': !stat.positive,
 })}>
 {stat.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
 {stat.positive ? '+' : ''}{stat.change}%
 </span>
 <span className="text-xs text-[--color-text-subtle]">vs mes anterior</span>
 </div>
 </div>
 <div className={cn('p-2.5 rounded-[--radius-md]', {
 'bg-green-50': stat.positive,
 'bg-[--color-error-muted]': !stat.positive,
 })}>
 <Icon className={cn('h-5 w-5', {
 'text-[--color-accent]': stat.positive,
 'text-[--color-error]': !stat.positive,
 })} />
 </div>
 </div>
 </div>
 );
 })}
 </div>
 );
}