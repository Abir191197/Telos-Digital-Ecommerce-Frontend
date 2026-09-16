import type { Metadata } from "next";
import { AdminReviewsView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Customer Review Monitoring | Admin Portal",
  description: "Audit customer ratings, moderate feedback, and manage storefront review visibility.",
};

export default function AdminReviewsPage() {
  return <AdminReviewsView />;
}
