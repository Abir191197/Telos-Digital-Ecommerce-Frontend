import type { Metadata } from "next";
import { AdminPaymentsView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Payments & Reconciliation | Admin Portal",
  description: "Monitor MFS transactions, TrxID verification, and payouts.",
};

export default function AdminPaymentsPage() {
  return <AdminPaymentsView />;
}
