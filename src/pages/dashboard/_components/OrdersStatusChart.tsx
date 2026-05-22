import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { orderStatusData } from './mockData';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-md] shadow-lg p-3">
      <p className="text-sm font-medium text-[--color-text-primary]">{payload[0].name}</p>
      <p className="text-sm text-[--color-text-muted]">{payload[0].value} pedidos</p>
    </div>
  );
}

export function OrdersStatusChart() {
  const total = orderStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-lg] shadow-sm">
      <div className="px-5 py-4 border-b border-[--color-border-default]">
        <h3 className="text-lg font-semibold text-[--color-text-primary]">Estado de pedidos</h3>
        <p className="text-sm text-[--color-text-muted]">Distribución por estado actual</p>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-6">
          <div className="relative w-[180px] h-[180px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-[--color-text-primary]">{total}</span>
              <span className="text-xs text-[--color-text-muted]">Total</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[--color-text-primary]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[--color-text-primary]">{item.value}</span>
                  <span className="text-xs text-[--color-text-muted]">
                    ({((item.value / total) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}