import { z } from 'zod';

export const createShopSchema = z.object({
  shop_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  shop_slug: z
    .string()
    .min(2, 'El slug debe tener al menos 2 caracteres')
    .max(50, 'El slug no puede exceder 50 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  shop_email: z
    .string()
    .email('Ingresa un correo válido'),
});

export type CreateShopFormData = z.infer<typeof createShopSchema>;
