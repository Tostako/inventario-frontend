import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface LoginCredentials {
  email: string;
  password: string;
}

interface ShopData {
  shop_id: string;
  shop_name: string;
  shop_slug: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    shops: ShopData[];
  };
  message?: string;
}

interface SelectShopResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
  message?: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, setShops, selectShop } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', credentials) as LoginResponse;
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al iniciar sesión');
      }

      const { token: tempToken, shops } = response.data;

      if (shops.length === 0) {
        throw new Error('No tienes tiendas asociadas');
      }

      localStorage.setItem('temp_token', tempToken);

      // If multiple shops, return them for selection
      if (shops.length > 1) {
        setShops(shops);
        return { needsShopSelection: true, shops };
      }

      // Single shop: auto-select to exchange temp token for final token
      const shop = shops[0];
      const selectResponse = await api.post('/auth/select-shop', { shop_id: shop.shop_id }, {
        headers: { Authorization: `Bearer ${tempToken}` },
      }) as SelectShopResponse;

      if (!selectResponse.success || !selectResponse.data) {
        throw new Error(selectResponse.message || 'Error al seleccionar tienda');
      }

      const { token: finalToken, user } = selectResponse.data;
      localStorage.removeItem('temp_token');
      localStorage.setItem('token', finalToken);
      setAuth(user, finalToken);
      setShops(shops);
      selectShop(shop);
      return { needsShopSelection: false };
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
