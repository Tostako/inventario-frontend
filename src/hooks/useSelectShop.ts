import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface SelectShopData {
  shop_id: string;
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

export function useSelectShop() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, shops, selectShop: setSelectedShop } = useAuthStore();

  const selectShop = async (data: SelectShopData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use temp token for this request
      const tempToken = localStorage.getItem('temp_token');
      const response = await api.post('/auth/select-shop', data, {
        headers: { Authorization: `Bearer ${tempToken}` },
      }) as SelectShopResponse;

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al seleccionar tienda');
      }

      const { token, user } = response.data;
      localStorage.removeItem('temp_token');
      localStorage.setItem('token', token);
      setAuth(user, token);

      // Set selected shop from the shops list
      const shop = shops?.find((s) => s.shop_id === data.shop_id);
      if (shop) {
        setSelectedShop(shop);
      }

      return response.data;
    } catch (err: any) {
      setError(err.message || 'Error al seleccionar tienda');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { selectShop, isLoading, error };
}
