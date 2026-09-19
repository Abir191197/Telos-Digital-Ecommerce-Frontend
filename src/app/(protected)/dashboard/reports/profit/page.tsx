import type { Metadata } from "next";
import { ProfitReportView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Profit & Margins Report | Admin Portal",
  description: "Track business revenue, product cost of goods, gross profits, and net profit margins.",
};

export default function ProfitReportPage() {
  return <ProfitReportView />;
}
