import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types/order.types";
import type { Product, Category } from "@/types/ecommerce.types";
import { DEMO_ORDERS } from "@/data/mock-user";
import { RICH_DEMO_ORDERS } from "@/data/rich-orders";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";

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

const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: "cust-001",
    name: "Rahim Ahmed",
    email: "rahim.ahmed@example.com",
    phone: "+880 1712-345678",
    ordersCount: 3,
    totalSpent: 322699,
    lastOrderDate: "2026-09-09T18:10:00.000Z",
    city: "Dhaka",
    status: "vip",
  },
  {
    id: "cust-002",
    name: "Tanvir Hossain",
    email: "tanvir.h@gmail.com",
    phone: "+880 1819-223344",
    ordersCount: 2,
    totalSpent: 84500,
    lastOrderDate: "2026-09-08T12:30:00.000Z",
    city: "Chittagong",
    status: "active",
  },
  {
    id: "cust-003",
    name: "Nusrat Jahan",
    email: "nusrat.j@yahoo.com",
    phone: "+880 1911-556677",
    ordersCount: 1,
    totalSpent: 184999,
    lastOrderDate: "2026-09-05T14:15:00.000Z",
    city: "Dhaka",
    status: "active",
  },
  {
    id: "cust-004",
    name: "Farhan Kabir",
    email: "farhan.k@techbd.com",
    phone: "+880 1622-778899",
    ordersCount: 4,
    totalSpent: 142000,
    lastOrderDate: "2026-09-04T09:20:00.000Z",
    city: "Sylhet",
    status: "vip",
  },
  {
    id: "cust-005",
    name: "Sadia Rahman",
    email: "sadia.r@outlook.com",
    phone: "+880 1733-445566",
    ordersCount: 1,
    totalSpent: 12500,
    lastOrderDate: "2026-09-01T16:40:00.000Z",
    city: "Khulna",
    status: "active",
  },
];

const INITIAL_TRANSACTIONS: AdminPaymentTransaction[] = [
  {
    id: "txn-001",
    orderNumber: "TC-93821",
    customerName: "Rahim Ahmed",
    customerPhone: "+880 1712-345678",
    method: "bkash",
    trxId: "BK9J4829K1",
    amount: 96500,
    date: "2026-09-09T18:12:00.000Z",
    status: "verified",
  },
  {
    id: "txn-002",
    orderNumber: "TC-92144",
    customerName: "Rahim Ahmed",
    customerPhone: "+880 1712-345678",
    method: "cod",
    amount: 42200,
    date: "2026-09-07T11:45:00.000Z",
    status: "pending_verification",
  },
  {
    id: "txn-003",
    orderNumber: "TC-84920",
    customerName: "Rahim Ahmed",
    customerPhone: "+880 1712-345678",
    method: "bkash",
    trxId: "BK8H1928X9",
    amount: 183999,
    date: "2026-09-02T14:22:00.000Z",
    status: "verified",
  },
  {
    id: "txn-004",
    orderNumber: "TC-77192",
    customerName: "Tanvir Hossain",
    customerPhone: "+880 1819-223344",
    method: "nagad",
    trxId: "NG7L88390A",
    amount: 54000,
    date: "2026-09-08T12:35:00.000Z",
    status: "verified",
  },
  {
    id: "txn-005",
    orderNumber: "TC-66201",
    customerName: "Farhan Kabir",
    customerPhone: "+880 1622-778899",
    method: "card",
    trxId: "SSL-BD-99120",
    amount: 38500,
    date: "2026-09-04T09:25:00.000Z",
    status: "verified",
  },
  {
    id: "txn-006",
    orderNumber: "TC-55102",
    customerName: "Sadia Rahman",
    customerPhone: "+880 1733-445566",
    method: "bkash",
    trxId: "BK4M9901Z2",
    amount: 12500,
    date: "2026-09-01T16:42:00.000Z",
    status: "verified",
  },
  {
    id: "txn-007",
    orderNumber: "TC-48911",
    customerName: "Mahmud Hasan",
    customerPhone: "+880 1912-334455",
    method: "nagad",
    trxId: "NG8K2210P4",
    amount: 28400,
    date: "2026-08-30T10:15:00.000Z",
    status: "pending_verification",
  },
  {
    id: "txn-008",
    orderNumber: "TC-44021",
    customerName: "Ayesha Siddiqua",
    customerPhone: "+880 1823-998877",
    method: "card",
    trxId: "STRIPE-CH-88210",
    amount: 67200,
    date: "2026-08-28T14:50:00.000Z",
    status: "verified",
  },
  {
    id: "txn-009",
    orderNumber: "TC-39810",
    customerName: "Imran Hossain",
    customerPhone: "+880 1711-002233",
    method: "cod",
    amount: 19800,
    date: "2026-08-26T18:05:00.000Z",
    status: "pending_verification",
  },
  {
    id: "txn-010",
    orderNumber: "TC-33219",
    customerName: "Tasnim Anjum",
    customerPhone: "+880 1623-112233",
    method: "bkash",
    trxId: "BK1Z7729Q0",
    amount: 45000,
    date: "2026-08-24T11:30:00.000Z",
    status: "rejected",
  },
  {
    id: "txn-011",
    orderNumber: "TC-29104",
    customerName: "Sabbir Ahmed",
    customerPhone: "+880 1512-445566",
    method: "nagad",
    trxId: "NG3X8812Y5",
    amount: 112000,
    date: "2026-08-21T15:20:00.000Z",
    status: "verified",
  },
  {
    id: "txn-012",
    orderNumber: "TC-25410",
    customerName: "Kazi Nayeem",
    customerPhone: "+880 1914-778899",
    method: "card",
    trxId: "SSL-BD-77312",
    amount: 83500,
    date: "2026-08-18T09:10:00.000Z",
    status: "verified",
  },
];

