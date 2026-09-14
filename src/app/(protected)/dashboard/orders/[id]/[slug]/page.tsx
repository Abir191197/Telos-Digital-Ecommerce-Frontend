import type { Metadata } from "next";
import { AdminOrderDetailView } from "@/components/admin";

interface OrderDetailSlugPageProps {
  params: Promise<{ id: string; slug?: string }>;
}

export async function generateMetadata({ params }: OrderDetailSlugPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Order #${resolvedParams.id} Details | Admin Portal`,
    description: `Manage fulfillment, status, and shipping info for order #${resolvedParams.id}`,
  };
}

export default function OrderDetailSlugPage() {
  return <AdminOrderDetailView />;
}
