export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url?: string | null;
  is_active: boolean;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  is_active?: boolean;
  parent_id?: string | null;
  image?: File;
}
