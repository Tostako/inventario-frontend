import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, LayoutGrid, List, Filter, ArrowUpDown, ArrowDownUp } from 'lucide-react';
import { Button, Badge, Spinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductCard } from './_components/ProductCard';
import { ProductFormModal } from './_components/ProductFormModal';
import { DeleteConfirmModal } from './_components/DeleteConfirmModal';
import type { Product, ProductFormData, ProductStatus } from '@/types/product.types';
import { units } from './_components/mockData';

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'price' | 'stock' | 'created_at';
type SortOrder = 'asc' | 'desc';

const statusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'low_stock', label: 'Stock bajo' },
  { value: 'inactive', label: 'Inactivos' },
];

function getProductStatus(p: Product): ProductStatus {
  if (!p.is_active) return 'inactive';
  if (p.stock <= p.stock_min) return 'low_stock';
  return 'active';
}

function getStatusBadge(status: ProductStatus) {
  switch (status) {
    case 'active': return { label: 'Activo', variant: 'success' as const };
    case 'inactive': return { label: 'Inactivo', variant: 'danger' as const };
    case 'low_stock': return { label: 'Stock bajo', variant: 'warning' as const };
    default: return { label: status, variant: 'neutral' as const };
  }
}

export function ProductsPage() {
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const { categories, fetchCategories } = useCategories();

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const cat of categories) {
      map[cat.id] = cat.name;
    }
    return map;
  }, [categories]);

  const productsWithCategory = useMemo(() => {
    return products.map((p) => ({
      ...p,
      category: categoryMap[p.category_id] || 'Sin categoría',
    }));
  }, [products, categoryMap]);

  const filteredProducts = useMemo(() => {
    let result = [...productsWithCategory];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((p) => getProductStatus(p) === statusFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'price': cmp = a.price - b.price; break;
        case 'stock': cmp = a.stock - b.stock; break;
        case 'created_at': cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [productsWithCategory, search, categoryFilter, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreate = async (data: ProductFormData) => {
    setCreateError(null);
    try {
      await createProduct(data);
      setShowCreateModal(false);
      setCreateError(null);
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || err?.message || 'Error al crear el producto');
    }
  };

  const handleEdit = async (data: ProductFormData) => {
    if (!editingProduct) return;
    setEditError(null);
    try {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
      setEditError(null);
    } catch (err: any) {
      setEditError(err?.response?.data?.message || err?.message || 'Error al actualizar el producto');
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    await deleteProduct(deletingProduct.id);
    setDeletingProduct(null);
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortOrder === 'asc' ? <ArrowUpDown className="h-3 w-3" /> : <ArrowDownUp className="h-3 w-3" />
    ) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[--color-text-primary]">Productos</h1>
          <p className="text-[--color-text-muted]">{filteredProducts.length} productos en tu inventario</p>
        </div>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
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
                placeholder="Buscar por nombre, SKU o categoría..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-[--radius-md] bg-[--color-bg-surface] text-[--color-text-primary] placeholder:text-[--color-text-subtle] focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 text-sm rounded-[--radius-md] bg-[--color-bg-surface] text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20 min-w-[160px]"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 py-2.5 text-sm rounded-[--radius-md] transition-colors ${showFilters ? 'bg-[--color-accent] text-[--color-bg-base] ' : 'text-[--color-text-muted] hover:bg-[--color-bg-hover]'}`}
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>

            <div className="flex rounded-[--radius-md] overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 transition-colors ${viewMode === 'table' ? 'bg-[--color-accent] text-[--color-bg-base]' : 'text-[--color-text-muted] hover:bg-[--color-bg-hover]'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[--color-accent] text-[--color-bg-base]' : 'text-[--color-text-muted] hover:bg-[--color-bg-hover]'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 pt-3">
              <p className="text-xs font-medium text-[--color-text-muted] mb-2 uppercase tracking-wider">Estado</p>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => { setStatusFilter(filter.value); setCurrentPage(1); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      statusFilter === filter.value
                        ? 'bg-[--color-accent] text-[--color-bg-base]'
                        : 'bg-[--color-bg-base] text-[--color-text-muted] hover:text-[--color-text-primary]'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="px-4 pb-4">
            <div className="bg-red-50 text-[--color-red] rounded-[--radius-md] p-3 text-sm">{error}</div>
          </div>
        )}

        {isLoading && products.length === 0 ? (
          <div className="py-16 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[--color-bg-base]">
                <tr>
                  <th className="px-5 py-3 text-left">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 text-xs font-medium text-[--color-text-muted] uppercase tracking-wider hover:text-[--color-text-primary]">
                      Producto <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">SKU</th>
                  <th className="px-5 py-3 text-left">Categoría</th>
                  <th className="px-5 py-3 text-left">
                    <button onClick={() => handleSort('price')} className="flex items-center gap-1 text-xs font-medium text-[--color-text-muted] uppercase tracking-wider hover:text-[--color-text-primary]">
                      Precio <SortIcon field="price" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Costo</th>
                  <th className="px-5 py-3 text-left">
                    <button onClick={() => handleSort('stock')} className="flex items-center gap-1 text-xs font-medium text-[--color-text-muted] uppercase tracking-wider hover:text-[--color-text-primary]">
                      Stock <SortIcon field="stock" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-[--color-text-muted] uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => {
                  const status = getProductStatus(product);
                  const statusBadge = getStatusBadge(status);
                  const margin = product.cost > 0 ? (((product.price - product.cost) / product.cost) * 100).toFixed(0) : '0';
                  return (
                    <tr key={product.id} className="hover:bg-[--color-bg-hover] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[--radius-md] bg-[--color-bg-base] flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-[--color-accent]">{product.name.charAt(0)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[--color-text-primary] truncate">{product.name}</p>
                            <p className="text-xs text-[--color-text-muted]">Margen: {margin}%</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-[--color-text-muted] font-mono">{product.sku}</td>
                      <td className="px-5 py-3 text-sm text-[--color-text-primary]">{product.category}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-[--color-text-primary]">{formatCurrency(product.price)}</td>
                      <td className="px-5 py-3 text-sm text-[--color-text-muted]">{formatCurrency(product.cost)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${product.stock === 0 ? 'text-[--color-red]' : product.stock <= product.stock_min ? 'text-[--color-yellow]' : 'text-[--color-text-primary]'}`}>
                            {product.stock}
                          </span>
                          <span className="text-xs text-[--color-text-subtle]">{product.unit.toLowerCase()}s</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="px-2.5 py-1 text-xs font-medium rounded-[--radius-md] text-[--color-accent] hover:bg-[--color-success-muted] transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="px-2.5 py-1 text-xs font-medium rounded-[--radius-md] text-[--color-red] hover:bg-[--color-error-muted] transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={setEditingProduct}
                onDelete={setDeletingProduct}
                onClick={(p) => console.log('Navigate to product detail', p.id)}
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[--color-bg-base] flex items-center justify-center">
              <Search className="h-6 w-6 text-[--color-text-muted]" />
            </div>
            <p className="text-[--color-text-primary] font-medium">No se encontraron productos</p>
            <p className="text-sm text-[--color-text-muted] mt-1">Intenta con otros filtros o agrega un nuevo producto</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 flex items-center justify-between">
            <p className="text-sm text-[--color-text-muted]">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-[--radius-md] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[--color-bg-hover] transition-colors"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm rounded-[--radius-md] transition-colors ${
                    currentPage === page
                      ? 'bg-[--color-accent] text-[--color-bg-base]'
                      : ' hover:bg-[--color-bg-hover]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-[--radius-md] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[--color-bg-hover] transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductFormModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setCreateError(null); }}
        onSubmit={handleCreate}
        serverError={createError}
        categories={categories}
        units={units}
      />

      {editingProduct && (
        <ProductFormModal
          isOpen={true}
          onClose={() => { setEditingProduct(null); setEditError(null); }}
          initialData={{
            name: editingProduct.name,
            description: editingProduct.description || '',
            sku: editingProduct.sku,
            price: editingProduct.price,
            cost: editingProduct.cost,
            stock: editingProduct.stock,
            stock_min: editingProduct.stock_min,
            unit: editingProduct.unit,
            category_id: editingProduct.category_id,
            is_active: editingProduct.is_active,
          }}
          imageUrl={editingProduct.image_url}
          onSubmit={handleEdit}
          serverError={editError}
          categories={categories}
          units={units}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmModal
          isOpen={true}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDelete}
          productName={deletingProduct.name}
          isDeleting={isLoading}
        />
      )}
    </div>
  );
}
