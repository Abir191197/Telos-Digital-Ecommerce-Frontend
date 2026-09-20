import type { Metadata } from "next";
import { ProductDetailView } from "./ProductDetailView";
import { serverFetchProductBySlug } from "@/lib/api/server-fetch";

// ── ISR: Rebuild product pages every 120 seconds ──────────────────────────────
// Price and stock changes propagate within 2 minutes without a full rebuild.
export const revalidate = 120;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Fetch the real product so metadata reflects actual name, description, and image.
  // This ensures Google, WhatsApp, and Facebook previews show real product data.
  const product = await serverFetchProductBySlug(slug);

  if (!product) {
    // Fallback metadata if product is not found
    const formattedTitle = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      title: `${formattedTitle} | TelosCart Bangladesh`,
      description: `Buy genuine ${formattedTitle} online in Bangladesh with official brand warranty and instant Dhaka delivery on TelosCart.`,
    };
  }

  return {
    title: `${product.name} | TelosCart Bangladesh`,
    description:
      product.shortDescription ||
      `Buy genuine ${product.name} online in Bangladesh with official ${product.brand} warranty and fast Dhaka delivery on TelosCart. ৳${product.price.toLocaleString()}.`,
    openGraph: {
      title: `${product.name} | TelosCart Bangladesh`,
      description:
        product.shortDescription ||
        `Buy genuine ${product.name} online in Bangladesh with official ${product.brand} warranty.`,
      images: product.thumbnail
        ? [{ url: product.thumbnail, width: 800, height: 800, alt: product.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | TelosCart Bangladesh`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product server-side so the page renders with data immediately —
  // no skeleton flash, Googlebot sees real content, not a loading placeholder.
  const initialProduct = await serverFetchProductBySlug(slug);

  return <ProductDetailView params={params} initialProduct={initialProduct} />;
}
