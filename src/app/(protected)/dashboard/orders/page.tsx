import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminOrdersView, AdminPendingDispatchView } from "@/components/admin";

export const metadata: Metadata = {
  title: "Orders & Fulfillment | Admin Portal",
  description: "Manage orders, update status, and assign courier logistics.",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedParams = await searchParams;
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : undefined;

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading orders...</div>}>
      {status === "pending" ? <AdminPendingDispatchView /> : <AdminOrdersView />}
    </Suspense>
  );
}
