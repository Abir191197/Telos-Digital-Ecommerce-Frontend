import type { Metadata } from "next";
import { AdminCategoriesListView, CreateCategoryView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Manage Categories | Admin Portal",
  description: "Manage, edit, and organize store product categories, banner imagery, and catalog hierarchy.",
};

interface AdminCategoriesPageProps {
  searchParams: Promise<{
    action?: string;
    id?: string;
    edit?: string;
    tab?: string;
  }>;
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const params = await searchParams;

  if (params.action === "create") {
    return <CreateCategoryView initialTab="create" />;
  }

  const editId = params.id || params.edit || (params.action === "edit" ? params.id : undefined);
  if (params.action === "edit" || editId) {
    return <CreateCategoryView categoryId={editId} />;
  }

  return <AdminCategoriesListView />;
}
