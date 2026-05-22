import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es muy largo'),
  description: z.string().max(500, 'La descripción es muy larga'),
  sku: z.string().min(1, 'El SKU es requerido').max(20, 'El SKU es muy largo'),
  price: z.coerce.number().min(100, 'El precio mínimo es $100').max(999999999, 'El precio es muy alto'),
  cost: z.coerce.number().min(0, 'El costo no puede ser negativo').max(999999999, 'El costo es muy alto'),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
  stock_min: z.coerce.number().int().min(0, 'El stock mínimo no puede ser negativo'),
  unit: z.string().min(1, 'La unidad es requerida'),
  category_id: z.string().min(1, 'La categoría es requerida'),
  is_active: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;
