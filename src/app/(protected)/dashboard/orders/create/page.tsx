import { Suspense } from "react";
import type { Metadata } from "next";
import { PageLoader } from "@/components/common";
import { ManualOrderView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Create Manual Order | Admin Portal",
  description: "Create orders on behalf of customers received via Facebook, phone, or direct admin entry.",
};

export default function AdminCreateOrderPage() {
  return (
    <Suspense fallback={<PageLoader title="Loading Order Form…" description="Preparing the manual order creation interface." badgeText="Admin Order Entry" />}>
      <ManualOrderView />
    </Suspense>
  );
}
