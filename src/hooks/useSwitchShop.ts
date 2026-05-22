import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface SwitchShopData {
  shop_id: string;
}

interface SwitchShopResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
  message?: string;
}

export function useSwitchShop() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, shops, selectShop } = useAuthStore();

  const switchShop = async (data: SwitchShopData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Este endpoint permite cambiar de tienda estando logueado.
      // El backend usa el token actual (final) para identificar al usuario,
      // valida que tenga acceso a shop_id, y devuelve un NUEVO token final.
      const response = await api.post('/auth/switch-shop', data) as SwitchShopResponse;
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al cambiar de tienda');
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuth(user, token);

      const shop = shops?.find((s) => s.shop_id === data.shop_id);
      if (shop) {
        selectShop(shop);
      }

      // Recargar la página para que todos los hooks carguen datos de la nueva tienda
      window.location.reload();

      return response.data;
    } catch (err: any) {
      setError(err.message || 'Error al cambiar de tienda');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { switchShop, isLoading, error };
}
