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

export const INITIAL_CUSTOMER_CARTS: AdminCustomerCart[] = [
  {
    id: "cart-001",
    customerId: "cust-001",
    customerName: "Rahim Ahmed",
    customerEmail: "rahim.ahmed@example.com",
    customerPhone: "+880 1712-345678",
    city: "Dhaka",
    itemsCount: 3,
    subtotal: 219999,
    updatedAt: "2026-09-16T13:35:00.000Z", // 15 mins ago
    status: "active",
    appliedCoupon: "TELOS10",
    items: [
      {
        productId: "prod-1",
        productName: "Samsung Galaxy S26 Ultra 512GB",
        productThumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80",
        price: 189999,
        quantity: 1,
        variantName: "Titanium Gray / 512GB",
      },
      {
        productId: "prod-12",
        productName: "Anker 65W GaN Fast Charger",
        productThumbnail: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80",
        price: 4500,
        quantity: 2,
        variantName: "Midnight Black",
      },
      {
        productId: "prod-15",
        productName: "Spigen Liquid Air Armor Case",
        productThumbnail: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=400&q=80",
        price: 2500,
        quantity: 1,
        variantName: "Matte Black",
      },
    ],
  },
  {
    id: "cart-002",
    customerId: "cust-002",
    customerName: "Tanvir Hossain",
    customerEmail: "tanvir.h@gmail.com",
    customerPhone: "+880 1819-223344",
    city: "Chittagong",
    itemsCount: 1,
    subtotal: 36999,
    updatedAt: "2026-09-16T13:42:00.000Z", // 8 mins ago
    status: "active",
    items: [
      {
        productId: "prod-4",
        productName: "Sony WH-1000XM6 Wireless ANC",
        productThumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
        price: 36999,
        quantity: 1,
        variantName: "Silver Platinum",
      },
    ],
  },
  {
    id: "cart-003",
    customerId: "cust-003",
    customerName: "Nusrat Jahan",
    customerEmail: "nusrat.j@yahoo.com",
    customerPhone: "+880 1911-556677",
    city: "Dhaka",
    itemsCount: 2,
    subtotal: 94500,
    updatedAt: "2026-09-16T08:15:00.000Z", // 5.5 hours ago -> Abandoned
    status: "abandoned",
    items: [
      {
        productId: "prod-2",
        productName: "Apple Watch Ultra 2 GPS + Cellular",
        productThumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
        price: 89500,
        quantity: 1,
        variantName: "Titanium Case / Trail Loop",
      },
      {
        productId: "prod-21",
        productName: "Belkin 3-in-1 MagSafe Wireless Pad",
        productThumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=400&q=80",
        price: 5000,
        quantity: 1,
        variantName: "White",
      },
    ],
  },
  {
    id: "cart-004",
    customerId: "cust-004",
    customerName: "Farhan Kabir",
    customerEmail: "farhan.k@techbd.com",
    customerPhone: "+880 1622-778899",
    city: "Sylhet",
    itemsCount: 4,
    subtotal: 154000,
    updatedAt: "2026-09-16T04:20:00.000Z", // ~9 hours ago -> Abandoned
    status: "abandoned",
    appliedCoupon: "WELCOME500",
    items: [
      {
        productId: "prod-3",
        productName: "MacBook Air 15-inch M3 Chip 16GB",
        productThumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
        price: 148000,
        quantity: 1,
        variantName: "Midnight / 512GB",
      },
      {
        productId: "prod-18",
        productName: "Logitech MX Master 3S Performance Mouse",
        productThumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80",
        price: 6000,
        quantity: 1,
        variantName: "Graphite Black",
      },
    ],
  },
  {
    id: "cart-005",
    customerId: "cust-005",
    customerName: "Sadia Rahman",
    customerEmail: "sadia.r@outlook.com",
    customerPhone: "+880 1733-445566",
    city: "Dhaka",
    itemsCount: 1,
    subtotal: 18500,
    updatedAt: "2026-09-15T18:30:00.000Z", // Recovered (customer checked out after nudge)
    status: "recovered",
    items: [
      {
        productId: "prod-9",
        productName: "Marshall Emberton II Portable Bluetooth Speaker",
        productThumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80",
        price: 18500,
        quantity: 1,
        variantName: "Black and Brass",
      },
    ],
  },
  {
    id: "cart-006",
    customerId: "cust-006",
    customerName: "Mehedi Hasan",
    customerEmail: "mehedi.h@northsouth.edu",
    customerPhone: "+880 1552-889900",
    city: "Dhaka",
    itemsCount: 2,
    subtotal: 48200,
    updatedAt: "2026-09-16T13:20:00.000Z", // 30 mins ago
    status: "active",
    items: [
      {
        productId: "prod-7",
        productName: "Keychron Q1 Pro Custom Mechanical Keyboard",
        productThumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80",
        price: 24500,
        quantity: 1,
        variantName: "Banana Switches / Carbon Black",
      },
      {
        productId: "prod-8",
        productName: "Razer DeathAdder V3 Pro Wireless",
        productThumbnail: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80",
        price: 23700,
        quantity: 1,
        variantName: "White Edition",
      },
    ],
  },
];
