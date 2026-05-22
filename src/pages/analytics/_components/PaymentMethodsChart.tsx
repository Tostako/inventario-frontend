import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { paymentMethodsData } from './mockData';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { amount: number } }> }) {
 if (!active || !payload?.length) return null;
 const d = payload[0];
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-md] shadow-lg p-3">
 <p className="text-sm font-medium text-[--color-text-primary]">{d.name}</p>
 <p className="text-sm text-[--color-text-muted]">{d.value}% del total</p>
 <p className="text-sm text-[--color-accent]">{formatCurrency(d.payload.amount)}</p>
 </div>
 );
}

export function PaymentMethodsChart() {
 const total = paymentMethodsData.reduce((s, d) => s + d.amount, 0);

 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
 <div className="px-5 py-4">
 <h3 className="text-lg font-semibold text-[--color-text-primary]">Métodos de pago</h3>
 <p className="text-sm text-[--color-text-muted]">Distribución de pagos este mes</p>
 </div>
 <div className="p-5">
 <div className="flex items-center gap-6">
 <div className="w-[180px] h-[180px] flex-shrink-0 relative">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie data={paymentMethodsData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
 {paymentMethodsData.map((entry, i) => (
 <Cell key={`cell-${i}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip content={<CustomTooltip />} />
 </PieChart>
 </ResponsiveContainer>
 <div className="absolute inset-0 flex items-center justify-center flex-col">
 <span className="text-lg font-bold text-[--color-text-primary]">{formatCurrency(total)}</span>
 <span className="text-xs text-[--color-text-muted]">Total</span>
 </div>
 </div>
 <div className="flex-1 space-y-3">
 {paymentMethodsData.map((item) => (
 <div key={item.name} className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
 <span className="text-sm text-[--color-text-primary]">{item.name}</span>
 </div>
 <div className="flex items-center gap-3">
 <span className="text-sm font-semibold text-[--color-text-primary]">{item.value}%</span>
 <span className="text-xs text-[--color-text-muted]">{formatCurrency(item.amount)}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}