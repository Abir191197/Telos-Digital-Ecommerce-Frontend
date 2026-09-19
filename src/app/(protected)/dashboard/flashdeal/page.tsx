import type { Metadata } from "next";
import { AdminFlashDealsView } from "@/components/admin/deals/AdminFlashDealsView";

export const metadata: Metadata = {
  title: "Flash Deals Management | Admin Dashboard — Telos Cart",
  description:
    "Manage time-limited flash promotions, toggle homepage highlights up to 12 items, and configure live discounts.",
};

export default function AdminFlashDealsPage() {
  return <AdminFlashDealsView />;
}
