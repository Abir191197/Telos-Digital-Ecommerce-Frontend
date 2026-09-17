import { Suspense } from "react";
import type { Metadata } from "next";
import { PageLoader } from "@/components/common";
import {
  AdminOrdersView,
  AdminPendingDispatchView,
  AdminCustomerCartsView,
} from "@/components/admin";

export const metadata: Metadata = {
  title: "Orders & Fulfillment | Admin Portal",
  description: "Track live customer orders, fulfillment workflows, and abandoned carts.",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedParams = await searchParams;
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : undefined;
  const tab = typeof resolvedParams.tab === "string" ? resolvedParams.tab : undefined;

  return (
    <Suspense
      fallback={
        <PageLoader
          title="Loading Orders..."
          description="Fetching customer orders, dispatch schedules, and shopping carts."
          badgeText="Orders Hub"
        />
      }
    >
      {tab === "carts" ? (
        <AdminCustomerCartsView />
      ) : status === "pending" ? (
        <AdminPendingDispatchView />
      ) : (
        <AdminOrdersView />
      )}
    </Suspense>
  );
}
