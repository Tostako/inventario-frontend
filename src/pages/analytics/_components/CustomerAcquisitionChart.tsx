import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { newCustomersByMonth } from './mockData';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
 if (!active || !payload?.length) return null;
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-md] shadow-lg p-3">
 <p className="text-sm font-medium text-[--color-text-primary]">{label}</p>
 <p className="text-sm text-[#EC4899]">{payload[0].value} clientes nuevos</p>
 </div>
 );
}

export function CustomerAcquisitionChart() {
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
 <div className="px-5 py-4">
 <h3 className="text-lg font-semibold text-[--color-text-primary]">Nuevos clientes</h3>
 <p className="text-sm text-[--color-text-muted]">Adquisición mensual de clientes</p>
 </div>
 <div className="p-5">
 <div className="h-[220px]">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={newCustomersByMonth} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={8} />
 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
 <Tooltip content={<CustomTooltip />} />
 <Line type="monotone" dataKey="newCustomers" stroke="#EC4899" strokeWidth={2.5} dot={{ fill: '#EC4899', stroke: '#fff', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#EC4899', stroke: '#fff', strokeWidth: 2 }} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>
 );
}