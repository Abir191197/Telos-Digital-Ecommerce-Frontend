// ── Application Configuration & Constants ───────────────

const PROD_API_URL =
  "https://api-telos-digital-ecommerce-backend.vercel.app/api/v1";
const LOCAL_API_URL = "http://localhost:5001/api/v1";

const normalizeApiUrl = (url?: string): string => {
  if (!url || !url.trim()) {
    // Default to hosted cloud backend so the frontend works standalone out-of-the-box
    // without requiring a local backend or database. To use local backend, set NEXT_PUBLIC_API_URL in .env.local
    return PROD_API_URL;
  }

  const cleanUrl = url.trim().replace(/\/+$/, "");

  // If already ending in /api/v1 or /api/v2, return clean URL
  if (cleanUrl.endsWith("/api/v1") || cleanUrl.endsWith("/api/v2")) {
    return cleanUrl;
  }

  // If ends with /api, append /v1
  if (cleanUrl.endsWith("/api")) {
    return `${cleanUrl}/v1`;
  }

  // Otherwise append /api/v1
  return `${cleanUrl}/api/v1`;
};

export const Config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Telos Cart",
  appUrl:
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://www.teloscart.website"
      : "http://localhost:3000"),
  apiUrl: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL),
} as const;

// Backward-compatible named exports
export const APP_NAME = Config.appName;
export const APP_URL = Config.appUrl;
export const API_URL = Config.apiUrl;


