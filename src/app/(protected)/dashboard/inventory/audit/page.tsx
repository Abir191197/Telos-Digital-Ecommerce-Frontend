import type { Metadata } from "next";
import { AdminInventoryAuditView } from "@/components/admin/inventory/audit";

export const metadata: Metadata = {
  title: "Stock Audit Logs | Admin Portal",
  description: "Chronological immutable record of warehouse stock adjustments.",
};

export default function InventoryAuditPage() {
  return <AdminInventoryAuditView />;
}
