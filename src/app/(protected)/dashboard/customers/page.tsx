import type { Metadata } from "next";
import { AdminCustomersView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Customer Directory & Accounts | Admin Portal",
  description: "Inspect customer accounts, addresses, purchase engagement, and moderate statuses.",
};

export default function AdminCustomersPage() {
  return <AdminCustomersView />;
}
