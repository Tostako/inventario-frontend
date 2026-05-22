import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PasswordData {
  current_password: string;
  new_password: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/me') as ApiResponse<UserProfile>;
      if (response.success) {
        setProfile(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar perfil');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.patch('/users/me', data) as ApiResponse<UserProfile>;
      if (response.success) {
        setProfile(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (data: PasswordData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.patch('/users/me/password', data) as ApiResponse<{ message: string }>;
      if (response.success) {
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
  };
}
