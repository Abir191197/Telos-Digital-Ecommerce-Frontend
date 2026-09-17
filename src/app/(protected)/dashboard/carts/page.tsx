import { AdminCartsListView } from "@/components/admin/AdminCartsListView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Carts | Dashboard",
  description: "Monitor and manage all active customer shopping carts across the platform.",
};

export default function AdminCartsPage() {
  return <AdminCartsListView />;
}
