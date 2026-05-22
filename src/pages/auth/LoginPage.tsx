import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks/useLogin';
import { useSelectShop } from '@/hooks/useSelectShop';
import { useAuthStore } from '@/stores/authStore';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { Eye, EyeOff, Store, ArrowLeft } from 'lucide-react';

interface ShopOption {
  shop_id: string;
  shop_name: string;
  shop_slug: string;
  role: string;
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [shopOptions, setShopOptions] = useState<ShopOption[] | null>(null);
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();
  const { selectShop, isLoading: selectingShop, error: selectError } = useSelectShop();
  const { shops } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // On mount: if temp_token exists and we have persisted shops, show selector directly
  useEffect(() => {
    const tempToken = localStorage.getItem('temp_token');
    if (tempToken && shops && shops.length > 0) {
      setShopOptions(shops);
    }
  }, [shops]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data);
      if (result.needsShopSelection) {
        setShopOptions(result.shops);
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch {
      // Error is shown below
    }
  };

  const handleSelectShop = async (shop: ShopOption) => {
    try {
      await selectShop({ shop_id: shop.shop_id });
      setShopOptions(null);
      navigate('/dashboard', { replace: true });
    } catch {
      // Error shown below
    }
  };

  const handleBackToLogin = () => {
    setShopOptions(null);
    localStorage.removeItem('temp_token');
    useAuthStore.setState({ shops: null, selectedShop: null });
  };

  // ─── Shop Selection View ───
  if (shopOptions) {
    return (
      <div>
        <button
          onClick={handleBackToLogin}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al login
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 mb-3">
            <Store className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Selecciona tu tienda</h2>
          <p className="text-sm text-slate-500 mt-1">
            Tu cuenta tiene acceso a {shopOptions.length} tiendas
          </p>
        </div>

        {selectError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {selectError}
          </div>
        )}

        <div className="space-y-3">
          {shopOptions.map((shop) => (
            <button
              key={shop.shop_id}
              onClick={() => handleSelectShop(shop)}
              disabled={selectingShop}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left border border-transparent hover:border-slate-200"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                {shop.shop_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{shop.shop_name}</p>
                <p className="text-xs text-slate-500">{shop.shop_slug} · {shop.role}</p>
              </div>
              <div className="text-emerald-600">
                <Store className="h-5 w-5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Login Form View ───
  return (
    <div>
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Iniciar Sesión</h2>
        <p className="text-sm text-slate-500 mt-1">Ingresa a tu panel de administración</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Correo Electrónico
          </label>
          <input
            type="email"
            placeholder="admin@eleganza.com"
            autoComplete="email"
            className="w-full px-4 py-2.5 text-sm bg-gray-100 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
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
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-sm text-slate-600">Recordar por 7 días</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Submit */}
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
              Iniciando sesión...
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes una cuenta?{' '}
        <Link
          to="/register"
          className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
        >
          Regístrate aquí
        </Link>
      </p>

      {/* Divider + Demo credentials */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-center text-xs font-semibold text-slate-700">
          Credenciales de prueba:
        </p>
        <p className="text-center text-xs text-slate-500 mt-1">
          Email: admin@eleganza.com | Contraseña: Password123!
        </p>
      </div>
    </div>
  );
}
