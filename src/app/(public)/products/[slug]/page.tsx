import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProductBySlug, getProductsByCategory } from "@/data";
import { ProductView } from "@/components/product-detail";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Telos Cart",
    };
  }

  return {
    title: `${product.name} | Telos Cart BD`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.thumbnail],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products in the same category excluding the current one
  const relatedProducts = getProductsByCategory(product.categorySlug).filter(
    (p) => p.id !== product.id
  );

  return (
    <ProductView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
