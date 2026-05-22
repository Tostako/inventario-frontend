import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Shop } from '@/types';

interface TenantStore {
  shop: Shop | null;
  shopId: string | null;
  setShop: (shop: Shop) => void;
  clearShop: () => void;
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      shop: null,
      shopId: null,
      setShop: (shop) => set({ shop, shopId: shop.id }),
      clearShop: () => set({ shop: null, shopId: null }),
    }),
    {
      name: 'tenant-storage',
    }
  )
);
