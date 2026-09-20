import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminPaymentsView, AdminPaymentsSkeleton } from "@/components/admin";

export const metadata: Metadata = {
  title: "Payments & Reconciliation | Admin Portal",
  description: "Monitor MFS transactions, TrxID verification, and payouts.",
};

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<AdminPaymentsSkeleton />}>
      <AdminPaymentsView />
    </Suspense>
  );
}

