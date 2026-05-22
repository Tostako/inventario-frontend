import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Category, CategoryFormData } from '@/types/category.types';

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

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<Category[]>['meta']>(undefined);

  const fetchCategories = useCallback(async (params?: { page?: number; limit?: number; is_active?: boolean }) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));

      const query = searchParams.toString();
      const response = await api.get(`/categories${query ? `?${query}` : ''}`) as ApiResponse<Category[]>;
      if (response.success) {
        setCategories(response.data);
        setMeta(response.meta);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: CategoryFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (data.image) {
        const formData = new FormData();
        formData.append('image', data.image);
        formData.append('name', data.name);
        formData.append('description', data.description);
        if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
        if (data.parent_id !== undefined) formData.append('parent_id', data.parent_id ?? '');
        response = await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }) as ApiResponse<Category>;
      } else {
        response = await api.post('/categories', data) as ApiResponse<Category>;
      }
      if (response.success) {
        setCategories((prev) => [response.data, ...prev]);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear categoría');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, data: CategoryFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (data.image) {
        // Si hay imagen nueva, enviar todo como multipart/form-data
        const formData = new FormData();
        formData.append('image', data.image);
        if (data.name !== undefined) formData.append('name', data.name);
        if (data.description !== undefined) formData.append('description', data.description);
        if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
        if (data.parent_id !== undefined) formData.append('parent_id', data.parent_id ?? '');
        response = await api.patch(`/categories/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }) as ApiResponse<Category>;
      } else {
        // Sin imagen, enviar JSON normal
        response = await api.patch(`/categories/${id}`, data) as ApiResponse<Category>;
      }
      if (response.success) {
        setCategories((prev) => prev.map((c) => (c.id === id ? response.data : c)));
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar categoría');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCategoryImage = useCallback(async (id: string, file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.patch(`/categories/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }) as ApiResponse<Category>;
      if (response.success) {
        setCategories((prev) => prev.map((c) => (c.id === id ? response.data : c)));
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen de categoría');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar categoría');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    categories,
    isLoading,
    error,
    meta,
    fetchCategories,
    createCategory,
    updateCategory,
    updateCategoryImage,
    deleteCategory,
  };
}
