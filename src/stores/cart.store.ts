// ── Cart Store (Zustand + Persist) ──────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "@/types/ecommerce.types";
import type { CartItem, CouponDiscount } from "@/types/cart.types";

export const FREE_SHIPPING_THRESHOLD = 5000; // Free delivery above ৳5,000 in BD
export const STANDARD_SHIPPING_FEE = 120; // ৳120 flat delivery fee

// Valid demo promo coupons for client simulation
export const AVAILABLE_COUPONS: Record<string, CouponDiscount> = {
  TELOS10: {
    code: "TELOS10",
    percentage: 10,
    minOrderAmount: 2000,
    description: "10% Instant Discount on orders over ৳2,000",
  },
  WELCOME500: {
    code: "WELCOME500",
    fixedAmount: 500,
    minOrderAmount: 5000,
    description: "৳500 Flat Off on first order over ৳5,000",
  },
  FREESHIP: {
    code: "FREESHIP",
    fixedAmount: STANDARD_SHIPPING_FEE,
    description: "Free Delivery Coupon",
  },
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: CouponDiscount | null;
  couponError: string | null;
}

interface CartActions {
  // Drawer controls
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Item mutations
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Promo code
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Derived calculations
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getFreeShippingRemaining: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,
      couponError: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1, variant) => {
        const lineItemId = variant ? `${product.id}-${variant.id}` : product.id;
        const unitPrice = variant ? variant.price : product.price;
        const maxStock = product.stock || 0;
        if (maxStock <= 0) return;

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.id === lineItemId);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const currentQty = updatedItems[existingIndex].quantity;
          const cappedQty = Math.min(maxStock, currentQty + quantity);
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: cappedQty,
            subtotal: cappedQty * unitPrice,
          };
          set({ items: updatedItems, isOpen: true });
        } else {
          const cappedQty = Math.min(maxStock, quantity);
          const newItem: CartItem = {
            id: lineItemId,
            product,
            variant,
            quantity: cappedQty,
            unitPrice,
            subtotal: cappedQty * unitPrice,
            addedAt: new Date().toISOString(),
          };
          set({ items: [newItem, ...currentItems], isOpen: true });
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item;
            const maxStock = item.product.stock || 1;
            const finalQty = Math.min(maxStock, quantity);
            return {
              ...item,
              quantity: finalQty,
              subtotal: finalQty * item.unitPrice,
            };
          }),
        }));
      },

      clearCart: () => set({ items: [], appliedCoupon: null, couponError: null }),

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const coupon = AVAILABLE_COUPONS[cleanCode];

        if (!coupon) {
          set({ couponError: "Invalid promo code" });
          return false;
        }

        const subtotal = get().getSubtotal();
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          set({
            couponError: `Order minimum of ৳${coupon.minOrderAmount.toLocaleString()} required`,
          });
          return false;
        }

        set({ appliedCoupon: coupon, couponError: null });
        return true;
      },

      removeCoupon: () => set({ appliedCoupon: null, couponError: null }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.subtotal, 0);
      },

      getDiscountAmount: () => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;

        const subtotal = get().getSubtotal();
        if (appliedCoupon.percentage) {
          return Math.round((subtotal * appliedCoupon.percentage) / 100);
        }
        if (appliedCoupon.fixedAmount) {
          return Math.min(appliedCoupon.fixedAmount, subtotal);
        }
        return 0;
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        if (get().appliedCoupon?.code === "FREESHIP") return 0;
        return STANDARD_SHIPPING_FEE;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },

      getFreeShippingRemaining: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
      },
    }),
    {
      name: "telos-cart-storage",
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);
