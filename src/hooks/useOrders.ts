import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Order, OrderStatus, UpdateOrderStatusData } from '@/types/order.types';

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

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<Order[]>['meta']>(undefined);

  const fetchOrders = useCallback(async (params?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    customer_id?: string;
    desde?: string;
    hasta?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.status) searchParams.set('status', params.status);
      if (params?.customer_id) searchParams.set('customer_id', params.customer_id);
      if (params?.desde) searchParams.set('desde', params.desde);
      if (params?.hasta) searchParams.set('hasta', params.hasta);

      const query = searchParams.toString();
      const response = await api.get(`/orders${query ? `?${query}` : ''}`) as ApiResponse<Order[]>;
      if (response.success) {
        setOrders(response.data);
        setMeta(response.meta);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrder = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/orders/${id}`) as ApiResponse<Order>;
      if (response.success) {
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al obtener pedido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, data: UpdateOrderStatusData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/orders/${id}/estado`, data) as ApiResponse<Order>;
      if (response.success) {
        setOrders((prev) => prev.map((o) => (o.id === id ? response.data : o)));
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar estado del pedido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    orders,
    isLoading,
    error,
    meta,
    fetchOrders,
    getOrder,
    updateOrderStatus,
  };
}
