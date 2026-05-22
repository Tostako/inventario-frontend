import { Search, Bell, ChevronDown, Settings, LogOut, PlusCircle, Store, Check, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useUserShops } from '@/hooks/useUserShops';
import { useSwitchShop } from '@/hooks/useSwitchShop';

export function Header() {
  const { user, logout, selectedShop, shops } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);

  const { fetchShops, resetFetched, isLoading: loadingShops } = useUserShops();
  const { switchShop, isLoading: switchingShop } = useSwitchShop();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Load shops on mount if we have no shops at all
  useEffect(() => {
    if (selectedShop && (!shops || shops.length === 0)) {
      fetchShops().catch(() => {});
    }
  }, [selectedShop, shops, fetchShops]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (shopRef.current && !shopRef.current.contains(event.target as Node)) {
        setShopOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchShop = async (shopId: string) => {
    if (shopId === selectedShop?.shop_id) return;
    setShopOpen(false);
    try {
      await switchShop({ shop_id: shopId });
    } catch {
      // Error handled by hook
    }
  };

  const handleRefreshShops = async () => {
    try {
      await fetchShops(true);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6">
      <div className="flex items-center flex-1">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[--color-bg-surface] rounded-[--radius-full] w-[400px] shadow-sm">
          <Search className="h-4 w-4 text-[--color-text-subtle]" />
          <input
            type="text"
            placeholder="Buscar productos, pedidos, clientes..."
            className="flex-1 bg-transparent text-sm text-[--color-text-primary] placeholder:text-[--color-text-subtle] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Shop Switcher */}
        {selectedShop && (
          <div className="relative" ref={shopRef}>
            <button
              onClick={() => setShopOpen(!shopOpen)}
              disabled={loadingShops}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-[--radius-full] bg-[--color-bg-surface] hover:bg-[--color-bg-hover] transition-colors shadow-sm cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Store className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="hidden sm:block text-left max-w-[140px]">
                <p className="text-sm font-medium text-[--color-text-primary] leading-tight truncate">
                  {selectedShop.shop_name}
                </p>
                <p className="text-xs text-[--color-text-muted] capitalize">{selectedShop.role}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-[--color-text-subtle] transition-transform flex-shrink-0 ${shopOpen ? 'rotate-180' : ''}`} />
            </button>

            {shopOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-[--radius-lg] shadow-lg border border-gray-100 py-2 z-50">
                {/* Header */}
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tus tiendas</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRefreshShops(); }}
                    disabled={loadingShops}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="Recargar tiendas"
                  >
                    <RefreshCw className={`h-3 w-3 ${loadingShops ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Lista de tiendas */}
                {loadingShops ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Cargando tiendas...</div>
                ) : shops && shops.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {shops.map((shop) => (
                      <button
                        key={shop.shop_id}
                        onClick={() => handleSwitchShop(shop.shop_id)}
                        disabled={switchingShop}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                          selectedShop.shop_id === shop.shop_id
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${
                          selectedShop.shop_id === shop.shop_id ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}>
                          {shop.shop_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{shop.shop_name}</p>
                          <p className="text-xs text-gray-500">{shop.shop_slug}</p>
                        </div>
                        {selectedShop.shop_id === shop.shop_id && (
                          <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No tienes otras tiendas</div>
                )}

                {/* Crear nueva tienda */}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => { setShopOpen(false); navigate('/create-shop'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors text-left"
                  >
                    <PlusCircle className="h-4 w-4 text-gray-400" />
                    Crear nueva tienda
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button className="relative p-2.5 rounded-[--radius-full] bg-[--color-bg-surface] text-[--color-text-muted] hover:text-[--color-text-primary] transition-colors shadow-sm">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[--color-red] rounded-full" />
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-[--radius-full] bg-[--color-bg-surface] hover:bg-[--color-bg-hover] transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-[--color-accent]/10 overflow-hidden flex items-center justify-center">
              <span className="text-sm font-semibold text-[--color-accent]">{initials}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-[--color-text-primary] leading-tight">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-[--color-text-muted] capitalize">{user?.role || 'Usuario'}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-[--color-text-subtle] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-[--radius-lg] shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <button
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-400" />
                Configuración
              </button>

              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
