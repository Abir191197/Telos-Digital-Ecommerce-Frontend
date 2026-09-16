import type { Metadata } from "next";
import { CreateBrandView, AdminBrandsListView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Manage Brands | Admin Portal",
  description: "Official brand partnerships, certified brand emblems, tags, and showcase controls.",
};

interface AdminBrandsPageProps {
  searchParams: Promise<{
    action?: string;
    id?: string;
    edit?: string;
  }>;
}

export default async function AdminBrandsPage({
  searchParams,
}: AdminBrandsPageProps) {
  const params = await searchParams;

  if (params.action === "create") {
    return <CreateBrandView />;
  }

  const editId = params.id || params.edit || (params.action === "edit" ? params.id : undefined);
  if (params.action === "edit" || editId) {
    return <CreateBrandView brandId={editId} />;
  }

  return <AdminBrandsListView />;
}
