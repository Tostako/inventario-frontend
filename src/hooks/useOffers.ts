import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Offer, CreateOfferData, UpdateOfferData, OfferScope } from '@/types/offer.types';

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

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse<Offer[]>['meta']>(undefined);

  const fetchOffers = useCallback(async (params?: {
    page?: number;
    limit?: number;
    is_active?: boolean;
    scope?: OfferScope;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
      if (params?.scope) searchParams.set('scope', params.scope);

      const query = searchParams.toString();
      const response = await api.get(`/offers${query ? `?${query}` : ''}`) as ApiResponse<Offer[]>;
      if (response.success) {
        setOffers(response.data);
        setMeta(response.meta);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar ofertas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOffer = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/offers/${id}`) as ApiResponse<Offer>;
      if (response.success) {
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al obtener oferta');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOffer = useCallback(async (data: CreateOfferData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/offers', data) as ApiResponse<Offer>;
      if (response.success) {
        setOffers((prev) => [response.data, ...prev]);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear oferta');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOffer = useCallback(async (id: string, data: UpdateOfferData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/offers/${id}`, data) as ApiResponse<Offer>;
      if (response.success) {
        setOffers((prev) => prev.map((o) => (o.id === id ? response.data : o)));
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar oferta');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteOffer = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/offers/${id}`);
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar oferta');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    offers,
    isLoading,
    error,
    meta,
    fetchOffers,
    getOffer,
    createOffer,
    updateOffer,
    deleteOffer,
  };
}
