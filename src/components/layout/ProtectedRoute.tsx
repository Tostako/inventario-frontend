import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { PageWrapper } from './PageWrapper';

export function ProtectedRoute() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const token = localStorage.getItem('token');

  // Wait for zustand persist to rehydrate before deciding
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--color-bg-base]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--color-accent]" />
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  );
}
