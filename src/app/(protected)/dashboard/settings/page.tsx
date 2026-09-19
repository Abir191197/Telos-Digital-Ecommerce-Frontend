import type { Metadata } from "next";
import { AdminComingSoonView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Store Settings | Store Administration",
  description: "Configure store profile, shipping policies, tax, and staff permissions.",
};

export default function SettingsDashboardPage() {
  return (
    <AdminComingSoonView
      title="Store Settings & Configuration"
      category="Store Administration"
      description="Store profile, delivery fee policies, tax/currency brackets, and staff role permissions will be available in Release 2.0."
    />
  );
}
