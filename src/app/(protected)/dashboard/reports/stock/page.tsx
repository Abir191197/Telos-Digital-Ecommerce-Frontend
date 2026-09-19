import type { Metadata } from "next";
import { StockReportView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Stock Valuation Report | Admin Portal",
  description: "Audit current warehouse inventory, cost valuation, and potential retail return.",
};

export default function StockReportPage() {
  return <StockReportView />;
}
