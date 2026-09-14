import type { Metadata } from "next";
import { AdminOrderDetailView } from "@/components/admin";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Order #${resolvedParams.id} Details | Admin Portal`,
    description: `Manage fulfillment, status, and shipping info for order #${resolvedParams.id}`,
  };
}

export default function OrderDetailPage() {
  return <AdminOrderDetailView />;
}
