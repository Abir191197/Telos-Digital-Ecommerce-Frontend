import type { Metadata } from "next";
import { CreateBrandView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Create Brand | Admin Portal",
  description: "Register a new brand partnership with official emblems and showcase controls.",
};

export default function CreateBrandPage() {
  return <CreateBrandView />;
}
