import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface RegisterData {
  shop_name: string;
  shop_slug: string;
  shop_email: string;
  owner_name: string;
  owner_email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  data?: {
    token: string;
    shopId: string;
    userId: string;
  };
  message?: string;
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, selectShop } = useAuthStore();

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', data) as RegisterResponse;
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al registrar');
      }

      const { token, shopId, userId } = response.data;
      localStorage.setItem('token', token);
      setAuth(
        { id: userId, email: data.owner_email, name: data.owner_name, role: 'owner' },
        token
      );
      selectShop({
        shop_id: shopId,
        shop_name: data.shop_name,
        shop_slug: data.shop_slug,
        role: 'owner',
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
