import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Product, ProductFormData } from '@/types/product.types';

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

interface StockAdjustmentData {
  delta: number;
  notes?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<Product[]>['meta']>(undefined);

  const fetchProducts = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    is_active?: boolean;
    low_stock?: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.search) searchParams.set('search', params.search);
      if (params?.category_id) searchParams.set('category_id', params.category_id);
      if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
      if (params?.low_stock !== undefined) searchParams.set('low_stock', String(params.low_stock));

      const query = searchParams.toString();
      const response = await api.get(`/products${query ? `?${query}` : ''}`) as ApiResponse<Product[]>;
      if (response.success) {
        setProducts(response.data);
        setMeta(response.meta);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/products/${id}`) as ApiResponse<Product>;
      if (response.success) {
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al obtener producto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: ProductFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (data.image) {
        const formData = new FormData();
        formData.append('image', data.image);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('sku', data.sku);
        formData.append('price', String(data.price));
        formData.append('cost', String(data.cost));
        formData.append('stock', String(data.stock));
        formData.append('stock_min', String(data.stock_min));
        formData.append('unit', data.unit);
        formData.append('category_id', data.category_id);
        formData.append('is_active', String(data.is_active));
        response = await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }) as ApiResponse<Product>;
      } else {
        response = await api.post('/products', data) as ApiResponse<Product>;
      }
      if (response.success) {
        setProducts((prev) => [response.data, ...prev]);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear producto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<ProductFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (data.image) {
        const formData = new FormData();
        formData.append('image', data.image);
        if (data.name !== undefined) formData.append('name', data.name);
        if (data.description !== undefined) formData.append('description', data.description);
        if (data.sku !== undefined) formData.append('sku', data.sku);
        if (data.price !== undefined) formData.append('price', String(data.price));
        if (data.cost !== undefined) formData.append('cost', String(data.cost));
        if (data.stock !== undefined) formData.append('stock', String(data.stock));
        if (data.stock_min !== undefined) formData.append('stock_min', String(data.stock_min));
        if (data.unit !== undefined) formData.append('unit', data.unit);
        if (data.category_id !== undefined) formData.append('category_id', data.category_id);
        if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
        response = await api.patch(`/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }) as ApiResponse<Product>;
      } else {
        response = await api.patch(`/products/${id}`, data) as ApiResponse<Product>;
      }
      if (response.success) {
        setProducts((prev) => prev.map((p) => (p.id === id ? response.data : p)));
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar producto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar producto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const adjustStock = useCallback(async (id: string, data: StockAdjustmentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/products/${id}/stock`, data) as ApiResponse<Product>;
      if (response.success) {
        setProducts((prev) => prev.map((p) => (p.id === id ? response.data : p)));
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al ajustar stock');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    products,
    isLoading,
    error,
    meta,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
  };
}
