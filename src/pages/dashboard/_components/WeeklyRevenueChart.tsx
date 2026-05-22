import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { weeklyRevenue } from './mockData';
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

export function WeeklyRevenueChart() {
  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-lg] shadow-sm">
      <div className="px-5 py-4 border-b border-[--color-border-default]">
        <h3 className="text-lg font-semibold text-[--color-text-primary]">Ingresos de la semana</h3>
        <p className="text-sm text-[--color-text-muted]">Ventas diarias de la semana actual</p>
      </div>
      <div className="p-5">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyRevenue} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="revenue"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}