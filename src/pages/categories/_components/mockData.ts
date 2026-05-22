import type { Category } from '@/types/category.types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Blusas', slug: 'blusas', description: 'Blusas de seda, algodón y sintéticas', is_active: true, parent_id: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Pantalones', slug: 'pantalones', description: 'Pantalones casuales y formales', is_active: true, parent_id: null, created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z' },
  { id: '3', name: 'Vestidos', slug: 'vestidos', description: 'Vestidos para toda ocasión', is_active: true, parent_id: null, created_at: '2024-01-03T00:00:00Z', updated_at: '2024-01-03T00:00:00Z' },
  { id: '4', name: 'Chaquetas', slug: 'chaquetas', description: 'Chaquetas y abrigos', is_active: true, parent_id: null, created_at: '2024-01-04T00:00:00Z', updated_at: '2024-01-04T00:00:00Z' },
  { id: '5', name: 'Faldas', slug: 'faldas', description: 'Faldas cortas y largas', is_active: true, parent_id: null, created_at: '2024-01-05T00:00:00Z', updated_at: '2024-01-05T00:00:00Z' },
  { id: '6', name: 'Accesorios', slug: 'accesorios', description: 'Bolsos, cinturones y más', is_active: true, parent_id: null, created_at: '2024-01-06T00:00:00Z', updated_at: '2024-01-06T00:00:00Z' },
  { id: '7', name: 'Zapatos', slug: 'zapatos', description: 'Zapatos para todas las temporadas', is_active: true, parent_id: null, created_at: '2024-01-07T00:00:00Z', updated_at: '2024-01-07T00:00:00Z' },
];

export const categoryColors = [
  '#EC4899', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#6366F1', '#14B8A6', '#F97316', '#06B6D4',
];
