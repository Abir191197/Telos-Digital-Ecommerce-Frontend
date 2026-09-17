import type { Metadata } from "next";
import { CategoryDetailView } from "./CategoryDetailView";

export const metadata: Metadata = {
  title: "Category | Telos Cart Storefront",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: Props) {
  return <CategoryDetailView params={params} />;
}
