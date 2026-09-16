import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types/order.types";
import type { Product, Category, Brand } from "@/types/ecommerce.types";
import { DEMO_ORDERS } from "@/data/mock-user";
import { RICH_DEMO_ORDERS } from "@/data/rich-orders";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import brandsData from "@/data/brands.json";

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

interface AdminState {
  orders: Order[];
  products: Product[];
  categories: Category[];
  brands: Brand[];
  customers: AdminCustomer[];
  transactions: AdminPaymentTransaction[];
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
  addBrand: (brand: Brand) => void;
  updateBrand: (brandId: string, updates: Partial<Brand>) => void;
  deleteBrand: (brandId: string) => void;
  verifyTransaction: (transactionId: string, status: "verified" | "rejected") => void;
}

type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      orders: RICH_DEMO_ORDERS,
      products: (productsData as unknown as Product[]).slice(0, 30),
      categories: (categoriesData as unknown as Category[]),
      brands: (brandsData as unknown as Brand[]),
      customers: INITIAL_CUSTOMERS,
      transactions: INITIAL_TRANSACTIONS,

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

      addBrand: (newBrand) => {
        set((state) => ({
          brands: [newBrand, ...state.brands],
        }));
      },

      updateBrand: (brandId, updates) => {
        set((state) => ({
          brands: state.brands.map((b) =>
            b.id === brandId ? { ...b, ...updates } : b
          ),
        }));
      },

      deleteBrand: (brandId) => {
        set((state) => ({
          brands: state.brands.filter((b) => b.id !== brandId),
        }));
      },

      verifyTransaction: (transactionId, status) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === transactionId ? { ...t, status } : t
          ),
        }));
      },
    }),
    {
      name: "telos-admin-storage",
    }
  )
);
