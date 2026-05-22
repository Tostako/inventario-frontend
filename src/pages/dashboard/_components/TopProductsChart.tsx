import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { topProducts } from './mockData';
import { formatCurrency } from '@/lib/utils';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; sales: number; revenue: number } }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-md] shadow-lg p-3">
      <p className="text-sm font-medium text-[--color-text-primary]">{data.name}</p>
      <p className="text-sm text-[--color-accent]">{data.sales} unidades vendidas</p>
      <p className="text-sm text-[--color-text-muted]">{formatCurrency(data.revenue)}</p>
    </div>
  );
}

export function TopProductsChart() {
  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-lg] shadow-sm">
      <div className="px-5 py-4 border-b border-[--color-border-default] flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[--color-text-primary]">Productos más vendidos</h3>
          <p className="text-sm text-[--color-text-muted]">Top 6 por unidades vendidas</p>
        </div>
      </div>
      <div className="p-5">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#111827', fontSize: 12 }}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="sales"
                fill="#10B981"
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}