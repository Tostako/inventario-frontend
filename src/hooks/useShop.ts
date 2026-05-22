import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface Shop {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  logo_url?: string;
  currency: string;
  timezone: string;
  is_active: boolean;
  plan?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function useShop() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShop = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/shop') as ApiResponse<Shop>;
      if (response.success) {
        setShop(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar tienda');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateShop = useCallback(async (data: Partial<Shop>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.patch('/shop', data) as ApiResponse<Shop>;
      if (response.success) {
        setShop(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar tienda');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    shop,
    isLoading,
    error,
    fetchShop,
    updateShop,
  };
}
