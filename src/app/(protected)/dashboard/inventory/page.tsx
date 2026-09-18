import type { Metadata } from "next";
import { AdminInventoryView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Inventory & Stock Management | Admin Portal",
  description:
    "Super Admin real-time stock balances, custom threshold watchlist, and low-inventory alarms.",
};

export default function AdminInventoryPage() {
  return <AdminInventoryView />;
}