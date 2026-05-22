import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  BarChart3,
  Percent,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { useShop } from '@/hooks/useShop';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Productos' },
  { to: '/categories', icon: Tags, label: 'Categorías' },
  { to: '/orders', icon: ShoppingCart, label: 'Pedidos' },
  { to: '/customers', icon: Users, label: 'Clientes' },
  { to: '/analytics', icon: BarChart3, label: 'Analíticas' },
  { to: '/offers', icon: Percent, label: 'Ofertas' },
  { to: '/settings', icon: Settings, label: 'Configuración' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen } = useUIStore();
  const { user, selectedShop, logout } = useAuthStore();
  const { shop, fetchShop } = useShop();

  useEffect(() => {
    fetchShop();
  }, [fetchShop]);

  const shopName = shop?.name || selectedShop?.shop_name || 'Tu Tienda';
  const shopInitial = shopName.charAt(0).toUpperCase();
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-40',
        sidebarOpen ? 'w-[250px]' : 'w-[72px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-4">
        <div className="w-10 h-10 rounded-[--radius-md] bg-[--color-accent] flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
          {shop?.logo_url ? (
            <img
              src={shop.logo_url}
              alt={shopName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="text-sm font-bold text-white">{shopInitial}</span>
          )}
        </div>
        {sidebarOpen && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[--color-text-primary] leading-tight truncate">{shopName}</p>
            <p className="text-[11px] text-[--color-text-muted] capitalize">{user?.role || 'Usuario'}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive: navActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[--radius-md] text-[13px] font-medium transition-all duration-200',
                  (navActive || isActive)
                    ? 'bg-green-700 text-white shadow-sm'
                    : 'text-[--color-text-muted] hover:bg-green-50 hover:text-green-700',
                  !sidebarOpen && 'justify-center px-0'
                )
              }
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1">{label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3">
        <div className={cn('flex items-center gap-3 rounded-[--radius-lg] bg-[--color-bg-elevated] p-2', !sidebarOpen && 'justify-center bg-transparent')}>
          <div className="w-8 h-8 rounded-full bg-[--color-accent]/10 flex items-center justify-center text-[--color-accent] text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[--color-text-primary] truncate">{user?.name || 'Usuario'}</p>
              <p className="text-[11px] text-[--color-text-muted] capitalize truncate">{user?.role || 'Usuario'}</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-1.5 rounded-[--radius-md] text-[--color-text-muted] hover:bg-[--color-bg-hover] hover:text-[--color-red] transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
