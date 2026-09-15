import type { Metadata } from "next";
import { AdminProductsView, CreateProductView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Inventory & Catalog | Admin Portal",
  description: "Manage product listings, realtime stock counts, and new items.",
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
