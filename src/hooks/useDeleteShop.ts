import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface ShopData {
  shop_id: string;
  shop_name: string;
  shop_slug: string;
  role: string;
}

interface DeleteShopResponse {
  success: boolean;
  message?: string;
  data?: {
    deleted_at: string;
    // Si el backend encuentra otra tienda, devuelve token + shop nuevos
    token?: string;
    shop?: ShopData;
  };
}

export function useDeleteShop() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteShop = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.delete('/shop') as DeleteShopResponse;
      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar la tienda');
      }
      return response.data;
    } catch (err: any) {
      const msg = err.message || 'Error al eliminar la tienda';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteShop, isLoading, error };
}
