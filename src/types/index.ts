export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
  shopId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  name: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  currency: string;
  timezone: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TenantState {
  shop: Shop | null;
  shopId: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}
