import type { Metadata } from "next";
import { CreateBrandView, AdminBrandsListView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Manage Brands | Admin Portal",
  description: "Official brand partnerships, certified brand emblems, tags, and showcase controls.",
};

interface AdminBrandsPageProps {
  searchParams: Promise<{
    action?: string;
  }>;
}

export default async function AdminBrandsPage({
  searchParams,
}: AdminBrandsPageProps) {
  const params = await searchParams;

  if (params.action === "create") {
    return <CreateBrandView />;
  }

  return <AdminBrandsListView />;
}
