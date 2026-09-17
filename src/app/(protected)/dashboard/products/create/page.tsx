import type { Metadata } from "next";
import { CreateProductView } from "@/components/admin/products";

export const metadata: Metadata = {
  title: "Create Product | Admin Portal",
  description: "Publish new catalog items, configure pricing, stock inventory, and multi-image galleries.",
};

export default function CreateProductPage() {
  return <CreateProductView />;
}
