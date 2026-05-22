import { Badge } from '@/components/ui';
import type { Product, ProductStatus } from '@/types/product.types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onClick: (product: Product) => void;
}

function getStockStatus(stock: number, stock_min: number): { label: string; variant: 'success' | 'warning' | 'danger' } {
  if (stock === 0) return { label: 'Sin stock', variant: 'danger' };
  if (stock <= stock_min) return { label: 'Stock bajo', variant: 'warning' };
  return { label: 'En stock', variant: 'success' };
}

function getProductStatus(p: Product): ProductStatus {
  if (!p.is_active) return 'inactive';
  if (p.stock <= p.stock_min) return 'low_stock';
  return 'active';
}

function getStatusBadge(status: ProductStatus) {
  switch (status) {
    case 'active':
      return { label: 'Activo', variant: 'success' as const };
    case 'inactive':
      return { label: 'Inactivo', variant: 'danger' as const };
    case 'low_stock':
      return { label: 'Stock bajo', variant: 'warning' as const };
    default:
      return { label: status, variant: 'neutral' as const };
  }
}

export function ProductCard({ product, onEdit, onDelete, onClick }: ProductCardProps) {
  const stockStatus = getStockStatus(product.stock, product.stock_min);
  const status = getProductStatus(product);
  const statusBadge = getStatusBadge(status);
  const margin = product.cost > 0 ? (((product.price - product.cost) / product.cost) * 100).toFixed(1) : '0';

  return (
    <div
      className="bg-[--color-bg-surface] rounded-[--radius-lg] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onClick(product)}
    >
      <div className="relative">
        <div className="h-36 bg-[--color-bg-base] rounded-t-[--radius-lg] flex items-center justify-center">
          <div className="w-16 h-16 rounded-[--radius-md] bg-[--color-bg-surface] flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-2xl font-bold text-[--color-accent]">
              {product.name.charAt(0)}
            </span>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1.5">
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[--color-text-primary] text-sm leading-tight line-clamp-1">
              {product.name}
            </h3>
          </div>
          <p className="text-xs text-[--color-text-muted] mt-0.5">
            {product.sku} &middot; {product.category}
          </p>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-lg font-bold text-[--color-text-primary]">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
          </span>
          <span className="text-xs text-[--color-text-muted]">Margen: {margin}%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
          <span className="text-[--color-text-muted]">{product.stock} {product.unit.toLowerCase()}s</span>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
            className="flex-1 px-3 py-1.5 text-xs font-medium rounded-[--radius-md] text-[--color-text-primary] hover:bg-[--color-bg-hover] transition-colors"
          >
            Editar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(product); }}
            className="px-3 py-1.5 text-xs font-medium rounded-[--radius-md] text-[--color-red] hover:bg-[--color-error-muted] transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
