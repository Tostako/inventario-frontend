import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Category } from '@/types/category.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function useUpdateCategoryImage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateImage = useCallback(async (id: string, file: File): Promise<Category | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.patch(`/categories/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }) as ApiResponse<Category>;

      if (response.success) {
        return response.data;
      }

      throw new Error(response.message || 'Error al subir la imagen');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al subir la imagen';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateImage,
    isLoading,
    error,
  };
}
