import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface CreateShopData {
  shop_name: string;
  shop_slug: string;
  shop_email: string;
}

interface CreateShopResponse {
  success: boolean;
  data?: {
    token: string;
    shopId: string;
    userId: string;
  };
  message?: string;
}

export function useCreateShop() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, selectShop, shops, setShops } = useAuthStore();

  const createShop = async (data: CreateShopData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Este endpoint permite a un owner logueado crear una nueva tienda
      // sin necesidad de volver a registrar su cuenta.
      // El backend usa el user_id del JWT para asociar el owner existente.
      const response = await api.post('/shops', data) as CreateShopResponse;
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al crear tienda');
      }

      const { token, shopId, userId } = response.data;
      localStorage.setItem('token', token);

      // Actualizar auth store con la nueva tienda
      const { user } = useAuthStore.getState();
      if (user) {
        setAuth(user, token);
        const newShop = {
          shop_id: shopId,
          shop_name: data.shop_name,
          shop_slug: data.shop_slug,
          role: user.role || 'owner',
        };
        selectShop(newShop);
        // Agregar la nueva tienda a la lista de shops
        const currentShops = shops || [];
        setShops([...currentShops, newShop]);
      }

      return response.data;
    } catch (err: any) {
      setError(err.message || 'Error al crear tienda');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createShop, isLoading, error };
}
