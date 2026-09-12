import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerAccountHub } from "@/components/account";

export const metadata: Metadata = {
  title: "Customer Hub & Orders | Telos Cart BD",
  description:
    "Manage delivery addresses, review recent order history, and track shipments in Bangladesh.",
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-12 animate-pulse space-y-6">
          <div className="h-32 rounded-3xl bg-muted/60" />
          <div className="h-64 rounded-3xl bg-muted/40" />
        </div>
      }
    >
      <CustomerAccountHub />
    </Suspense>
  );
}
