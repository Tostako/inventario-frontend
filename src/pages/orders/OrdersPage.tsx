import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ArrowDownUp, Download, Eye, ChevronDown } from 'lucide-react';
import { Badge, Button, Spinner } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useOrders } from '@/hooks/useOrders';
import type { OrderStatus } from '@/types/order.types';

const statusConfig: Record<OrderStatus, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
  pending: { label: 'Pendiente', variant: 'warning' },
  confirmed: { label: 'Confirmado', variant: 'info' },
  shipped: { label: 'Enviado', variant: 'info' },
  delivered: { label: 'Entregado', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
};

const orderStatuses: { value: OrderStatus; label: string; variant: 'success' | 'warning' | 'info' | 'danger' }[] = [
  { value: 'pending', label: 'Pendiente', variant: 'warning' },
  { value: 'confirmed', label: 'Confirmado', variant: 'info' },
  { value: 'shipped', label: 'Enviado', variant: 'info' },
  { value: 'delivered', label: 'Entregado', variant: 'success' },
  { value: 'cancelled', label: 'Cancelado', variant: 'danger' },
];

// Transiciones válidas según máquina de estados del backend
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

type SortField = 'order_number' | 'total' | 'created_at';

export function OrdersPage() {
  const navigate = useNavigate();
  const { orders, isLoading, error, fetchOrders, updateOrderStatus } = useOrders();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusDropdownOrder, setStatusDropdownOrder] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => setStatusDropdownOrder(null);
    if (statusDropdownOrder) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [statusDropdownOrder]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          (o.order_number || '').toLowerCase().includes(q) ||
          (o.customer_name || '').toLowerCase().includes(q) ||
          (o.customer_email || '').toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'order_number':
          cmp = (a.order_number || '').localeCompare(b.order_number || '');
          break;
        case 'total':
          cmp = (a.total || 0) - (b.total || 0);
          break;
        case 'created_at':
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [orders, search, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orderStatuses.forEach((s) => {
      counts[s.value] = orders.filter((o) => o.status === s.value).length;
    });
    return counts;
  }, [orders]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortOrder === 'asc' ? <ArrowUpDown className="h-3 w-3" /> : <ArrowDownUp className="h-3 w-3" />
    ) : null;

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      setStatusDropdownOrder(null);
      await fetchOrders();
    } catch {
      // Error se maneja en el hook
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[--color-text-primary]">Pedidos</h1>
          <p className="text-[--color-text-muted]">{filteredOrders.length} pedidos encontrados</p>
        </div>
        <Button>
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
          className={`flex items-center justify-between p-3 rounded-[--radius-lg] transition-colors ${
            statusFilter === 'all'
              ? 'bg-[--color-accent-muted] text-[--color-accent]'
              : 'bg-[--color-bg-surface] text-[--color-text-muted] hover:bg-[--color-bg-hover]'
          }`}
        >
          <span className="text-sm font-medium">Todos</span>
          <Badge variant="neutral">{statusCounts['all'] || 0}</Badge>
        </button>
        {orderStatuses.map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatusFilter(statusFilter === s.value ? 'all' : s.value); setCurrentPage(1); }}
            className={`flex items-center justify-between p-3 rounded-[--radius-lg] transition-colors ${
              statusFilter === s.value
                ? 'bg-[--color-accent-muted] text-[--color-accent]'
                : 'bg-[--color-bg-surface] text-[--color-text-muted] hover:bg-[--color-bg-hover]'
            }`}
          >
            <span className="text-sm font-medium">{s.label}</span>
            <Badge variant={s.variant}>{statusCounts[s.value] || 0}</Badge>
          </button>
        ))}
      </div>

      <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-text-muted]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar por número o cliente..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-[--radius-md] bg-[--color-bg-surface] text-[--color-text-primary] placeholder:text-[--color-text-subtle] focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 py-2.5 text-sm rounded-[--radius-md] transition-colors ${
                showFilters ? 'bg-[--color-accent] text-[--color-bg-base] ' : 'text-[--color-text-muted] hover:bg-[--color-bg-hover]'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 pb-4">
            <div className="bg-red-50 text-[--color-red] rounded-[--radius-md] p-3 text-sm">{error}</div>
          </div>
        )}

        {isLoading && orders.length === 0 ? (
          <div className="py-16 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[--color-bg-base]">
                <tr>
                  <th className="px-5 py-3 text-left">
                    <button onClick={() => handleSort('order_number')} className="flex items-center gap-1 text-xs font-medium text-[--color-text-muted] uppercase tracking-wider hover:text-[--color-text-primary]">
                      Pedido <SortIcon field="order_number" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Cliente</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Items</th>
                  <th className="px-5 py-3 text-left">
                    <button onClick={() => handleSort('total')} className="flex items-center gap-1 text-xs font-medium text-[--color-text-muted] uppercase tracking-wider hover:text-[--color-text-primary]">
                      Total <SortIcon field="total" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3 text-left">
                    <button onClick={() => handleSort('created_at')} className="flex items-center gap-1 text-xs font-medium text-[--color-text-muted] uppercase tracking-wider hover:text-[--color-text-primary]">
                      Fecha <SortIcon field="created_at" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const status = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-[--color-bg-hover] transition-colors cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-[--color-accent]">{order.order_number || order.id.slice(0, 8)}</span>
                        <p className="text-xs text-[--color-text-subtle]">{order.items?.length || 0} items</p>
                      </td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-sm font-medium text-[--color-text-primary]">{order.customer_name || '—'}</p>
                          <p className="text-xs text-[--color-text-muted]">{order.customer_email || ''}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-[--color-text-primary]">{order.items?.length || 0}</td>
                      <td className="px-5 py-3">
                        <p className="text-sm font-semibold text-[--color-text-primary]">{formatCurrency(order.total || 0)}</p>
                        {(order.discount || 0) > 0 && (
                          <p className="text-xs text-[--color-success]">-{formatCurrency(order.discount!)} desc.</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const available = validTransitions[order.status] || [];
                              if (available.length > 0) {
                                setStatusDropdownOrder(statusDropdownOrder === order.id ? null : order.id);
                              }
                            }}
                            disabled={updatingOrderId === order.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                              (validTransitions[order.status] || []).length > 0
                                ? 'cursor-pointer hover:shadow-sm'
                                : 'cursor-default opacity-80'
                            } ${
                              status.variant === 'success' ? 'bg-green-100 text-green-700 border-green-200' :
                              status.variant === 'warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                              status.variant === 'danger' ? 'bg-red-100 text-red-700 border-red-200' :
                              'bg-blue-100 text-blue-700 border-blue-200'
                            }`}
                          >
                            {updatingOrderId === order.id ? (
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                {status.label}
                                {(validTransitions[order.status] || []).length > 0 && <ChevronDown className="h-3 w-3" />}
                              </>
                            )}
                          </button>
                          {statusDropdownOrder === order.id && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                              <p className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">Cambiar a</p>
                              {(validTransitions[order.status] || []).map((transition) => {
                                const targetStatus = statusConfig[transition];
                                return (
                                  <button
                                    key={transition}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(order.id, transition);
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50 text-left ${
                                      targetStatus.variant === 'success' ? 'text-green-700' :
                                      targetStatus.variant === 'danger' ? 'text-red-700' :
                                      targetStatus.variant === 'warning' ? 'text-yellow-700' :
                                      'text-blue-700'
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                      targetStatus.variant === 'success' ? 'bg-green-500' :
                                      targetStatus.variant === 'danger' ? 'bg-red-500' :
                                      targetStatus.variant === 'warning' ? 'bg-yellow-500' :
                                      'bg-blue-500'
                                    }`} />
                                    {targetStatus.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-[--color-text-muted]">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-[--radius-md] text-[--color-accent] hover:bg-[--color-success-muted] transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredOrders.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[--color-bg-base] flex items-center justify-center">
              <Search className="h-6 w-6 text-[--color-text-muted]" />
            </div>
            <p className="text-[--color-text-primary] font-medium">No se encontraron pedidos</p>
            <p className="text-sm text-[--color-text-muted] mt-1">Intenta con otros filtros de búsqueda</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 flex items-center justify-between">
            <p className="text-sm text-[--color-text-muted]">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-[--radius-md] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[--color-bg-hover]"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm rounded-[--radius-md] ${currentPage === page ? 'bg-[--color-accent] text-[--color-bg-base]' : ' hover:bg-[--color-bg-hover]'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-[--radius-md] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[--color-bg-hover]"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
