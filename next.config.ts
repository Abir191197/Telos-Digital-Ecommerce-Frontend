import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ── CDN & Remote Image Sources ────────────────────────────────────────────
    // Covers: Cloudflare R2 private buckets, R2 public CDN URLs,
    // Unsplash stock images used in dev, and any arbitrary HTTPS URL
    // an admin may paste into the product image field.
    remotePatterns: [
      // Cloudflare R2 — private bucket (pre-signed or public access)
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      // Cloudflare R2 — public bucket short URLs (pub-xxxx.r2.dev)
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      // Unsplash — dev & placeholder images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Wildcard HTTPS fallback — allows admin-pasted product images from any
      // external CDN or brand website. Next.js still optimizes & re-encodes
      // these through its image optimizer endpoint (/api/_next/image).
      {
        protocol: "https",
        hostname: "**",
      },
      // Wildcard HTTP fallback — covers admin-pasted http:// URLs
      // (e.g. local dev servers, brand sites without SSL, or any plain-http CDN).
      {
        protocol: "http",
        hostname: "**",
      },
    ],

    // ── Format Optimization ───────────────────────────────────────────────────
    // Serve AVIF first (best compression), fall back to WebP, then original.
    // Reduces image payload by 40–70% vs JPEG on modern browsers.
    formats: ["image/avif", "image/webp"],

    // ── Responsive Breakpoints ────────────────────────────────────────────────
    // Aligns with Tailwind breakpoints (sm=640, md=768, lg=1024, xl=1280, 2xl=1536).
    // Used by Next.js to decide which srcset candidate to generate.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // ── Cache TTL ─────────────────────────────────────────────────────────────
    // Keep optimized images in the Next.js image cache for 30 days.
    // Cloudflare / Vercel edge will further cache at CDN layer.
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days in seconds
  },

  async redirects() {
    return [
      {
        source: "/tracking",
        destination: "/track-order",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
