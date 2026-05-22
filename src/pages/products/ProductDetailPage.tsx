import { useEffect, useState } from 'react';
import { ArrowLeft, Edit, Package, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Badge, Spinner } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import type { Product, ProductStatus } from '@/types/product.types';

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

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, isLoading } = useProducts();
  const { categories, fetchCategories } = useCategories();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!id) return;
    setError(null);
    getProduct(id)
      .then((data) => {
        if (data) setProduct(data);
      })
      .catch((err) => setError(err.message || 'Error al cargar el producto'));
  }, [id, getProduct]);

  const categoryName = product ? categories.find((c) => c.id === product.category_id)?.name || 'Sin categoría' : '';

  if (isLoading && !product) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-[--color-bg-base] flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-[--color-text-muted]" />
        </div>
        <p className="text-[--color-text-primary] font-medium">Producto no encontrado</p>
        {error && <p className="text-sm text-[--color-red] mt-1">{error}</p>}
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/products')}>
          Volver a productos
        </Button>
      </div>
    );
  }

  const status = getProductStatus(product);
  const statusBadge = getStatusBadge(status);
  const margin = product.cost > 0 ? (((product.price - product.cost) / product.cost) * 100).toFixed(1) : '0';
  const profit = product.price - product.cost;
  const stockValue = product.stock * product.cost;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 rounded-[--radius-md] text-[--color-text-muted] hover:bg-[--color-bg-hover] hover:text-[--color-text-primary] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[--color-text-primary]">{product.name}</h1>
            <p className="text-[--color-text-muted]">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          <Button>
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
            <div className="px-5 py-4">
              <h2 className="text-lg font-semibold text-[--color-text-primary]">Información del producto</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-sm text-[--color-text-muted]">Nombre</p>
                  <p className="font-medium text-[--color-text-primary]">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[--color-text-muted]">SKU</p>
                  <p className="font-medium text-[--color-text-primary] font-mono">{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-[--color-text-muted]">Categoría</p>
                  <p className="font-medium text-[--color-text-primary]">{categoryName}</p>
                </div>
                <div>
                  <p className="text-sm text-[--color-text-muted]">Unidad</p>
                  <p className="font-medium text-[--color-text-primary]">{product.unit}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-[--color-text-muted]">Descripción</p>
                  <p className="font-medium text-[--color-text-primary]">{product.description || 'Sin descripción'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
            <div className="px-5 py-4">
              <h2 className="text-lg font-semibold text-[--color-text-primary]">Historial de actividad</h2>
            </div>
            <div>
              {[
                { action: 'Producto actualizado', detail: 'Se modificó el precio', date: '15 Ene 2024, 15:30' },
                { action: 'Pedido recibido', detail: 'ORD-2345 - 5 unidades', date: '15 Ene 2024, 10:00' },
                { action: 'Stock ajustado', detail: 'Se ajustó stock de 50 a 45 unidades', date: '14 Ene 2024, 09:15' },
                { action: 'Producto creado', detail: 'Se creó el producto en el sistema', date: '10 Ene 2024, 10:00' },
              ].map((entry, i) => (
                <div key={i} className="px-5 py-3 flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[--color-accent] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[--color-text-primary]">{entry.action}</p>
                    <p className="text-sm text-[--color-text-muted]">{entry.detail}</p>
                  </div>
                  <span className="text-xs text-[--color-text-subtle] flex-shrink-0">{entry.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm">
            <div className="px-5 py-4">
              <h2 className="text-lg font-semibold text-[--color-text-primary]">Precio y stock</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-[--color-accent-muted] rounded-[--radius-md] p-4">
                <p className="text-sm text-[--color-text-muted]">Precio de venta</p>
                <p className="text-2xl font-bold text-[--color-accent]">{formatCurrency(product.price)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[--color-text-muted]">Costo</p>
                  <p className="font-semibold text-[--color-text-primary]">{formatCurrency(product.cost)}</p>
                </div>
                <div>
                  <p className="text-sm text-[--color-text-muted]">Ganancia</p>
                  <p className="font-semibold text-[--color-success]">{formatCurrency(profit)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[--color-text-muted]">Margen</p>
                  <p className="font-semibold text-[--color-text-primary]">{margin}%</p>
                </div>
                <div>
                  <p className="text-sm text-[--color-text-muted]">Valor en stock</p>
                  <p className="font-semibold text-[--color-text-primary]">{formatCurrency(stockValue)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-[--radius-lg] shadow-sm p-5 ${product.stock === 0 ? 'bg-red-50' : product.stock <= product.stock_min ? 'bg-yellow-50' : 'bg-[--color-bg-surface]'}`}>
            <div className="flex items-start gap-3">
              {product.stock === 0 ? (
                <AlertTriangle className="h-5 w-5 text-[--color-red] flex-shrink-0 mt-0.5" />
              ) : product.stock <= product.stock_min ? (
                <AlertTriangle className="h-5 w-5 text-[--color-yellow] flex-shrink-0 mt-0.5" />
              ) : (
                <TrendingUp className="h-5 w-5 text-[--color-success] flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium text-[--color-text-primary]">
                  {product.stock === 0 ? 'Sin stock' : product.stock <= product.stock_min ? 'Stock bajo' : 'Stock disponible'}
                </p>
                <p className="text-2xl font-bold text-[--color-text-primary]">{product.stock} <span className="text-sm font-normal text-[--color-text-muted]">{product.unit.toLowerCase()}s</span></p>
                <p className="text-sm text-[--color-text-muted] mt-1">Mínimo requerido: {product.stock_min} {product.unit.toLowerCase()}s</p>
              </div>
            </div>
          </div>

          <div className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-[--color-text-muted]" />
              <p className="text-sm font-medium text-[--color-text-primary]">Información</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[--color-text-muted]">Creado</span>
                <span className="text-[--color-text-primary]">{formatDate(product.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[--color-text-muted]">Actualizado</span>
                <span className="text-[--color-text-primary]">{formatDate(product.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
