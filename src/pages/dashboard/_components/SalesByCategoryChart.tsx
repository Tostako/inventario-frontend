import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { salesByCategory } from './mockData';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-md] shadow-lg p-3">
      <p className="text-sm font-medium text-[--color-text-primary]">{payload[0].name}</p>
      <p className="text-sm text-[--color-text-muted]">{payload[0].value}% del total</p>
    </div>
  );
}

export function SalesByCategoryChart() {
  return (
    <div className="bg-[--color-bg-surface] border border-[--color-border-default] rounded-[--radius-lg] shadow-sm">
      <div className="px-5 py-4 border-b border-[--color-border-default]">
        <h3 className="text-lg font-semibold text-[--color-text-primary]">Ventas por categoría</h3>
        <p className="text-sm text-[--color-text-muted]">Distribución porcentual</p>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-6">
          <div className="w-[180px] h-[180px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2.5">
            {salesByCategory.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[--color-text-primary]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-[--color-bg-base] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-[--color-text-primary] w-8 text-right">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}