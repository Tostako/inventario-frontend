import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { useCreateShop } from '@/hooks/useCreateShop';
import { createShopSchema, type CreateShopFormData } from '@/schemas/shop.schema';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50);
}

export function CreateShopPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createShop, isLoading, error } = useCreateShop();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateShopFormData>({
    resolver: zodResolver(createShopSchema),
    defaultValues: {
      shop_name: '',
      shop_slug: '',
      shop_email: user?.email || '',
    },
  });

  const shopName = watch('shop_name');

  useEffect(() => {
    if (shopName) {
      setValue('shop_slug', slugify(shopName), { shouldValidate: true });
    }
  }, [shopName, setValue]);

  const onSubmit = async (data: CreateShopFormData) => {
    try {
      await createShop(data);
      navigate('/dashboard', { replace: true });
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="p-2 rounded-[--radius-md] text-[--color-text-muted] hover:bg-[--color-bg-hover] hover:text-[--color-text-primary] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-[28px] font-bold text-[--color-text-primary] tracking-tight">Crear nueva tienda</h1>
          <p className="text-[15px] text-[--color-text-muted] mt-1">
            Configura una nueva tienda para tu cuenta
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[--color-bg-surface] rounded-[--radius-xl] shadow-sm p-6">
        {error && (
          <div className="mb-5 p-3 rounded-[--radius-md] bg-red-50 text-[--color-red] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Nombre de la tienda *"
            placeholder="Ej: Mi Tienda Colombiana"
            error={errors.shop_name?.message}
            className="bg-white border-gray-200 hover:border-gray-300"
            {...register('shop_name')}
          />

          <Input
            label="Slug *"
            placeholder="mi-tienda-colombiana"
            helperText="Identificador único para la URL de tu tienda. Solo letras minúsculas, números y guiones."
            error={errors.shop_slug?.message}
            className="bg-white border-gray-200 hover:border-gray-300"
            {...register('shop_slug')}
          />

          <Input
            label="Correo de la tienda *"
            type="email"
            placeholder="tienda@ejemplo.com"
            error={errors.shop_email?.message}
            className="bg-white border-gray-200 hover:border-gray-300"
            {...register('shop_email')}
          />

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
              Cancelar
            </Button>
            <Button type="submit" variant="success" isLoading={isLoading}>
              Crear tienda
            </Button>
          </div>
        </form>
      </div>

      {/* Info card */}
      <div className="bg-[--color-bg-surface] rounded-[--radius-xl] shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-[--radius-lg] bg-[--color-accent-muted]">
            <Store className="h-5 w-5 text-[--color-accent]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[--color-text-primary]">¿Qué es una tienda?</h3>
            <p className="text-sm text-[--color-text-muted] mt-1 leading-relaxed">
              Cada tienda es un espacio independiente con su propio catálogo de productos, inventario,
              pedidos y clientes. Puedes administrar múltiples tiendas desde una misma cuenta.
              El slug se usará para crear la URL pública de tu tienda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
