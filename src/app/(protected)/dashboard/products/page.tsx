import type { Metadata } from "next";
import { AdminProductsView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Inventory & Catalog | Admin Portal",
  description: "Manage product listings, realtime stock counts, and new items.",
};

export default function AdminProductsPage() {
  return <AdminProductsView />;
}
