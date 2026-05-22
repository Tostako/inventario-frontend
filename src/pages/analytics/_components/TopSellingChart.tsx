import {
 BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { topSellingProducts } from './mockData';
import { formatCurrency } from '@/lib/utils';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; units: number; revenue: number; margin: number } }> }) {
 if (!active || !payload?.length) return null;
 const d = payload[0].payload;
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-md] shadow-lg p-3">
 <p className="text-sm font-medium text-[--color-text-primary]">{d.name}</p>
 <p className="text-sm text-[--color-accent]">{d.units} unidades</p>
 <p className="text-sm text-[--color-text-muted]">Ingresos: {formatCurrency(d.revenue)}</p>
 <p className="text-sm text-[--color-success]">Margen: {d.margin}%</p>
 </div>
 );
}

export function TopSellingChart() {
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
 <div className="px-5 py-4">
 <h3 className="text-lg font-semibold text-[--color-text-primary]">Top productos vendidos</h3>
 <p className="text-sm text-[--color-text-muted]">Por unidades vendidas con margen de ganancia</p>
 </div>
 <div className="p-5">
 <div className="h-[300px]">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={topSellingProducts} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#27272A" horizontal={false} />
 <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
 <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#111827', fontSize: 11 }} width={95} />
 <Tooltip content={<CustomTooltip />} />
 <Bar dataKey="units" fill="#10B981" radius={[0, 4, 4, 0]} barSize={22}>
 {topSellingProducts.map((entry, i) => (
 <rect key={i} fill={entry.margin>= 25 ? '#10B981' : entry.margin>= 20 ? '#3B82F6' : '#F59E0B'} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
 <div className="flex items-center justify-center gap-6 mt-3 pt-3">
 <div className="flex items-center gap-1.5">
 <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
 <span className="text-xs text-[--color-text-muted]">Margen ≥25%</span>
 </div>
 <div className="flex items-center gap-1.5">
 <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
 <span className="text-xs text-[--color-text-muted]">Margen 20-24%</span>
 </div>
 <div className="flex items-center gap-1.5">
 <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
 <span className="text-xs text-[--color-text-muted]">Margen &lt;20%</span>
 </div>
 </div>
 </div>
 </div>
 );
}