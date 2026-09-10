import type { Metadata } from "next";
import { AdminOrdersView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Orders & Fulfillment | Admin Portal",
  description: "Manage orders, update status, and assign courier logistics.",
};

export default function AdminOrdersPage() {
  return <AdminOrdersView />;
}
