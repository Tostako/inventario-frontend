export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number?: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  items: OrderItem[];
  subtotal?: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  payment_method?: string;
  payment_status?: string;
  notes?: string;
  shipping_address?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  notes?: string;
}

export interface OrderTimelineEntry {
  id: string;
  status: OrderStatus;
  description: string;
  timestamp: string;
  user_name: string;
}
