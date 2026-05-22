import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import { Badge, Button, Spinner } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useCustomers } from '@/hooks/useCustomers';
import { useOrders } from '@/hooks/useOrders';
import type { Customer } from '@/types/customer.types';
import type { Order } from '@/types/order.types';

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCustomer, isLoading: customerLoading } = useCustomers();
  const { orders, fetchOrders } = useOrders();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setError(null);
    getCustomer(id)
      .then((data) => {
        if (data) setCustomer(data);
      })
      .catch((err) => setError(err.message || 'Error al cargar cliente'));
  }, [id, getCustomer]);

  useEffect(() => {
    if (!id) return;
    fetchOrders({ customer_id: id });
  }, [id, fetchOrders]);

  const customerOrders = orders.filter((o: Order) => o.customer_id === id);

  if (customerLoading && !customer) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-[--color-text-primary] font-medium">Cliente no encontrado</p>
        {error && <p className="text-sm text-[--color-red] mt-1">{error}</p>}
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/customers')}>
          Volver a clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/customers')} className="p-2 rounded-[--radius-md] text-[--color-text-muted] hover:bg-[--color-bg-hover] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[--color-accent] flex items-center justify-center text-[--color-bg-base] text-xl font-bold">
              {customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[--color-text-primary]">{customer.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={customer.is_active ? 'success' : 'danger'}>
                  {customer.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
                <span className="text-sm text-[--color-text-muted]">Cliente desde {formatDate(customer.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="secondary">
          Editar cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
            <div className="px-5 py-4">
              <h2 className="text-lg font-semibold text-[--color-text-primary]">Información</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[--color-text-muted]" />
                <div>
                  <p className="text-xs text-[--color-text-muted]">Email</p>
                  <p className="text-sm text-[--color-text-primary]">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[--color-text-muted]" />
                <div>
                  <p className="text-xs text-[--color-text-muted]">Teléfono</p>
                  <p className="text-sm text-[--color-text-primary]">{customer.phone || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[--color-text-muted] mt-0.5" />
                <div>
                  <p className="text-xs text-[--color-text-muted]">Dirección</p>
                  <p className="text-sm text-[--color-text-primary]">{customer.address || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-[--radius-md]">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[--color-text-primary]">{(customer.total_orders ?? 0)}</p>
                  <p className="text-xs text-[--color-text-muted]">Pedidos</p>
                </div>
              </div>
            </div>
            <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-[--radius-md]">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[--color-text-primary]">{formatCurrency(customer.total_spent || 0)}</p>
                  <p className="text-xs text-[--color-text-muted]">Total gastado</p>
                </div>
              </div>
            </div>
            <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm p-5 col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-[--radius-md]">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[--color-text-primary]">
                    {formatCurrency(((customer.total_orders ?? 0) > 0) ? ((customer.total_spent ?? 0) / (customer.total_orders ?? 1)) : 0)}
                  </p>
                  <p className="text-xs text-[--color-text-muted]">Ticket promedio</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
            <div className="px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[--color-text-primary]">Historial de pedidos</h2>
              <span className="text-sm text-[--color-text-muted]">{customerOrders.length} pedidos</span>
            </div>
            {customerOrders.length > 0 ? (
              <div>
                {customerOrders.map((order) => {
                  const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
                    pending: { label: 'Pendiente', variant: 'warning' },
                    confirmed: { label: 'Confirmado', variant: 'info' },
                    shipped: { label: 'Enviado', variant: 'info' },
                    delivered: { label: 'Entregado', variant: 'success' },
                    cancelled: { label: 'Cancelado', variant: 'danger' },
                  };
                  const s = statusConfig[order.status];
                  return (
                    <div key={order.id} className="flex items-center justify-between px-5 py-3 hover:bg-[--color-bg-hover] transition-colors cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                      <div>
                        <p className="text-sm font-medium text-[--color-accent]">{order.order_number || order.id.slice(0, 8)}</p>
                        <p className="text-xs text-[--color-text-muted]">{formatDate(order.created_at)} &middot; {order.items?.length || 0} items</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={s.variant}>{s.label}</Badge>
                        <span className="text-sm font-semibold text-[--color-text-primary]">{formatCurrency(order.total || 0)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <ShoppingBag className="h-8 w-8 mx-auto text-[--color-text-muted] mb-3" />
                <p className="text-[--color-text-primary]">Sin pedidos</p>
                <p className="text-sm text-[--color-text-muted] mt-1">Este cliente aún no ha realizado pedidos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
