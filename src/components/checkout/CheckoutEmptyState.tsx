import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants";

export function CheckoutEmptyState() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">
            Your cart is empty
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Looks like you haven&apos;t added any products to your shopping bag yet.
          </p>
        </div>
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-md shadow-amber-500/20 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Explore Products Catalog</span>
        </Link>
      </div>
    </div>
  );
}
