import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload } from 'lucide-react';
import { Modal, Button, Input } from '@/components/ui';
import { productSchema, type ProductFormData } from '@/schemas/product.schema';
import type { ProductCategory } from '@/types/product.types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProductFormData;
  imageUrl?: string | null;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
  categories: ProductCategory[];
  units: string[];
}

export function ProductFormModal({ isOpen, onClose, initialData, imageUrl, onSubmit, isSubmitting, serverError, categories, units }: ProductFormModalProps) {
  const isEditing = !!initialData;
  const [imagePreview, setImagePreview] = useState<string | null>(imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      sku: '',
      price: 0,
      cost: 0,
      stock: 0,
      stock_min: 5,
      unit: 'Unidad',
      category_id: '',
      is_active: true,
    },
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (isOpen) {
      setImagePreview(imageUrl || null);
      setImageFile(null);
    }
  }, [isOpen, imageUrl]);

  const handleFormSubmit = (data: ProductFormData) => {
    (data as any).image = imageFile || undefined;
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    setImagePreview(imageUrl || null);
    setImageFile(null);
    onClose();
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Editar producto' : 'Nuevo producto'} size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-[--radius-md] px-4 py-3">
            <p className="text-sm font-medium text-red-700">{serverError}</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          <Input
            label="Nombre del producto *"
            placeholder="Ej: Arroz 1kg"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="SKU *"
            placeholder="Ej: ARR-001"
            error={errors.sku?.message}
            {...register('sku')}
          />

          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-1.5 ${errors.description ? 'text-red-600' : 'text-[--color-text-primary]'}`}>Descripción</label>
            <textarea
              placeholder="Describe el producto..."
              className={`w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border resize-none focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 hover:border-gray-300 focus:ring-[--color-accent]/20 text-[--color-text-primary]'}`}
              rows={3}
              {...register('description')}
            />
            {errors.description && <p className="mt-1 text-sm font-medium text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${errors.category_id ? 'text-red-600' : 'text-[--color-text-primary]'}`}>Categoría *</label>
            <select
              className={`w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border focus:outline-none focus:ring-2 ${errors.category_id ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 hover:border-gray-300 text-[--color-text-primary] focus:ring-[--color-accent]/20'}`}
              {...register('category_id')}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="mt-1 text-sm font-medium text-red-600">{errors.category_id.message}</p>}
          </div>

          <Input
            label="Precio de venta (COP) *"
            type="number"
            placeholder="0"
            error={errors.price?.message}
            {...register('price')}
          />

          <Input
            label="Precio de costo (COP) *"
            type="number"
            placeholder="0"
            error={errors.cost?.message}
            {...register('cost')}
          />

          <Input
            label="Stock actual *"
            type="number"
            placeholder="0"
            error={errors.stock?.message}
            {...register('stock')}
          />

          <Input
            label="Stock mínimo *"
            type="number"
            placeholder="5"
            error={errors.stock_min?.message}
            {...register('stock_min')}
          />

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${errors.unit ? 'text-red-600' : 'text-[--color-text-primary]'}`}>Unidad *</label>
            <select
              className={`w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border focus:outline-none focus:ring-2 ${errors.unit ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 hover:border-gray-300 text-[--color-text-primary] focus:ring-[--color-accent]/20'}`}
              {...register('unit')}
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && <p className="mt-1 text-sm font-medium text-red-600">{errors.unit.message}</p>}
          </div>

          <div className="flex items-center gap-3">
            <input
              id="is_active"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setValue('is_active', e.target.checked, { shouldValidate: true })}
              className="h-4 w-4 rounded border-[--color-border] text-[--color-accent] focus:ring-[--color-accent]"
            />
            <label htmlFor="is_active" className="text-sm text-[--color-text-secondary]">
              Producto activo
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Imagen del producto</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative rounded-[--radius-md] p-6 text-center bg-white border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
              isDragging
                ? 'border-emerald-400 bg-emerald-50 scale-[1.02] shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto rounded-[--radius-md] object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isDragging ? 'bg-emerald-100 scale-110' : 'bg-gray-100'}`}>
                  <Upload className={`h-6 w-6 transition-colors duration-200 ${isDragging ? 'text-emerald-600' : 'text-gray-400'}`} />
                </div>
                <p className="text-sm text-gray-500">
                  {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP hasta 5MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="danger" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" isLoading={isSubmitting}>
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
