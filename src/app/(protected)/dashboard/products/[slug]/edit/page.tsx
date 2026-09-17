import type { Metadata } from "next";
import { CreateProductView } from "@/components/admin/products";

export const metadata: Metadata = {
  title: "Edit Product | Admin Portal",
  description: "Update catalog item pricing, stock levels, variants, and product images.",
};

interface EditProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = await params;
  return <CreateProductView productSlug={slug} />;
}
