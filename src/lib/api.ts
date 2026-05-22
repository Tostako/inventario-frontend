import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add auth token (only if not already set)
api.interceptors.request.use(
  (config) => {
    // Don't override explicit Authorization headers (e.g., temp token for select-shop)
    if (config.headers.Authorization) {
      return config;
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints that may return 401 legitimately (wrong credentials)
// We should NOT redirect/reload on these — just let the caller handle the error.
const PUBLIC_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/customer/login',
  '/auth/customer/register',
];

// Response interceptor: handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Error de conexión';
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    if (status === 401 && !PUBLIC_AUTH_ENDPOINTS.some((ep) => requestUrl.includes(ep))) {
      localStorage.removeItem('token');
      localStorage.removeItem('temp_token');
      localStorage.removeItem('auth-storage'); // limpia zustand persist también
      window.location.href = '/login';
    }

    return Promise.reject({ message, status });
  }
);
