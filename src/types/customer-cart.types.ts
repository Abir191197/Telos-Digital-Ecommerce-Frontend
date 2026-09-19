export type CustomerCartStatus = "active" | "abandoned" | "recovered";

export interface CustomerCartItem {
  productId: string;
  productName: string;
  productThumbnail: string;
  price: number;
  quantity: number;
  variantName?: string;
}

export interface AdminCustomerCart {
  id: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  city: string;
  itemsCount: number;
  subtotal: number;
  updatedAt: string; // ISO 8601
  status: CustomerCartStatus;
  appliedCoupon?: string;
  items: CustomerCartItem[];
}
