import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Shop } from './useShop';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function useUpdateShopLogo() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLogo = useCallback(async (file: File): Promise<Shop | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await api.patch('/shop/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }) as ApiResponse<Shop>;

      if (response.success) {
        return response.data;
      }

      throw new Error(response.message || 'Error al subir el logo');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al subir el logo';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateLogo,
    isLoading,
    error,
  };
}
