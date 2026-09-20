import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageLoader } from "@/components/common";
import { ROUTES } from "@/constants";
import {
  AdminOrdersView,
  AdminPendingDispatchView,
  AdminOrdersSkeleton,
} from "@/components/admin";

export const metadata: Metadata = {
  title: "Orders & Fulfillment | Admin Portal",
  description: "Track live customer orders, fulfillment workflows, and customer demand.",
};

interface AdminOrdersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedParams = await searchParams;
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : undefined;
  const tab = typeof resolvedParams.tab === "string" ? resolvedParams.tab : undefined;

  if (tab === "carts") {
    redirect(ROUTES.ADMIN_CARTS);
  }

  return (
    <Suspense fallback={<AdminOrdersSkeleton />}>
      {status === "pending" ? (
        <AdminPendingDispatchView />
      ) : (
        <AdminOrdersView />
      )}
    </Suspense>
  );
}

