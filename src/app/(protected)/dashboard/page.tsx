import type { Metadata } from "next";
import { DashboardOverview } from "@/components/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard | Telos Cart BD",
  description: "Real-time store performance, revenue analytics, and logistics overview.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
