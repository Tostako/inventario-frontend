import { formatCurrency } from '@/lib/utils';
import { categoryPerformance } from './mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function CategoryPerformanceTable() {
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
 <div className="px-5 py-4">
 <h3 className="text-lg font-semibold text-[--color-text-primary]">Rendimiento por categoría</h3>
 <p className="text-sm text-[--color-text-muted]">Ventas y crecimiento por categoría</p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-[--color-bg-base]">
 <tr>
 <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Categoría</th>
 <th className="px-5 py-3 text-right text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Ventas</th>
 <th className="px-5 py-3 text-right text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Part. (%)</th>
 <th className="px-5 py-3 text-right text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Crecimiento</th>
 </tr>
 </thead>
 <tbody className="">
 {categoryPerformance.map((cat) => (
 <tr key={cat.name} className="hover:bg-[--color-bg-hover] transition-colors">
 <td className="px-5 py-3">
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
 <span className="text-sm font-medium text-[--color-text-primary]">{cat.name}</span>
 </div>
 </td>
 <td className="px-5 py-3 text-sm font-semibold text-[--color-text-primary] text-right">{formatCurrency(cat.sales)}</td>
 <td className="px-5 py-3 text-right">
 <div className="flex items-center justify-end gap-2">
 <div className="w-20 h-2 bg-[--color-bg-base] rounded-full overflow-hidden">
 <div className="h-full rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
 </div>
 <span className="text-sm text-[--color-text-primary] w-8 text-right">{cat.percentage}%</span>
 </div>
 </td>
 <td className="px-5 py-3 text-right">
 <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${cat.growth>= 0 ? 'text-[--color-success]' : 'text-[--color-error]'}`}>
 {cat.growth>= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
 {cat.growth>= 0 ? '+' : ''}{cat.growth}%
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
}