import type { Metadata } from "next";
import { CreateBrandView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Brands Management | Admin Portal",
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

  // Handles /dashboard/brands?action=create or default manage view
  if (params.action === "create") {
    return <CreateBrandView />;
  }

  // Fallback to CreateBrandView for now or default brand management
  return <CreateBrandView />;
}
