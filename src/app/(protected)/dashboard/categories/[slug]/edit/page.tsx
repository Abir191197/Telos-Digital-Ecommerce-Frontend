import type { Metadata } from "next";
import { CreateCategoryView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Edit Category | Admin Portal",
  description: "Edit category details, image, icon, homepage visibility, and subcategories.",
};

interface EditCategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { slug } = await params;
  return <CreateCategoryView initialTab="create" categorySlug={slug} />;
}
