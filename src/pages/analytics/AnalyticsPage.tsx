import { useEffect, useMemo } from 'react';
import { ShoppingCart, Package, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import { Spinner } from '@/components/ui';

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export function AnalyticsPage() {
  const { orders, isLoading: ordersLoading, fetchOrders } = useOrders();
  const { products, isLoading: productsLoading, fetchProducts } = useProducts();
  const { customers, isLoading: customersLoading, fetchCustomers } = useCustomers();

  useEffect(() => {
    fetchOrders({ limit: 100 });
    fetchProducts();
    fetchCustomers();
  }, [fetchOrders, fetchProducts, fetchCustomers]);

  const isLoading = ordersLoading || productsLoading || customersLoading;

  const lowStock = useMemo(() => products.filter((p) => p.stock <= p.stock_min), [products]);

  const kpis = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return {
      totalOrders: orders.length,
      totalSales,
      totalProducts: products.length,
      totalCustomers: customers.length,
      lowStockCount: lowStock.length,
    };
  }, [orders, products, customers, lowStock.length]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      status,
      label: statusLabels[status] || status,
      count,
      color: statusColors[status] || 'bg-gray-400',
    }));
  }, [orders]);

  const maxStatusCount = Math.max(...statusCounts.map((s) => s.count), 1);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[--color-text-primary]">Analíticas</h1>
          <p className="text-[--color-text-muted]">Métricas y rendimiento de tu negocio</p>
        </div>
        <div className="py-16 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[--color-text-primary]">Analíticas</h1>
        <p className="text-[--color-text-muted]">Métricas y rendimiento de tu negocio</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[--color-bg-surface] rounded-[--radius-lg] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[--color-text-muted]">Ventas totales</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{formatCurrency(kpis.totalSales)}</p>
            </div>
            <div className="p-2.5 rounded-[--radius-md] bg-green-50">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-[--color-bg-surface] rounded-[--radius-lg] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[--color-text-muted]">Pedidos</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{kpis.totalOrders}</p>
            </div>
            <div className="p-2.5 rounded-[--radius-md] bg-blue-50">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-[--color-bg-surface] rounded-[--radius-lg] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[--color-text-muted]">Productos</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{kpis.totalProducts}</p>
            </div>
            <div className="p-2.5 rounded-[--radius-md] bg-purple-50">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-[--color-bg-surface] rounded-[--radius-lg] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[--color-text-muted]">Clientes</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{kpis.totalCustomers}</p>
            </div>
            <div className="p-2.5 rounded-[--radius-md] bg-orange-50">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-[--color-bg-surface] rounded-[--radius-lg] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[--color-text-muted]">Stock bajo</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{kpis.lowStockCount}</p>
            </div>
            <div className="p-2.5 rounded-[--radius-md] bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm p-5">
          <h3 className="text-lg font-semibold text-[--color-text-primary] mb-4">Estado de pedidos</h3>
          {statusCounts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[--color-text-muted]">No hay pedidos registrados aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {statusCounts.map((s) => (
                <div key={s.status} className="flex items-center gap-3">
                  <span className="text-sm text-[--color-text-muted] w-24">{s.label}</span>
                  <div className="flex-1 h-2.5 bg-[--color-bg-base] rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(s.count / maxStatusCount) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-[--color-text-primary] w-8 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory Alerts */}
        <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[--color-text-primary]">Alertas de inventario</h3>
              <p className="text-sm text-[--color-text-muted]">Productos con stock bajo o agotado</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              <AlertTriangle className="h-3.5 w-3.5" />
              {lowStock.length} alertas
            </div>
          </div>
          <div>
            {lowStock.length === 0 ? (
              <div className="py-8 text-center text-sm text-[--color-text-muted]">No hay alertas de inventario</div>
            ) : (
              lowStock.slice(0, 8).map((product) => (
                <div key={product.id} className="flex items-center justify-between px-5 py-3 hover:bg-[--color-bg-hover] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-[--radius-md] flex items-center justify-center ${product.stock === 0 ? 'bg-red-100' : 'bg-yellow-100'}`}>
                      <AlertTriangle className={`h-4 w-4 ${product.stock === 0 ? 'text-red-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[--color-text-primary]">{product.name}</p>
                      <p className="text-xs text-[--color-text-muted]">{product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {product.stock === 0 ? 'Agotado' : `${product.stock} unidades`}
                    </p>
                    <p className="text-xs text-[--color-text-muted]">Mínimo: {product.stock_min}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
