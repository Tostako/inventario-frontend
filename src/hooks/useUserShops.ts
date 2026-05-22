import { useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface ShopData {
  shop_id: string;
  shop_name: string;
  shop_slug: string;
  role: string;
}

interface UserShopsResponse {
  success: boolean;
  data?: {
    shops: ShopData[];
  };
  message?: string;
}

export function useUserShops() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setShops } = useAuthStore();
  const hasFetched = useRef(false);

  const fetchShops = useCallback(async (force = false) => {
    if (hasFetched.current && !force) {
      return useAuthStore.getState().shops || [];
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/auth/shops') as UserShopsResponse;
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al obtener tiendas');
      }
      setShops(response.data.shops);
      hasFetched.current = true;
      return response.data.shops;
    } catch (err: any) {
      const msg = err.message || 'Error al obtener tiendas';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setShops]);

  const resetFetched = useCallback(() => {
    hasFetched.current = false;
  }, []);

  return { fetchShops, resetFetched, isLoading, error };
}
