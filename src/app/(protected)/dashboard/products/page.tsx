import type { Metadata } from "next";
import { AdminProductsView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Manage Products | Admin Portal",
  description: "Comprehensive product inventory management, stock controls, and merchandising workspace.",
};

export default function AdminProductsPage() {
  return <AdminProductsView />;
}
