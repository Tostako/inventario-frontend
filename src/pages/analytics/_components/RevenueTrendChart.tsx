import { useState } from 'react';
import {
 ComposedChart, Area, Line,
 XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { monthlyRevenue } from './mockData';
import { formatCurrency } from '@/lib/utils';

type Period = '6m' | '12m';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
 if (!active || !payload?.length) return null;
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-md] shadow-lg p-3 space-y-1">
 <p className="text-sm font-medium text-[--color-text-primary]">{label}</p>
 {payload.map((entry, i) => (
 <p key={i} className="text-sm" style={{ color: entry.name === 'revenue' ? '#10B981' : '#3B82F6' }}>
 {entry.name === 'revenue' ? 'Ingresos' : 'Pedidos'}: {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value}
 </p>
 ))}
 </div>
 );
}

export function RevenueTrendChart() {
 const [period, setPeriod] = useState<Period>('12m');
 const data = period === '12m' ? monthlyRevenue : monthlyRevenue.slice(6);

 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
 <div className="px-5 py-4 flex items-center justify-between">
 <div>
 <h3 className="text-lg font-semibold text-[--color-text-primary]">Tendencia de ingresos</h3>
 <p className="text-sm text-[--color-text-muted]">Evolución mensual de ventas y pedidos</p>
 </div>
 <div className="flex items-center gap-1 bg-[--color-bg-base] rounded-full p-0.5">
 <button onClick={() => setPeriod('6m')} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${period === '6m' ? 'bg-[--color-accent] text-[--color-bg-base]' : 'text-[--color-text-muted] hover:text-[--color-text-primary]'}`}>
 6 meses
 </button>
 <button onClick={() => setPeriod('12m')} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${period === '12m' ? 'bg-[--color-accent] text-[--color-bg-base]' : 'text-[--color-text-muted] hover:text-[--color-text-primary]'}`}>
 12 meses
 </button>
 </div>
 </div>
 <div className="p-5">
 <div className="h-[320px]">
 <ResponsiveContainer width="100%" height="100%">
 <ComposedChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
 <defs>
 <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
 <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={8} />
 <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}M`} dx={-5} />
 <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={5} />
 <Tooltip content={<CustomTooltip />} />
 <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} formatter={(value: string) => <span className="text-xs text-[--color-text-muted]">{value === 'revenue' ? 'Ingresos' : 'Pedidos'}</span>} />
 <Area yAxisId="left" type="monotone" dataKey="revenue" name="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} />
 <Line yAxisId="right" type="monotone" dataKey="orders" name="orders" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }} />
 </ComposedChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>
 );
}