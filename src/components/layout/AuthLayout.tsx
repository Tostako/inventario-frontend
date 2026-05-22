import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ShoppingCart } from 'lucide-react';

export function AuthLayout() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const token = localStorage.getItem('token');

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (isAuthenticated && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 mb-4 shadow-sm">
          <ShoppingCart className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Panel de Gestión</h1>
        <p className="text-sm text-slate-500 mt-1">Sistema de administración de tienda</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <Outlet />
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-slate-400">
        © {new Date().getFullYear()} Sistema de Gestión de Tienda
      </p>
    </div>
  );
}
