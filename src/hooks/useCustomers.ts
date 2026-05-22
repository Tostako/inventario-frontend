import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Customer, CustomerFormData } from '@/types/customer.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<Customer[]>['meta']>(undefined);

  const fetchCustomers = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    is_active?: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.search) searchParams.set('search', params.search);
      if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));

      const query = searchParams.toString();
      const response = await api.get(`/customers${query ? `?${query}` : ''}`) as ApiResponse<Customer[]>;
      if (response.success) {
        setCustomers(response.data);
        setMeta(response.meta);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCustomer = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/customers/${id}`) as ApiResponse<Customer>;
      if (response.success) {
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al obtener cliente');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCustomer = useCallback(async (data: CustomerFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/customers', data) as ApiResponse<Customer>;
      if (response.success) {
        setCustomers((prev) => [response.data, ...prev]);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCustomer = useCallback(async (id: string, data: Partial<CustomerFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/customers/${id}`, data) as ApiResponse<Customer>;
      if (response.success) {
        setCustomers((prev) => prev.map((c) => (c.id === id ? response.data : c)));
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar cliente');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCustomer = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar cliente');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    customers,
    isLoading,
    error,
    meta,
    fetchCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
