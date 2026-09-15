import type { Metadata } from "next";
import { CreateCategoryView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Create Category | Admin Portal",
  description: "Create and organize store product categories, banner imagery, and catalog hierarchy.",
};

export default function AdminCreateCategoryPage() {
  return <CreateCategoryView initialTab="create" />;
}
