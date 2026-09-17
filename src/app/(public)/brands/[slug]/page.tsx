import type { Metadata } from "next";
import { BrandDetailView } from "./BrandDetailView";

export const metadata: Metadata = {
  title: "Brand | Telos Cart Storefront",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BrandDetailPage({ params }: Props) {
  return <BrandDetailView params={params} />;
}
