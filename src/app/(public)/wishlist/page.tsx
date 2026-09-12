import type { Metadata } from "next";
import Link from "next/link";
import { WishlistView } from "@/components/wishlist";
import { ROUTES } from "@/constants";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "My Wishlist & Saved Products | Telos Cart BD",
  description:
    "View your saved favorite smartphones, laptops, audio gear, and accessories with live warranty status.",
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* ── Breadcrumb Bar ── */}
      <div className="border-b border-border/60 bg-muted/20 py-3">
        <div className="container">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
            <span className="font-semibold text-foreground">Wishlist</span>
          </nav>
        </div>
      </div>

      {/* ── Wishlist Main Hub ── */}
      <WishlistView />
    </div>
  );
}
