import type { Metadata } from "next";
import { ReportsOverviewView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Reports & Analytics | Admin Portal",
  description: "Executive e-commerce analytics, profit margins, stock valuation, and transaction audits.",
};

export default function ReportsOverviewPage() {
  return <ReportsOverviewView />;
}
