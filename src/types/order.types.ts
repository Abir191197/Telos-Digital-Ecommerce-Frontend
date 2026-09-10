// ── User, Address & Order Types ────────────────────────────
import type { Product } from "./ecommerce.types";

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  area: string;
  city: string; // e.g. "Dhaka", "Chittagong"
  zone: "inside-dhaka" | "outside-dhaka";
  postalCode: string;
  isDefault: boolean;
  label: "Home" | "Office" | "Other";
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productThumbnail: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "TC-84920"
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: "cod" | "bkash" | "nagad" | "upay" | "card";
  paymentStatus: "paid" | "unpaid";
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
}
