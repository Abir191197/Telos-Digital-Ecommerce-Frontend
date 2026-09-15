import type { Metadata } from "next";
import { AdminProductsView, CreateProductView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Manage Products | Admin Portal",
  description: "Comprehensive product inventory management, stock controls, and merchandising workspace.",
};

interface AdminProductsPageProps {
  searchParams: Promise<{
    action?: string;
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

  return <AdminProductsView />;
}
