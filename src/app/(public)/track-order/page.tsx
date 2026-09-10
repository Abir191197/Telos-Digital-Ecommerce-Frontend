import type { Metadata } from "next";
import { RealtimeTrackerView } from "@/components/account";

export const metadata: Metadata = {
  title: "Realtime Order Tracking | Telos Cart BD",
  description:
    "Track live Bangladesh courier shipment status, parcel milestones, and estimated delivery dates.",
};

export default function TrackOrderPage() {
  return <RealtimeTrackerView />;
}
