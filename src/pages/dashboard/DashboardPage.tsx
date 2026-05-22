import { useEffect, useMemo } from 'react';
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { Button, Spinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import { useNavigate } from 'react-router-dom';

const statusLabels: Record<string, string> = {
  pending: 'Pendientes',
  confirmed: 'Confirmados',
  shipped: 'Enviados',
  delivered: 'Entregados',
  cancelled: 'Cancelados',
};

const statusColors: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  shipped: '#6366F1',
  delivered: '#10B981',
  cancelled: '#EF4444',
};

export function DashboardPage() {
  const navigate = useNavigate();
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

  const totalSales = useMemo(() => orders.reduce((sum, o) => sum + Number(o.total || 0), 0), [orders]);

  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'pending').length, [orders]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      status,
      label: statusLabels[status] || status,
      count,
      color: statusColors[status] || '#9CA3AF',
    }));
  }, [orders]);

  const totalOrders = orders.length;
  const totalProducts = products.length;

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-[28px] font-bold text-[--color-text-primary] tracking-tight">Dashboard</h1>
          <p className="text-[15px] text-[--color-text-muted] mt-1">Resumen general de tu tienda</p>
        </div>
        <div className="py-16 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <h1 className="text-[28px] font-bold text-[--color-text-primary] tracking-tight">Dashboard</h1>
        <p className="text-[15px] text-[--color-text-muted] mt-1">Resumen general de tu tienda</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[--color-bg-surface] rounded-[--radius-xl] p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[--color-text-muted]">Ventas Totales</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{formatCurrency(totalSales)}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs text-[--color-text-subtle]">{totalOrders} pedidos</span>
              </div>
            </div>
            <div className="p-2.5 rounded-[--radius-lg] bg-emerald-100">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-[--color-bg-surface] rounded-[--radius-xl] p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[--color-text-muted]">Pedidos</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{totalOrders}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs text-[--color-text-subtle]">{pendingOrders} pendientes</span>
              </div>
            </div>
            <div className="p-2.5 rounded-[--radius-lg] bg-blue-100">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-[--color-bg-surface] rounded-[--radius-xl] p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[--color-text-muted]">Productos</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{totalProducts}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs text-[--color-text-subtle]">{lowStock.length} con stock bajo</span>
              </div>
            </div>
            <div className="p-2.5 rounded-[--radius-lg] bg-purple-100">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-[--color-bg-surface] rounded-[--radius-xl] p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[--color-text-muted]">Alertas Stock</p>
              <p className="text-2xl font-bold text-[--color-text-primary] mt-1">{lowStock.length}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs text-[--color-text-subtle]">Requieren atención</span>
              </div>
            </div>
            <div className="p-2.5 rounded-[--radius-lg] bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Inventario */}
      {lowStock.length > 0 && (
        <div className="bg-red-50 rounded-[--radius-xl] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-base font-semibold text-red-700">Alertas de Inventario</h2>
            </div>
            <Button variant="secondary" size="sm" className="bg-white text-red-600 hover:bg-red-50 rounded-[--radius-full]" onClick={() => navigate('/products')}>
              Ver Todo
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {lowStock.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-white rounded-[--radius-lg] px-4 py-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate('/products')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${product.stock === 0 ? 'bg-red-500' : 'bg-amber-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-[--color-text-primary]">{product.name}</p>
                    <p className="text-xs text-[--color-text-muted]">{product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    {product.stock === 0 ? 'Agotado' : `${product.stock} uds`}
                  </p>
                  <p className="text-xs text-[--color-text-muted]">Min: {product.stock_min}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado de Pedidos */}
      {statusCounts.length > 0 && (
        <div className="bg-[--color-bg-surface] rounded-[--radius-xl] p-5 shadow-sm">
          <h3 className="text-base font-semibold text-[--color-text-primary] mb-6">Estado de Pedidos</h3>
          <div className="flex items-center gap-10">
            {/* Donut */}
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {statusCounts.map((status, i) => {
                  const total = statusCounts.reduce((s, o) => s + o.count, 0);
                  const prevOffset = statusCounts.slice(0, i).reduce((s, o) => s + o.count, 0);
                  const dashArray = `${(status.count / total) * 100} ${100 - (status.count / total) * 100}`;
                  const dashOffset = -((prevOffset / total) * 100);
                  return (
                    <circle
                      key={status.status}
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      strokeWidth="4"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      stroke={status.color}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-[--color-text-primary]">
                  {totalOrders}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-4">
              {statusCounts.map((status) => (
                <div key={status.status} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-sm text-[--color-text-secondary]">{status.label}</span>
                  <span className="text-sm font-semibold text-[--color-text-primary] ml-auto">{status.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
