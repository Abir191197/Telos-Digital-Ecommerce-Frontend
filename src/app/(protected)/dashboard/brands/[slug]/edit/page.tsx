import type { Metadata } from "next";
import { CreateBrandView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Edit Brand | Admin Portal",
  description: "Update brand partnership details, emblems, and showcase controls.",
};

interface EditBrandPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { slug } = await params;
  return <CreateBrandView brandSlug={slug} />;
}
