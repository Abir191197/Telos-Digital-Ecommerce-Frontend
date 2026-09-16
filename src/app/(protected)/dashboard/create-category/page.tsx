import type { Metadata } from "next";
import { CreateCategoryView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Create Category | Admin Portal",
  description: "Create and organize store product categories, banner imagery, and catalog hierarchy.",
};

interface AdminCreateCategoryPageProps {
  searchParams?: Promise<{
    id?: string;
    edit?: string;
  }>;
}

export default async function AdminCreateCategoryPage({
  searchParams,
}: AdminCreateCategoryPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const categoryId = params?.id || params?.edit;
  return <CreateCategoryView initialTab="create" categoryId={categoryId} />;
}
