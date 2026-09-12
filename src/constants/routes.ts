// ── Application Route Constants ────────────────────────

export const ROUTES = {
  // Public
  HOME: "/",
  CATEGORIES: "/categories",
  CATEGORY_DETAIL: (slug: string) => `/categories/${slug}`,
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  FLASH_DEALS: "/flash-deals",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS: "/terms-and-conditions",
  CART: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: "/checkout/success",
  TRACK_ORDER: "/track-order",
  TRACKING: "/track-order",
  WISHLIST: "/wishlist",
  ACCOUNT: "/account",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Protected
  DASHBOARD: "/dashboard",
  CLIENTS: "/clients",
  PAYMENTS: "/payments",
  REPORTS: "/reports",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  ACCOUNT_HUB: "/account",
  SETTINGS: "/settings",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.CATEGORIES,
  ROUTES.PRODUCTS,
  ROUTES.FLASH_DEALS,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.PRIVACY_POLICY,
  ROUTES.TERMS,
  ROUTES.CART,
  ROUTES.CHECKOUT,
  ROUTES.CHECKOUT_SUCCESS,
  ROUTES.TRACK_ORDER,
  ROUTES.WISHLIST,
] as const;

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.CLIENTS,
  ROUTES.PAYMENTS,
  ROUTES.REPORTS,
  ROUTES.NOTIFICATIONS,
  ROUTES.PROFILE,
  ROUTES.ACCOUNT_HUB,
  ROUTES.SETTINGS,
] as const;
