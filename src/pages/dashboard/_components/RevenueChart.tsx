import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { revenueData } from './mockData';
import { formatCurrency } from '@/lib/utils';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-md] shadow-lg p-3">
      <p className="text-sm font-medium text-[--color-text-primary]">{label}</p>
      <p className="text-sm text-[--color-accent] font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function RevenueChart() {
  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-lg] shadow-sm">
      <div className="px-5 py-4 border-b border-[--color-border-default] flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[--color-text-primary]">Ingresos mensuales</h3>
          <p className="text-sm text-[--color-text-muted]">Evolución de ventas en el año</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-xs font-medium rounded-full bg-[--color-accent] text-[--color-bg-base]">
            Mensual
          </button>
          <button className="px-3 py-1 text-xs font-medium rounded-full text-[--color-text-muted] hover:bg-[--color-bg-hover]">
            Semanal
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}M`}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#colorRevenue)"
                dot={false}
                activeDot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}