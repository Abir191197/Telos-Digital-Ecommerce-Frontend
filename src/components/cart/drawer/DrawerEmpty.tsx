import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/common";
import { ROUTES } from "@/constants";

interface DrawerEmptyProps {
  onCloseCart: () => void;
  isAuthenticated?: boolean;
}

export function DrawerEmpty({ onCloseCart, isAuthenticated = true }: DrawerEmptyProps) {
  if (!isAuthenticated) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center py-12 space-y-4">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500/80 border border-amber-500/20 shadow-inner">
          <LogIn className="h-10 w-10" />
        </div>
        <div className="space-y-1.5 max-w-xs">
          <h3 className="text-base font-black text-foreground">
            Sign in to view your bag
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please sign in to view your saved items, access live discounts, and checkout.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2 w-full max-w-xs">
          <Button
            type="button"
            variant="amber"
            size="default"
            onClick={onCloseCart}
            asChild
          >
            <Link href={`${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(ROUTES.CART)}`}>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onCloseCart}
            asChild
          >
            <Link href={ROUTES.PRODUCTS}>
              <span>Explore Products</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center text-center py-12 space-y-4">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500/80 border border-amber-500/20">
        <ShoppingBag className="h-10 w-10" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
        </span>
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h3 className="text-base font-black text-foreground">
          Your shopping bag is empty
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Discover genuine smartphones, laptops, audio gear, and gadgets with
          official warranties.
        </p>
      </div>
      <div className="pt-2 flex flex-col gap-2 w-full max-w-xs">
        <Button
          type="button"
          variant="amber"
          size="default"
          onClick={onCloseCart}
          asChild
        >
          <Link href="/products">
            <span>Explore Products</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
        <Link
          href="/wishlist"
          onClick={onCloseCart}
          className="text-xs font-semibold text-muted-foreground hover:text-amber-500 py-1 transition-colors"
        >
          Check Saved Items in Wishlist →
        </Link>
      </div>
    </div>
  );
}
