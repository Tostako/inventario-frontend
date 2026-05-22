import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '@/hooks/useRegister';
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema';
import { Eye, EyeOff } from 'lucide-react';

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        shop_name: data.shopName,
        shop_slug: data.shopSlug,
        shop_email: data.shopEmail,
        owner_name: data.ownerName,
        owner_email: data.ownerEmail,
        password: data.password,
      });
      navigate('/dashboard', { replace: true });
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Crear cuenta</h2>
        <p className="text-sm text-slate-500 mt-1">Registra tu tienda y comienza a gestionar tu inventario</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre de la tienda *</label>
          <input
            type="text"
            placeholder="Ej: Mi Tienda Express"
            className="w-full px-4 py-2.5 text-sm bg-gray-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
            {...register('shopName')}
          />
          {errors.shopName && <p className="mt-1 text-xs text-red-500">{errors.shopName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug de la tienda *</label>
          <input
            type="text"
            placeholder="mi-tienda-express"
            className="w-full px-4 py-2.5 text-sm bg-gray-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
            {...register('shopSlug')}
          />
          {errors.shopSlug && <p className="mt-1 text-xs text-red-500">{errors.shopSlug.message}</p>}
          <p className="mt-1 text-xs text-slate-400">Solo minúsculas, números y guiones. Será parte de tu URL.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo de la tienda *</label>
          <input
            type="email"
            placeholder="tienda@ejemplo.com"
            autoComplete="email"
            className="w-full px-4 py-2.5 text-sm bg-gray-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
            {...register('shopEmail')}
          />
          {errors.shopEmail && <p className="mt-1 text-xs text-red-500">{errors.shopEmail.message}</p>}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">Datos del dueño</p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo del dueño *</label>
            <input
              type="text"
              placeholder="Juan Pérez"
              autoComplete="name"
              className="w-full px-4 py-2.5 text-sm bg-gray-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
              {...register('ownerName')}
            />
            {errors.ownerName && <p className="mt-1 text-xs text-red-500">{errors.ownerName.message}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo del dueño *</label>
            <input
              type="email"
              placeholder="juan@ejemplo.com"
              autoComplete="email"
              className="w-full px-4 py-2.5 text-sm bg-gray-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
              {...register('ownerEmail')}
            />
            {errors.ownerEmail && <p className="mt-1 text-xs text-red-500">{errors.ownerEmail.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full px-4 py-2.5 text-sm bg-gray-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all pr-11"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          <p className="mt-1 text-xs text-slate-400">Mínimo 8 caracteres, máximo 72.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmar contraseña *</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full px-4 py-2.5 text-sm bg-gray-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 active:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creando cuenta...
            </span>
          ) : (
            'Crear cuenta'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
