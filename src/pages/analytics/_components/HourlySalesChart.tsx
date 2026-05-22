import {
 BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { hourlySales } from './mockData';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
 if (!active || !payload?.length) return null;
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-md] shadow-lg p-3">
 <p className="text-sm font-medium text-[--color-text-primary]">{label}</p>
 <p className="text-sm text-[--color-accent]">{payload[0].value} ventas</p>
 </div>
 );
}

export function HourlySalesChart() {
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
 <div className="px-5 py-4">
 <h3 className="text-lg font-semibold text-[--color-text-primary]">Ventas por hora</h3>
 <p className="text-sm text-[--color-text-muted]">Distribución de ventas en el día</p>
 </div>
 <div className="p-5">
 <div className="h-[240px]">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={hourlySales} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
 <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} interval={1} />
 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
 <Tooltip content={<CustomTooltip />} />
 <Bar dataKey="sales" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>
 );
}