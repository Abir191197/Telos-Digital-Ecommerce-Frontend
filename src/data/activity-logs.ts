export type ActivitySeverity = "info" | "success" | "warning" | "danger";

export type ActivityCategory =
  | "auth"
  | "catalog"
  | "orders"
  | "payments"
  | "security"
  | "settings";

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO 8601
  actor: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  action: string;
  entity: string;
  entityId?: string;
  category: ActivityCategory;
  severity: ActivitySeverity;
  details: string;
  ipAddress: string;
  device: string;
  location: string;
}

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "act-101",
    timestamp: "2026-09-16T13:24:00.000Z",
    actor: {
      name: "Super Admin",
      email: "admin@telos.com.bd",
      role: "System Administrator",
    },
    action: "Updated Category",
    entity: "Smartphones & Foldables",
    entityId: "cat-smartphones",
    category: "catalog",
    severity: "info",
    details: "Changed taxonomy banner imagery and adjusted subcategory hierarchies for Q3 campaign.",
    ipAddress: "103.205.180.42",
    device: "Chrome / Windows 11",
    location: "Dhaka, Bangladesh",
  },
  {
    id: "act-102",
    timestamp: "2026-09-16T12:45:10.000Z",
    actor: {
      name: "Operations Lead",
      email: "ops@telos.com.bd",
      role: "Dispatcher",
    },
    action: "Order Status Dispatched",
    entity: "Order #TLS-89241",
    entityId: "TLS-89241",
    category: "orders",
    severity: "success",
    details: "Assigned Steadfast tracking code ST-9912048 and notified customer via automated SMS.",
    ipAddress: "103.205.180.12",
    device: "Firefox / macOS",
    location: "Chittagong Hub, Bangladesh",
  },
  {
    id: "act-103",
    timestamp: "2026-09-16T11:15:30.000Z",
    actor: {
      name: "Finance Desk",
      email: "billing@telos.com.bd",
      role: "Accounts Auditor",
    },
    action: "Verified bKash Payment",
    entity: "Trx #9M48L912K",
    entityId: "trx-9m48l",
    category: "payments",
    severity: "success",
    details: "Reconciled BDT 145,000 against invoice #TLS-88902 with bKash Merchant API gateway.",
    ipAddress: "182.160.119.88",
    device: "Edge / Windows 11",
    location: "Dhaka, Bangladesh",
  },
  {
    id: "act-104",
    timestamp: "2026-09-16T09:30:00.000Z",
    actor: {
      name: "Super Admin",
      email: "admin@telos.com.bd",
      role: "System Administrator",
    },
    action: "Modified Security Policy",
    entity: "Two-Factor Auth Enforcement",
    category: "security",
    severity: "warning",
    details: "Mandatory hardware key / TOTP authentication enabled for all staff roles with inventory write access.",
    ipAddress: "103.205.180.42",
    device: "Chrome / Windows 11",
    location: "Dhaka, Bangladesh",
  },
  {
    id: "act-105",
    timestamp: "2026-09-16T08:12:40.000Z",
    actor: {
      name: "Store Auditor",
      email: "reviews@telos.com.bd",
      role: "Moderator",
    },
    action: "Moderated Customer Review",
    entity: "Samsung Galaxy S26 Ultra Review",
    entityId: "rev-201",
    category: "catalog",
    severity: "info",
    details: "Flagged review marked as verified after confirming customer serial number registration.",
    ipAddress: "118.179.130.22",
    device: "Safari / iOS",
    location: "Sylhet, Bangladesh",
  },
  {
    id: "act-106",
    timestamp: "2026-09-15T19:50:00.000Z",
    actor: {
      name: "Security Sentinel",
      email: "system@telos.com.bd",
      role: "Automated System",
    },
    action: "Blocked Suspicious Login Attempt",
    entity: "Admin Login Portal",
    category: "auth",
    severity: "danger",
    details: "Detected 5 consecutive failed password attempts targeting ops@telos.com.bd from unknown IP.",
    ipAddress: "45.133.1.99",
    device: "Python-requests / Linux",
    location: "Frankfurt, Germany",
  },
  {
    id: "act-107",
    timestamp: "2026-09-15T16:20:15.000Z",
    actor: {
      name: "Super Admin",
      email: "admin@telos.com.bd",
      role: "System Administrator",
    },
    action: "Published New Brand Partner",
    entity: "Brand: Anker Innovations",
    entityId: "brand-anker",
    category: "catalog",
    severity: "success",
    details: "Registered certified partner emblem, official warranty badges, and linked 24 power accessories.",
    ipAddress: "103.205.180.42",
    device: "Chrome / Windows 11",
    location: "Dhaka, Bangladesh",
  },
  {
    id: "act-108",
    timestamp: "2026-09-15T14:05:00.000Z",
    actor: {
      name: "Inventory Manager",
      email: "warehouse@telos.com.bd",
      role: "Stock Controller",
    },
    action: "Stock Inward Adjustment",
    entity: "Sony WH-1000XM6 Headphones",
    entityId: "prod-sony-xm6",
    category: "catalog",
    severity: "info",
    details: "Restocked 50 sealed units into Banani Central Fulfillment Depot. Updated minimum threshold to 10.",
    ipAddress: "103.205.180.70",
    device: "Chrome / Windows 10",
    location: "Dhaka, Bangladesh",
  },
  {
    id: "act-109",
    timestamp: "2026-09-15T10:18:22.000Z",
    actor: {
      name: "Super Admin",
      email: "admin@telos.com.bd",
      role: "System Administrator",
    },
    action: "Updated Store Shipping Rates",
    entity: "Dhaka Express 3-Hour Delivery",
    category: "settings",
    severity: "info",
    details: "Set express courier rate to BDT 120 and added emergency rain delivery surcharge toggle.",
    ipAddress: "103.205.180.42",
    device: "Chrome / Windows 11",
    location: "Dhaka, Bangladesh",
  },
  {
    id: "act-110",
    timestamp: "2026-09-14T22:40:11.000Z",
    actor: {
      name: "Super Admin",
      email: "admin@telos.com.bd",
      role: "System Administrator",
    },
    action: "Admin Profile Password Rotated",
    entity: "admin@telos.com.bd",
    category: "auth",
    severity: "warning",
    details: "Periodic 90-day credentials rotation completed successfully. Revoked 3 inactive device sessions.",
    ipAddress: "103.205.180.42",
    device: "Chrome / Windows 11",
    location: "Dhaka, Bangladesh",
  },
  {
    id: "act-111",
    timestamp: "2026-09-14T17:10:00.000Z",
    actor: {
      name: "Operations Lead",
      email: "ops@telos.com.bd",
      role: "Dispatcher",
    },
    action: "Processed Customer Return",
    entity: "Order #TLS-87910",
    entityId: "TLS-87910",
    category: "orders",
    severity: "warning",
    details: "Item received back in sealed condition; issued BDT 4,200 store credit voucher to user wallet.",
    ipAddress: "103.205.180.12",
    device: "Firefox / macOS",
    location: "Chittagong Hub, Bangladesh",
  },
  {
    id: "act-112",
    timestamp: "2026-09-14T12:00:00.000Z",
    actor: {
      name: "Security Sentinel",
      email: "system@telos.com.bd",
      role: "Automated System",
    },
    action: "SSL Certificate Auto-Renewed",
    entity: "telos.com.bd & api.telos.com.bd",
    category: "security",
    severity: "success",
    details: "Let's Encrypt Wildcard TLS certificate refreshed for 90 days. Valid through Dec 13, 2026.",
    ipAddress: "127.0.0.1",
    device: "Certbot System Daemon",
    location: "Cloud Cluster, Singapore",
  },
];
