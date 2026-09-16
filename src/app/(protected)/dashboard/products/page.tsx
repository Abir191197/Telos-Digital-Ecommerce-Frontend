import type { Metadata } from "next";
import { AdminProductsView, CreateProductView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Manage Products | Admin Portal",
  description: "Comprehensive product inventory management, stock controls, and merchandising workspace.",
};

interface AdminProductsPageProps {
  searchParams: Promise<{
    action?: string;
    id?: string;
    edit?: string;
    tab?: string;
    view?: string;
  }>;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;

  if (params.action === "create") {
    return <CreateProductView />;
  }

  const editId = params.id || params.edit || (params.action === "edit" ? params.id : undefined);
  if (params.action === "edit" || editId) {
    return <CreateProductView productId={editId} />;
  }

  return <AdminProductsView />;
}

