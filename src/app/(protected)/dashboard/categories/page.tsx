import type { Metadata } from "next";
import { AdminCategoriesListView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Manage Categories | Admin Portal",
  description: "Manage, edit, and organize store product categories, banner imagery, and catalog hierarchy.",
};

export default function AdminCategoriesPage() {
  return <AdminCategoriesListView />;
}
