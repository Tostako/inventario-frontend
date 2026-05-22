import { Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { recentOrders } from './mockData';
import { ArrowRight } from 'lucide-react';

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
  completed: { label: 'Completado', variant: 'success' },
  pending: { label: 'Pendiente', variant: 'warning' },
  processing: { label: 'En proceso', variant: 'info' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
};

export function RecentOrdersTable() {
  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-lg] shadow-sm">
      <div className="px-5 py-4 border-b border-[--color-border-default] flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[--color-text-primary]">Pedidos recientes</h3>
          <p className="text-sm text-[--color-text-muted]">Últimos pedidos del negocio</p>
        </div>
        <button className="inline-flex items-center gap-1 text-sm font-medium text-[--color-accent] hover:underline">
          Ver todos <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[--color-bg-base]">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">
                Pedido
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">
                Items
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">
                Total
              </th>
              <th className="px-5 py-3 text-center text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[--color-border-default]">
            {recentOrders.map((order) => {
              const status = statusMap[order.status];
              return (
                <tr key={order.id} className="hover:bg-[--color-bg-hover] transition-colors cursor-pointer">
                  <td className="px-5 py-3">
                    <span className="font-medium text-[--color-accent]">{order.id}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-[--color-text-primary]">{order.customer}</p>
                      <p className="text-xs text-[--color-text-muted]">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-[--color-text-muted]">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-5 py-3 text-sm text-[--color-text-muted]">
                    {order.items} items
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-[--color-text-primary] text-right">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}