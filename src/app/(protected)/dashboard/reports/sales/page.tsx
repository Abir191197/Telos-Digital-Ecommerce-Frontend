import type { Metadata } from "next";
import { SalesReportView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Sales & Revenue Performance Report | Admin Portal",
  description: "Executive sales volume, promo discounts, courier charges, and order demand analytics.",
};

export default function SalesReportPage() {
  return <SalesReportView />;
}
