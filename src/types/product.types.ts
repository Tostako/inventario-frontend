export type ProductStatus = 'active' | 'inactive' | 'low_stock';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category_id: string;
  supplier_id?: string | null;
  price: number;
  cost: number;
  stock: number;
  stock_min: number;
  stock_max?: number | null;
  unit: string;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // computed by frontend for display
  category?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  stock_min: number;
  unit: string;
  category_id: string;
  is_active: boolean;
  image?: File;
}
