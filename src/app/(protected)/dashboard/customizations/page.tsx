import type { Metadata } from "next";
import { AdminComingSoonView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Customizations | Store Administration",
  description: "Configure homepage layout, banners, and theme accents.",
};

export default function CustomizationsPage() {
  return (
    <AdminComingSoonView
      title="Store Customizations"
      category="Store Administration"
      description="Visual banner placement, hero slider configuration, and brand theme accents will be available in Release 2.0."
    />
  );
}
