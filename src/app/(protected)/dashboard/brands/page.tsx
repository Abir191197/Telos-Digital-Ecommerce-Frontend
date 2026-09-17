import type { Metadata } from "next";
import { AdminBrandsListView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Manage Brands | Admin Portal",
  description: "Official brand partnerships, certified brand emblems, tags, and showcase controls.",
};

export default function AdminBrandsPage() {
  return <AdminBrandsListView />;
}
