import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Shop {
  shop_id: string;
  shop_name: string;
  shop_slug: string;
  role: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  shops: Shop[] | null;
  selectedShop: Shop | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  setShops: (shops: Shop[]) => void;
  selectShop: (shop: Shop) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      shops: null,
      selectedShop: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      setShops: (shops) => set({ shops }),
      selectShop: (shop) => {
        set({ selectedShop: shop });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('temp_token');
        set({ user: null, token: null, shops: null, selectedShop: null, isAuthenticated: false });
      },
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        shops: state.shops,
        selectedShop: state.selectedShop,
        isAuthenticated: state.isAuthenticated,
        _hasHydrated: state._hasHydrated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
