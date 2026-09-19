import type { Metadata } from "next";
import { LowStockReportView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Low-Stock Replenishment Report | Admin Portal",
  description: "Identify exhausted inventory items, forecast deficit units, and estimate reorder funds.",
};

export default function LowStockReportPage() {
  return <LowStockReportView />;
}
