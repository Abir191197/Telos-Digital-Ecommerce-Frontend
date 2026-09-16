import type { Metadata } from "next";
import { AdminActivityView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Activity & Audit Logs | Admin Portal",
  description: "Comprehensive immutable system activity, staff authentication, order dispatch, and security logs.",
};

export default function AdminActivityPage() {
  return <AdminActivityView />;
}
