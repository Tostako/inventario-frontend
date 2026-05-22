import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout, ProtectedRoute } from '@/components/layout';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { DashboardPage } from '@/pages/dashboard';
import { ProductsPage, ProductDetailPage } from '@/pages/products';
import { OrdersPage, OrderDetailPage } from '@/pages/orders';
import { CustomersPage, CustomerDetailPage } from '@/pages/customers';
import { SettingsPage } from '@/pages/settings';
import { AnalyticsPage } from '@/pages/analytics';
import CategoriesPage from '@/pages/categories/CategoriesPage';
import { CreateShopPage } from '@/pages/shop/CreateShopPage';
import { OffersPage } from '@/pages/offers/OffersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/create-shop" element={<CreateShopPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}