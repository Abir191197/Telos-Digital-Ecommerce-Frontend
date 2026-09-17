import { AdminWishlistsListView } from "@/components/admin/AdminWishlistsListView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Wishlists | Dashboard",
  description: "Monitor and manage customer wishlists and saved items across the platform.",
};

export default function AdminWishlistsPage() {
  return <AdminWishlistsListView />;
}
