import { useState } from 'react';
import { Modal, Button } from '@/components/ui';
import type { Offer, CreateOfferData, OfferDiscountType, OfferScope } from '@/types/offer.types';
import type { Product } from '@/types/product.types';
import type { Category } from '@/types/category.types';

interface OfferFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Offer;
  products: Product[];
  categories: Category[];
  onSubmit: (data: CreateOfferData) => void;
  serverError?: string | null;
}

export function OfferFormModal({ isOpen, onClose, initialData, products, categories, onSubmit, serverError }: OfferFormModalProps) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState<CreateOfferData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    discount_type: initialData?.discount_type || 'percentage',
    discount_value: initialData?.discount_value || 10,
    scope: initialData?.scope || 'storewide',
    code: initialData?.code || '',
    product_id: initialData?.product_id || '',
    category_id: initialData?.category_id || '',
    starts_at: initialData?.starts_at ? initialData.starts_at.slice(0, 16) : new Date().toISOString().slice(0, 16),
    ends_at: initialData?.ends_at ? initialData.ends_at.slice(0, 16) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    is_active: initialData?.is_active ?? true,
    usage_limit: initialData?.usage_limit || undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CreateOfferData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleScopeChange = (scope: OfferScope) => {
    setFormData((prev) => ({
      ...prev,
      scope,
      product_id: scope === 'product' ? prev.product_id || '' : undefined,
      category_id: scope === 'category' ? prev.category_id || '' : undefined,
    }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'El título es requerido';
    if (formData.discount_value <= 0) errs.discount_value = 'El valor debe ser mayor a 0';
    if (formData.discount_type === 'percentage' && formData.discount_value > 100) {
      errs.discount_value = 'El porcentaje no puede ser mayor a 100';
    }
    if (formData.scope === 'product' && !formData.product_id) errs.product_id = 'Selecciona un producto';
    if (formData.scope === 'category' && !formData.category_id) errs.category_id = 'Selecciona una categoría';
    if (!formData.starts_at) errs.starts_at = 'La fecha de inicio es requerida';
    if (!formData.ends_at) errs.ends_at = 'La fecha de fin es requerida';
    if (formData.starts_at && formData.ends_at && new Date(formData.starts_at) >= new Date(formData.ends_at)) {
      errs.ends_at = 'La fecha de fin debe ser posterior a la de inicio';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateOfferData = {
      ...formData,
      starts_at: new Date(formData.starts_at).toISOString(),
      ends_at: new Date(formData.ends_at).toISOString(),
    };

    // Eliminar campos no aplicables según scope
    if (payload.scope !== 'product') delete (payload as any).product_id;
    if (payload.scope !== 'category') delete (payload as any).category_id;

    onSubmit(payload);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Editar oferta' : 'Nueva oferta'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-[--radius-md] px-4 py-3">
            <p className="text-sm font-medium text-red-700">{serverError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-1.5 ${errors.title ? 'text-red-600' : 'text-[--color-text-primary]'}`}>Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ej: Verano 2025"
              className={`w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border focus:outline-none focus:ring-2 ${errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-[--color-accent]/20'}`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe la oferta..."
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Tipo de descuento</label>
            <select
              value={formData.discount_type}
              onChange={(e) => handleChange('discount_type', e.target.value as OfferDiscountType)}
              className="w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20"
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed_amount">Monto fijo ($)</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${errors.discount_value ? 'text-red-600' : 'text-[--color-text-primary]'}`}>
              Valor {formData.discount_type === 'percentage' ? '(%)' : '($)'}
            </label>
            <input
              type="number"
              min={1}
              max={formData.discount_type === 'percentage' ? 100 : undefined}
              value={formData.discount_value}
              onChange={(e) => handleChange('discount_value', Number(e.target.value))}
              className={`w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border focus:outline-none focus:ring-2 ${errors.discount_value ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-[--color-accent]/20'}`}
            />
            {errors.discount_value && <p className="mt-1 text-sm text-red-600">{errors.discount_value}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Alcance</label>
            <select
              value={formData.scope}
              onChange={(e) => handleScopeChange(e.target.value as OfferScope)}
              className="w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20"
            >
              <option value="storewide">Toda la tienda</option>
              <option value="product">Producto específico</option>
              <option value="category">Categoría</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Código (opcional)</label>
            <input
              type="text"
              value={formData.code || ''}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              placeholder="EJ: VERANO25"
              className="w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20 uppercase"
            />
          </div>

          {formData.scope === 'product' && (
            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium mb-1.5 ${errors.product_id ? 'text-red-600' : 'text-[--color-text-primary]'}`}>Producto *</label>
              <select
                value={formData.product_id || ''}
                onChange={(e) => handleChange('product_id', e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border focus:outline-none focus:ring-2 ${errors.product_id ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-[--color-accent]/20'}`}
              >
                <option value="">Seleccionar producto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.sku}</option>
                ))}
              </select>
              {errors.product_id && <p className="mt-1 text-sm text-red-600">{errors.product_id}</p>}
            </div>
          )}

          {formData.scope === 'category' && (
            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium mb-1.5 ${errors.category_id ? 'text-red-600' : 'text-[--color-text-primary]'}`}>Categoría *</label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => handleChange('category_id', e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border focus:outline-none focus:ring-2 ${errors.category_id ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-[--color-accent]/20'}`}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${errors.starts_at ? 'text-red-600' : 'text-[--color-text-primary]'}`}>Inicio *</label>
            <input
              type="datetime-local"
              value={formData.starts_at}
              onChange={(e) => handleChange('starts_at', e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border focus:outline-none focus:ring-2 ${errors.starts_at ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-[--color-accent]/20'}`}
            />
            {errors.starts_at && <p className="mt-1 text-sm text-red-600">{errors.starts_at}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${errors.ends_at ? 'text-red-600' : 'text-[--color-text-primary]'}`}>Fin *</label>
            <input
              type="datetime-local"
              value={formData.ends_at}
              onChange={(e) => handleChange('ends_at', e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border focus:outline-none focus:ring-2 ${errors.ends_at ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-[--color-accent]/20'}`}
            />
            {errors.ends_at && <p className="mt-1 text-sm text-red-600">{errors.ends_at}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Límite de uso (opcional)</label>
            <input
              type="number"
              min={1}
              value={formData.usage_limit || ''}
              onChange={(e) => handleChange('usage_limit', e.target.value ? Number(e.target.value) : 0)}
              placeholder="Sin límite"
              className="w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[--color-accent]/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[--color-accent] focus:ring-[--color-accent]"
            />
            <label htmlFor="is_active" className="text-sm text-[--color-text-primary]">Oferta activa</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="danger" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="success">
            {isEditing ? 'Guardar cambios' : 'Crear oferta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
