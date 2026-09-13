"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/common";
import { ROUTES } from "@/constants";

interface CartEmptyStateProps {
  wishlistCount: number;
}

export function CartEmptyState({ wishlistCount }: CartEmptyStateProps) {
  return (
    <div className="py-16 text-center space-y-6">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner">
        <ShoppingBag className="h-12 w-12" />
      </div>
      <div className="space-y-2 max-w-md mx-auto">
        <h2 className="text-xl font-black text-foreground">
          Your shopping bag is empty
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You haven&apos;t placed any products in your cart yet. Discover authentic flagship gadgets, laptops, audio gear, and lifestyle tech with 100% official brand warranties.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button asChild variant="amber" size="lg" className="rounded-2xl font-bold">
          <Link href={ROUTES.PRODUCTS}>
            <span>Explore Products</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-2xl font-semibold">
          <Link href={ROUTES.WISHLIST}>
            <Heart className="h-4 w-4 mr-1.5 text-rose-500" />
            <span>View Saved Wishlist ({wishlistCount})</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
