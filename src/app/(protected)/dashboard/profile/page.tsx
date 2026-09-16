import type { Metadata } from "next";
import { AdminProfileView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Admin Profile & Security | Telos Dashboard",
  description: "Manage admin credentials, profile and security settings.",
};

export default function DashboardProfilePage() {
  return <AdminProfileView />;
}
