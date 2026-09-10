import type { Metadata } from "next";
import { WishlistView } from "@/components/wishlist";

export const metadata: Metadata = {
  title: "My Wishlist & Saved Products | Telos Cart BD",
  description:
    "View your saved favorite smartphones, laptops, audio gear, and accessories with live warranty status.",
};

export default function WishlistPage() {
  return <WishlistView />;
}
