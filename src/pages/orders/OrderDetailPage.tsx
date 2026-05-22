import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Phone, Mail, Clock, ChevronDown, Check } from 'lucide-react';
import { Badge, Button, Spinner } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useOrders } from '@/hooks/useOrders';
import type { Order, OrderStatus } from '@/types/order.types';

const statusConfig: Record<OrderStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
  pending: { label: 'Pendiente', variant: 'warning' },
  confirmed: { label: 'Confirmado', variant: 'info' },
  shipped: { label: 'Enviado', variant: 'info' },
  delivered: { label: 'Entregado', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
};

const paymentMethods: Record<string, string> = {
  cash: 'Efectivo',
  transfer: 'Transferencia',
  wompi: 'Wompi',
  credit: 'Crédito',
  card: 'Tarjeta',
  pse: 'PSE',
};

const paymentStatusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  paid: { label: 'Pagado', variant: 'success' },
  pending: { label: 'Pendiente', variant: 'warning' },
  refunded: { label: 'Reembolsado', variant: 'danger' },
  approved: { label: 'Aprobado', variant: 'success' },
  rejected: { label: 'Rechazado', variant: 'danger' },
};

// Transiciones válidas según máquina de estados del backend
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateOrderStatus, isLoading } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!id) return;
    setError(null);
    getOrder(id)
      .then((data) => {
        if (data) setOrder(data);
      })
      .catch((err) => setError(err.message || 'Error al cargar el pedido'));
  }, [id, getOrder]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => setShowStatusDropdown(false);
    if (showStatusDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showStatusDropdown]);

  if (isLoading && !order) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Package className="h-12 w-12 text-[--color-text-muted] mb-4" />
        <p className="text-[--color-text-primary] font-medium">Pedido no encontrado</p>
        {error && <p className="text-sm text-[--color-red] mt-1">{error}</p>}
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/orders')}>
          Volver a pedidos
        </Button>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const payStatus = paymentStatusConfig[order.payment_status || 'pending'] || paymentStatusConfig.pending;
  const availableTransitions = validTransitions[order.status] || [];
  const canChangeStatus = availableTransitions.length > 0;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order || !id) return;
    setUpdatingStatus(true);
    setStatusError(null);
    try {
      const updated = await updateOrderStatus(id, { status: newStatus });
      if (updated) {
        setOrder(updated);
      }
      setShowStatusDropdown(false);
    } catch (err: any) {
      setStatusError(err?.response?.data?.message || err?.message || 'Error al cambiar el estado');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/orders')} className="p-2 rounded-[--radius-md] text-[--color-text-muted] hover:bg-[--color-bg-hover] hover:text-[--color-text-primary] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[--color-text-primary]">{order.order_number || order.id.slice(0, 8)}</h1>
            <p className="text-[--color-text-muted]">Creado el {formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                canChangeStatus && setShowStatusDropdown(!showStatusDropdown);
              }}
              disabled={!canChangeStatus || updatingStatus}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${
                canChangeStatus
                  ? 'cursor-pointer hover:shadow-sm active:scale-95'
                  : 'cursor-default opacity-80'
              } ${
                status.variant === 'success' ? 'bg-green-100 text-green-700 border-green-200' :
                status.variant === 'warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                status.variant === 'danger' ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-blue-100 text-blue-700 border-blue-200'
              }`}
            >
              {updatingStatus ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {status.label}
                  {canChangeStatus && <ChevronDown className="h-3.5 w-3.5" />}
                </>
              )}
            </button>
            {showStatusDropdown && canChangeStatus && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-[--radius-lg] shadow-lg border border-gray-100 py-1 z-50">
                <p className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">Cambiar a</p>
                {availableTransitions.map((transition) => {
                  const targetStatus = statusConfig[transition];
                  return (
                    <button
                      key={transition}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(transition);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left ${
                        targetStatus.variant === 'success' ? 'text-green-700' :
                        targetStatus.variant === 'danger' ? 'text-red-700' :
                        targetStatus.variant === 'warning' ? 'text-yellow-700' :
                        'text-blue-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        targetStatus.variant === 'success' ? 'bg-green-500' :
                        targetStatus.variant === 'danger' ? 'bg-red-500' :
                        targetStatus.variant === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      {targetStatus.label}
                      {order.status === transition && <Check className="h-3.5 w-3.5 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <Badge variant={payStatus.variant}>{payStatus.label}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
            <div className="px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[--color-text-primary]">Productos del pedido</h2>
              <span className="text-sm text-[--color-text-muted]">{order.items?.length || 0} items</span>
            </div>
            <div>
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[--radius-md] bg-[--color-bg-base] flex items-center justify-center">
                      <Package className="h-5 w-5 text-[--color-text-muted]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[--color-text-primary]">{item.product_name}</p>
                      <p className="text-xs text-[--color-text-muted]">{item.quantity} x {formatCurrency(item.unit_price)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[--color-text-primary]">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[--color-text-muted]">Subtotal</span>
                <span className="text-[--color-text-primary]">{formatCurrency(order.subtotal || 0)}</span>
              </div>
              {(order.discount || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[--color-success]">Descuento</span>
                  <span className="text-[--color-success]">-{formatCurrency(order.discount!)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2">
                <span className="text-[--color-text-primary]">Total</span>
                <span className="text-[--color-accent]">{formatCurrency(order.total || 0)}</span>
              </div>
            </div>
          </div>

          {statusError && (
            <div className="bg-red-50 border border-red-200 rounded-[--radius-lg] px-4 py-3">
              <p className="text-sm font-medium text-red-700">{statusError}</p>
            </div>
          )}

          {order.notes && (
            <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm p-5">
              <h3 className="text-sm font-semibold text-[--color-text-primary] mb-2">Notas</h3>
              <p className="text-sm text-[--color-text-muted]">{order.notes}</p>
            </div>
          )}

          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
            <div className="px-5 py-4">
              <h2 className="text-lg font-semibold text-[--color-text-primary]">Historial del pedido</h2>
            </div>
            <div className="p-5">
              <div className="space-y-0">
                {[
                  { id: '1', status: order.status, description: 'Estado actual del pedido', timestamp: order.updated_at, user_name: 'Sistema' },
                ].map((entry, i, arr) => {
                  const entryStatus = statusConfig[entry.status];
                  return (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mt-1 ${i === arr.length - 1 ? 'bg-[--color-accent]' : 'bg-[--color-bg-surface]'}`} />
                        {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-[--color-border] my-1" />}
                      </div>
                      <div className="pb-4 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[--color-text-primary]">{entry.description}</p>
                          <Badge variant={entryStatus.variant}>{entryStatus.label}</Badge>
                        </div>
                        <p className="text-xs text-[--color-text-muted] mt-0.5">
                          {formatDate(entry.timestamp)} &middot; {entry.user_name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
            <div className="px-5 py-4">
              <h2 className="text-lg font-semibold text-[--color-text-primary]">Cliente</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[--color-accent] flex items-center justify-center text-[--color-bg-base] font-semibold">
                  {(order.customer_name || '?').charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-[--color-text-primary]">{order.customer_name || '—'}</p>
                  <p className="text-xs text-[--color-text-muted]">ID: {order.customer_id}</p>
                </div>
              </div>
              <div className="space-y-2">
                {order.customer_email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-[--color-text-muted]" />
                    <span className="text-[--color-text-primary]">{order.customer_email}</span>
                  </div>
                )}
                {order.customer_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-[--color-text-muted]" />
                    <span className="text-[--color-text-primary]">{order.customer_phone}</span>
                  </div>
                )}
                {order.shipping_address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[--color-text-muted] mt-0.5" />
                    <span className="text-[--color-text-primary]">{order.shipping_address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
            <div className="px-5 py-4">
              <h2 className="text-lg font-semibold text-[--color-text-primary]">Pago</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[--color-text-muted]">Método</span>
                <span className="font-medium text-[--color-text-primary]">{paymentMethods[order.payment_method || ''] || order.payment_method || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[--color-text-muted]">Estado del pago</span>
                <Badge variant={payStatus.variant}>{payStatus.label}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[--color-text-muted]">Total</span>
                <span className="font-bold text-[--color-accent]">{formatCurrency(order.total || 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-[--color-text-muted]" />
              <p className="text-sm font-medium text-[--color-text-primary]">Fechas</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[--color-text-muted]">Creado</span>
                <span className="text-[--color-text-primary]">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[--color-text-muted]">Actualizado</span>
                <span className="text-[--color-text-primary]">{formatDate(order.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
