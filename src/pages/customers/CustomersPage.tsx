import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowUpDown, ArrowDownUp, Mail, Phone, MapPin } from 'lucide-react';
import { Badge, Button, Spinner } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useCustomers } from '@/hooks/useCustomers';
import type { Customer } from '@/types/customer.types';

type SortField = 'name' | 'total_orders' | 'total_spent' | 'created_at';

export function CustomersPage() {
  const navigate = useNavigate();
  const { customers, isLoading, error, fetchCustomers } = useCustomers();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = useMemo(() => {
    let result = [...customers];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone || '').includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((c) => (statusFilter === 'active' ? c.is_active : !c.is_active));
    }
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'total_orders': cmp = (a.total_orders || 0) - (b.total_orders || 0); break;
        case 'total_spent': cmp = (a.total_spent || 0) - (b.total_spent || 0); break;
        case 'created_at': cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [customers, search, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (sortOrder === 'asc' ? <ArrowUpDown className="h-3 w-3" /> : <ArrowDownUp className="h-3 w-3" />) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[--color-text-primary]">Clientes</h1>
          <p className="text-[--color-text-muted]">{filtered.length} clientes registrados</p>
        </div>
        <Button onClick={() => { /* TODO: create customer modal */ }}>
          <Plus className="h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
          className={`p-3 rounded-[--radius-lg] text-center transition-colors ${statusFilter === 'all' ? 'bg-[--color-accent-muted] text-[--color-accent]' : 'bg-[--color-bg-surface] text-[--color-text-muted] hover:bg-[--color-bg-hover]'}`}
        >
          <p className="text-2xl font-bold">{customers.length}</p>
          <p className="text-sm">Total</p>
        </button>
        <button
          onClick={() => { setStatusFilter('active'); setCurrentPage(1); }}
          className={`p-3 rounded-[--radius-lg] text-center transition-colors ${statusFilter === 'active' ? 'bg-green-50 text-green-700' : 'bg-[--color-bg-surface] text-[--color-text-muted] hover:bg-[--color-bg-hover]'}`}
        >
          <p className="text-2xl font-bold text-green-600">{customers.filter((c) => c.is_active).length}</p>
          <p className="text-sm">Activos</p>
        </button>
        <button
          onClick={() => { setStatusFilter('inactive'); setCurrentPage(1); }}
          className={`p-3 rounded-[--radius-lg] text-center transition-colors ${statusFilter === 'inactive' ? 'bg-[--color-error-muted] text-red-700' : 'bg-[--color-bg-surface] text-[--color-text-muted] hover:bg-[--color-bg-hover]'}`}
        >
          <p className="text-2xl font-bold text-red-600">{customers.filter((c) => !c.is_active).length}</p>
          <p className="text-sm">Inactivos</p>
        </button>
      </div>

      <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--color-text-muted]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por nombre, email o teléfono..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-[--radius-md] bg-[--color-bg-surface] text-[--color-text-primary] placeholder:text-[--color-text-subtle] focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20"
            />
          </div>
        </div>

        {error && (
          <div className="px-4 pb-4">
            <div className="bg-red-50 text-[--color-red] rounded-[--radius-md] p-3 text-sm">{error}</div>
          </div>
        )}

        {isLoading && customers.length === 0 ? (
          <div className="py-16 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[--color-bg-base]">
                <tr>
                  <th className="px-5 py-3 text-left">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 text-xs font-medium text-[--color-text-muted] uppercase tracking-wider hover:text-[--color-text-primary]">
                      Cliente <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Contacto</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Dirección</th>
                  <th className="px-5 py-3 text-left">
                    <button onClick={() => handleSort('total_orders')} className="flex items-center gap-1 text-xs font-medium text-[--color-text-muted] uppercase tracking-wider hover:text-[--color-text-primary]">
                      Pedidos <SortIcon field="total_orders" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left">
                    <button onClick={() => handleSort('total_spent')} className="flex items-center gap-1 text-xs font-medium text-[--color-text-muted] uppercase tracking-wider hover:text-[--color-text-primary]">
                      Total gastado <SortIcon field="total_spent" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[--color-bg-hover] transition-colors cursor-pointer" onClick={() => navigate(`/customers/${customer.id}`)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[--color-accent] flex items-center justify-center text-[--color-bg-base] text-sm font-semibold flex-shrink-0">
                          {customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[--color-text-primary] truncate">{customer.name}</p>
                          <p className="text-xs text-[--color-text-muted]">{formatDate(customer.created_at)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-sm text-[--color-text-primary]">
                          <Mail className="h-3 w-3 text-[--color-text-muted]" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[--color-text-muted]">
                          <Phone className="h-3 w-3 text-[--color-text-muted]" />
                          {customer.phone || '—'}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-[--color-text-primary]">
                        <MapPin className="h-3.5 w-3.5 text-[--color-text-muted]" />
                        {customer.address || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-semibold text-[--color-text-primary]">{customer.total_orders || 0}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-semibold text-[--color-text-primary]">{formatCurrency(customer.total_spent || 0)}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Badge variant={customer.is_active ? 'success' : 'danger'}>
                        {customer.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {paginated.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <Search className="h-8 w-8 mx-auto text-[--color-text-muted] mb-3" />
            <p className="text-[--color-text-primary] font-medium">No se encontraron clientes</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 flex items-center justify-between">
            <p className="text-sm text-[--color-text-muted]">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm rounded-[--radius-md] disabled:opacity-40 hover:bg-[--color-bg-hover]">
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 text-sm rounded-[--radius-md] ${currentPage === page ? 'bg-[--color-accent] text-[--color-bg-base]' : ' hover:bg-[--color-bg-hover]'}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 text-sm rounded-[--radius-md] disabled:opacity-40 hover:bg-[--color-bg-hover]">
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
