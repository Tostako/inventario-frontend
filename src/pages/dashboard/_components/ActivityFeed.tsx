import { activityFeed } from './mockData';
import {
  ShoppingCart,
  AlertTriangle,
  UserPlus,
  CreditCard,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const iconMap = {
  order: { icon: ShoppingCart, bg: 'bg-[--color-info-muted]', color: 'text-[--color-blue]' },
  stock: { icon: AlertTriangle, bg: 'bg-[--color-warning-muted]', color: 'text-[--color-yellow]' },
  customer: { icon: UserPlus, bg: 'bg-[--color-success-muted]', color: 'text-[--color-success]' },
  payment: { icon: CreditCard, bg: 'bg-purple-100', color: 'text-purple-600' },
  product: { icon: Package, bg: 'bg-pink-100', color: 'text-pink-600' },
};

export function ActivityFeed() {
  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-lg] shadow-sm">
      <div className="px-5 py-4 border-b border-[--color-border-default]">
        <h3 className="text-lg font-semibold text-[--color-text-primary]">Actividad reciente</h3>
        <p className="text-sm text-[--color-text-muted]">Últimas acciones en tu tienda</p>
      </div>
      <div className="divide-y divide-[--color-border-default]">
        {activityFeed.map((item) => {
          const config = iconMap[item.type];
          const Icon = config.icon;
          return (
            <div key={item.id} className="flex items-start gap-3 px-5 py-3 hover:bg-[--color-bg-hover] transition-colors">
              <div className={cn('p-2 rounded-[--radius-md] flex-shrink-0', config.bg)}>
                <Icon className={cn('h-4 w-4', config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[--color-text-primary]">{item.message}</p>
                <p className="text-xs text-[--color-text-subtle] mt-0.5">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}