const INITIAL_ADMIN_REVIEWS: AdminReview[] = [
  {
    id: "rev-001",
    productId: "prod-0001",
    productName: "Apple iPhone 16 Pro Max 256GB",
    productThumbnail:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    customerName: "Rahim Ahmed",
    customerEmail: "rahim.ahmed@example.com",
    rating: 5,
    title: "Exceptional flagship smartphone",
    comment:
      "Original BTRC approved official device. Delivery took less than 24 hours inside Dhaka with Steadfast courier. Camera sharpness, titanium finish, and battery backup are second to none!",
    date: "2026-09-09T18:15:00.000Z",
    verifiedPurchase: true,
    status: "published",
    helpfulCount: 24,
  },
  {
    id: "rev-002",
    productId: "prod-0002",
    productName: "Samsung Galaxy S24 Ultra 512GB",
    productThumbnail:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    customerName: "Tanvir Hossain",
    customerEmail: "tanvir.h@gmail.com",
    rating: 4,
    title: "Awesome display and stylus",
    comment:
      "Display is remarkably anti-reflective in sunlight. S-Pen latency is virtually zero. Packaging was nicely bubbled. Deducted 1 star because DHL took 3 days instead of 2.",
    date: "2026-09-08T14:30:00.000Z",
    verifiedPurchase: true,
    status: "published",
    helpfulCount: 12,
  },
  {
    id: "rev-003",
    productId: "prod-0004",
    productName: "Sony WH-1000XM5 Wireless Headphones",
    productThumbnail:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    customerName: "Spam Bot 99",
    customerEmail: "cheap-deals@promo-xyz.biz",
    rating: 1,
    title: "VISIT MY SITE FOR CHEAP PHONES",
    comment:
      "Go to www.fake-discount-store.com for 90% discount on all Apple products and free vouchers! Call 017000000 now!",
    date: "2026-09-07T09:12:00.000Z",
    verifiedPurchase: false,
    status: "hidden",
    helpfulCount: 0,
  },
  {
    id: "rev-004",
    productId: "prod-0003",
    productName: "Apple MacBook Pro 16\" M3 Max",
    productThumbnail:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    customerName: "Nusrat Jahan",
    customerEmail: "nusrat.j@yahoo.com",
    rating: 5,
    title: "Unmatched performance for rendering",
    comment:
      "4K video exports in DaVinci Resolve render in real-time without fan noise. Authentic Apple warranty verified directly with support. Very pleased with Telos customer service.",
    date: "2026-09-05T16:20:00.000Z",
    verifiedPurchase: true,
    status: "published",
    helpfulCount: 18,
  },
  {
    id: "rev-005",
    productId: "prod-0005",
    productName: "Apple Watch Ultra 2 GPS + Cellular",
    productThumbnail:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    customerName: "Farhan Kabir",
    customerEmail: "farhan.k@techbd.com",
    rating: 2,
    title: "Box seal arrived torn",
    comment:
      "The outer brown carton was fine, but the official retail box seal was cut. Watch itself has no scratches and battery cycles are zero, but seller must ensure tamper-proof seals are intact.",
    date: "2026-09-04T11:45:00.000Z",
    verifiedPurchase: true,
    status: "flagged",
    helpfulCount: 6,
  },
  {
    id: "rev-006",
    productId: "prod-0006",
    productName: "Sony PlayStation 5 Slim Digital",
    productThumbnail:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    customerName: "Sabbir Ahmed",
    customerEmail: "sabbir.ahmed@gmail.com",
    rating: 5,
    title: "Superb gaming console",
    comment:
      "DualSense haptic feedback is truly next level. Fast delivery to Sylhet within 48 hours. Genuine box with official power cable and HDMI 2.1 cable included.",
    date: "2026-09-02T19:00:00.000Z",
    verifiedPurchase: true,
    status: "published",
    helpfulCount: 9,
  },
  {
    id: "rev-007",
    productId: "prod-0001",
    productName: "Apple iPhone 16 Pro Max 256GB",
    productThumbnail:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    customerName: "Sadia Rahman",
    customerEmail: "sadia.r@outlook.com",
    rating: 5,
    title: "Dessert Titanium is gorgeous",
    comment:
      "The color looks even better in natural light. Smooth transaction via bKash gateway. Everything matches catalog specs.",
    date: "2026-08-31T12:10:00.000Z",
    verifiedPurchase: true,
    status: "published",
    helpfulCount: 14,
  },
];

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
      orders: RICH_DEMO_ORDERS,
      products: (productsData as unknown as Product[]).slice(0, 30),
      categories: (categoriesData as unknown as Category[]),
      customers: INITIAL_CUSTOMERS,
      transactions: INITIAL_TRANSACTIONS,
      reviews: INITIAL_ADMIN_REVIEWS,

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
