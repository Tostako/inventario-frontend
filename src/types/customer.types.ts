export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
  // Computed fields from detail endpoint
  total_orders?: number;
  total_spent?: number;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}
