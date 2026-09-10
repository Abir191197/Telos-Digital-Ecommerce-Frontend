// ── Recently Viewed Store (Zustand + Persist) ──────────
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/ecommerce.types";

const MAX_RECENT_ITEMS = 12;

interface RecentlyViewedState {
  items: Product[];
}

interface RecentlyViewedActions {
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearAll: () => void;
}

type RecentlyViewedStore = RecentlyViewedState & RecentlyViewedActions;

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (product: Product) => {
        const currentItems = get().items;
        // Filter out existing occurrence to push to front
        const filtered = currentItems.filter((p) => p.id !== product.id);
        const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);
        set({ items: updated });
      },

      removeProduct: (productId: string) => {
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        }));
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: "telos-recently-viewed-storage",
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
