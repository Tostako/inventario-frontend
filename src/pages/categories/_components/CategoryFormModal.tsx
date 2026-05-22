import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import type { CategoryFormData } from '@/types/category.types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CategoryFormData;
  imageUrl?: string | null;
  onSubmit: (data: CategoryFormData) => void;
  serverError?: string | null;
}

export function CategoryFormModal({ isOpen, onClose, initialData, imageUrl, onSubmit, serverError }: CategoryFormModalProps) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState<CategoryFormData>(
    initialData || { name: '', description: '', is_active: true }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || { name: '', description: '', is_active: true });
      setImagePreview(imageUrl || null);
      setImageFile(null);
      setErrors({});
    }
  }, [isOpen, initialData, imageUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ ...formData, image: imageFile || undefined });
  };

  const handleClose = () => {
    setFormData(initialData || { name: '', description: '', is_active: true });
    setErrors({});
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
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Editar categoría' : 'Nueva categoría'} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-[--radius-md] px-4 py-3">
            <p className="text-sm font-medium text-red-700">{serverError}</p>
          </div>
        )}

        {/* Imagen de categoría */}
        <div>
          <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">Imagen de la categoría</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative rounded-[--radius-md] p-5 text-center bg-white border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
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
                <img src={imagePreview} alt="Preview" className="max-h-28 mx-auto rounded-[--radius-md] object-cover" />
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
                <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isDragging ? 'bg-emerald-100 scale-110' : 'bg-gray-100'}`}>
                  <Upload className={`h-5 w-5 transition-colors duration-200 ${isDragging ? 'text-emerald-600' : 'text-gray-400'}`} />
                </div>
                <p className="text-sm text-gray-500">
                  {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP hasta 5MB</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1.5 ${errors.name ? 'text-red-600' : 'text-[--color-text-secondary]'}`}>Nombre *</label>
          <input
            type="text"
            placeholder="Ej: Blusas"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 text-sm rounded-[--radius-md] bg-white border focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 hover:border-gray-300 text-[--color-text-primary]'}`}
          />
          {errors.name && <p className="mt-1 text-sm font-medium text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1.5 ${errors.description ? 'text-red-600' : 'text-[--color-text-secondary]'}`}>Descripción *</label>
          <textarea
            placeholder="Describe la categoría..."
            className={`w-full px-3 py-2 text-sm bg-white border rounded-[--radius-md] resize-none focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 hover:border-gray-300 text-[--color-text-primary]'}`}
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          {errors.description && <p className="mt-1 text-sm font-medium text-red-600">{errors.description}</p>}
        </div>

        <div className="flex items-center gap-3">
          <input
            id="is_active"
            type="checkbox"
            checked={formData.is_active ?? true}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="h-4 w-4 rounded border-[--color-border] text-[--color-accent] focus:ring-[--color-accent]"
          />
          <label htmlFor="is_active" className="text-sm text-[--color-text-secondary]">
            Categoría activa
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="danger" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="success">
            {isEditing ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
