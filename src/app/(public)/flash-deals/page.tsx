import type { Metadata } from "next";
import { FlashDealsView } from "@/components/deals/FlashDealsView";

export const metadata: Metadata = {
  title: "Flash Deals & Limited-Time Discounts | Telos Cart Bangladesh",
  description:
    "Explore exclusive flash deals on smartphones, laptops, audio gear, and accessories with official Bangladesh warranty.",
};

export default function FlashDealsPage() {
  return <FlashDealsView />;
}
