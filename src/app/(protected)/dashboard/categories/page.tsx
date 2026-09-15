import type { Metadata } from "next";
import { CreateCategoryView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Categories & Taxonomies | Admin Portal",
  description: "Create and organize store product categories, banner imagery, and catalog hierarchy.",
};

interface AdminCategoriesPageProps {
  searchParams: Promise<{
    action?: string;
    view?: string;
    tab?: string;
  }>;
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const params = await searchParams;

  const initialTab = params.view === "list" ? "list" : "create";

  return <CreateCategoryView initialTab={initialTab} />;
}
