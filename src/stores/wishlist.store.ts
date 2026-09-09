// ── Wishlist Store (Zustand + Persist) ──────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/ecommerce.types";

interface WishlistState {
  items: Product[];
}

interface WishlistActions {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => boolean; // returns true if now added, false if removed
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getCount: () => number;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const currentItems = get().items;
        if (!currentItems.some((item) => item.id === product.id)) {
          set({ items: [product, ...currentItems] });
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      toggleItem: (product) => {
        const inWishlist = get().isInWishlist(product.id);
        if (inWishlist) {
          get().removeItem(product.id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ items: [] }),

      getCount: () => get().items.length,
    }),
    {
      name: "telos-wishlist-storage",
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
