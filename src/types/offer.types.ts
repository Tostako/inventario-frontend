export type OfferDiscountType = 'percentage' | 'fixed_amount';
export type OfferScope = 'storewide' | 'product' | 'category';
export type OfferStatus = 'active' | 'scheduled' | 'expired';

export interface Offer {
  id: string;
  title: string;
  description?: string | null;
  discount_type: OfferDiscountType;
  discount_value: number;
  scope: OfferScope;
  code?: string | null;
  product_id?: string | null;
  category_id?: string | null;
  product_name?: string | null;
  category_name?: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  status: OfferStatus;
  usage_limit?: number | null;
  usage_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOfferData {
  title: string;
  description?: string;
  discount_type: OfferDiscountType;
  discount_value: number;
  scope: OfferScope;
  code?: string;
  product_id?: string;
  category_id?: string;
  starts_at: string;
  ends_at: string;
  is_active?: boolean;
  usage_limit?: number;
}

export interface UpdateOfferData {
  title?: string;
  description?: string;
  discount_type?: OfferDiscountType;
  discount_value?: number;
  scope?: OfferScope;
  code?: string;
  product_id?: string;
  category_id?: string;
  starts_at?: string;
  ends_at?: string;
  is_active?: boolean;
  usage_limit?: number;
}
