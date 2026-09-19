import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types/order.types";
import type { Product, Category } from "@/types/ecommerce.types";


export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  city: string;
  status: "active" | "vip" | "blocked";
}

export interface AdminPaymentTransaction {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  method: "bkash" | "nagad" | "card" | "cod";
  trxId?: string;
  amount: number;
  date: string;
  status: "verified" | "pending_verification" | "rejected";
}

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  productSlug?: string;
  productThumbnail: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  status: "published" | "hidden" | "flagged";
  helpfulCount?: number;
}

interface AdminState {
  orders: Order[];
  products: Product[];
  categories: Category[];
  customers: AdminCustomer[];
  transactions: AdminPaymentTransaction[];
  reviews: AdminReview[];
}

interface AdminActions {
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignCourierTracking: (orderId: string, courierName: string, trackingNumber: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  verifyTransaction: (transactionId: string, status: "verified" | "rejected") => void;
  toggleReviewVisibility: (reviewId: string, status?: "published" | "hidden" | "flagged") => void;
  deleteReview: (reviewId: string) => void;
}

type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      orders: [] as Order[],
      products: [] as Product[],
      categories: [] as Category[],
      customers: [] as AdminCustomer[],
      transactions: [] as AdminPaymentTransaction[],
      reviews: [] as AdminReview[],

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId || o.orderNumber === orderId
              ? { ...o, status }
              : o
          ),
        }));
      },

      assignCourierTracking: (orderId, courierName, trackingNumber) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId || o.orderNumber === orderId
              ? { ...o, courierName, trackingNumber, status: "shipped" }
              : o
          ),
        }));
      },

      updateProductStock: (productId, newStock) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  stock: Math.max(0, newStock),
                  inStock: newStock > 0,
                }
              : p
          ),
        }));
      },

      addProduct: (newProduct) => {
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
      },

      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },

      addCategory: (newCategory) => {
        set((state) => ({
          categories: [newCategory, ...state.categories],
        }));
      },

      updateCategory: (categoryId, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCategory: (categoryId) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== categoryId),
        }));
      },

      verifyTransaction: (transactionId, status) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === transactionId ? { ...t, status } : t
          ),
        }));
      },

      toggleReviewVisibility: (reviewId, status) => {
        set((state) => ({
          reviews: state.reviews.map((r) => {
            if (r.id !== reviewId) return r;
            const newStatus =
              status || (r.status === "hidden" ? "published" : "hidden");
            return { ...r, status: newStatus };
          }),
        }));
      },

      deleteReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== reviewId),
        }));
      },
    }),
    {
      name: "telos-admin-storage",
    }
  )
);
