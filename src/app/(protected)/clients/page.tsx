import type { Metadata } from "next";
import { AdminCustomersView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Customers Directory | Admin Portal",
  description: "View customer accounts, lifetime value, and order history.",
};

export default function AdminClientsPage() {
  return <AdminCustomersView />;
}
