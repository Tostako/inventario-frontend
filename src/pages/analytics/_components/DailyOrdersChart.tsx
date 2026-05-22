import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dailyOrders } from './mockData';
import { formatCurrency } from '@/lib/utils';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
 if (!active || !payload?.length) return null;
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-md] shadow-lg p-3 space-y-1">
 <p className="text-sm font-medium text-[--color-text-primary]">{label}</p>
 {payload.map((entry, i) => (
 <p key={i} className="text-sm" style={{ color: entry.name === 'revenue' ? '#10B981' : '#8B5CF6' }}>
 {entry.name === 'revenue' ? 'Ingresos' : 'Pedidos'}: {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value}
 </p>
 ))}
 </div>
 );
}

export function DailyOrdersChart() {
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
 <div className="px-5 py-4">
 <h3 className="text-lg font-semibold text-[--color-text-primary]">Ventas de la semana</h3>
 <p className="text-sm text-[--color-text-muted]">Pedidos e ingresos diarios</p>
 </div>
 <div className="p-5">
 <div className="h-[280px]">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={dailyOrders} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={8} />
 <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} dx={-5} />
 <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dx={5} />
 <Tooltip content={<CustomTooltip />} />
 <Bar yAxisId="left" dataKey="revenue" name="revenue" fill="#10B981" radius={[4, 4, 0, 0]} barSize={28} />
 <Bar yAxisId="right" dataKey="orders" name="orders" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={28} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 <div className="flex items-center justify-center gap-6 mt-3 pt-3">
 <div className="flex items-center gap-1.5">
 <div className="w-3 h-3 rounded-full bg-[#10B981]" />
 <span className="text-xs text-[--color-text-muted]">Ingresos (COP)</span>
 </div>
 <div className="flex items-center gap-1.5">
 <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
 <span className="text-xs text-[--color-text-muted]">Pedidos</span>
 </div>
 </div>
 </div>
 </div>
 );
}