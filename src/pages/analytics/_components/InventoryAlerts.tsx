import { AlertTriangle } from 'lucide-react';

interface AlertItem {
 name: string;
 stock: number;
 minStock: number;
 category: string;
}

interface InventoryAlertsProps {
 alerts: AlertItem[];
}

export function InventoryAlerts({ alerts }: InventoryAlertsProps) {
 return (
 <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
 <div className="px-5 py-4 flex items-center justify-between">
 <div>
 <h3 className="text-lg font-semibold text-[--color-text-primary]">Alertas de inventario</h3>
 <p className="text-sm text-[--color-text-muted]">Productos con stock bajo o agotado</p>
 </div>
 <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
 <AlertTriangle className="h-3.5 w-3.5" />
 {alerts.length} alertas
 </div>
 </div>
 <div className="">
 {alerts.map((alert) => (
 <div key={alert.name} className="flex items-center justify-between px-5 py-3 hover:bg-[--color-bg-hover] transition-colors">
 <div className="flex items-center gap-3">
 <div className={`w-9 h-9 rounded-[--radius-md] flex items-center justify-center ${alert.stock === 0 ? 'bg-red-100' : 'bg-yellow-100'}`}>
 <AlertTriangle className={`h-4 w-4 ${alert.stock === 0 ? 'text-red-600' : 'text-yellow-600'}`} />
 </div>
 <div>
 <p className="text-sm font-medium text-[--color-text-primary]">{alert.name}</p>
 <p className="text-xs text-[--color-text-muted]">{alert.category}</p>
 </div>
 </div>
 <div className="text-right">
 <p className={`text-sm font-semibold ${alert.stock === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
 {alert.stock === 0 ? 'Agotado' : `${alert.stock} unidades`}
 </p>
 <p className="text-xs text-[--color-text-muted]">Mínimo: {alert.minStock}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}