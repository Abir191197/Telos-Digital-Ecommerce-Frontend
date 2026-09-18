import type { Metadata } from "next";
import { ProductDetailView } from "./ProductDetailView";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} | TelosCart Bangladesh`,
    description: `Buy genuine ${formattedTitle} online in Bangladesh with official brand warranty and instant Dhaka delivery on TelosCart.`,
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  return <ProductDetailView params={params} />;
}
