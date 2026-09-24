"use client";

import React from "react";
import Link from "next/link";
import { ProductImageDisplay } from "@/components/shared";
import { usePathname, useRouter } from "next/navigation";
import {
  Plus,
  Star,
  Shield,
  Check,
  ShieldCheck,
} from "lucide-react";
import type { Product } from "@/types/ecommerce.types";
import { ROUTES } from "@/constants";
import { useCartStore, useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";
import { useAddToCartMutation } from "@/services/api/cart/cartApi";

interface BrandCompactProductCardProps {
  product: Product;
  className?: string;
}

export function BrandCompactProductCard({
  product,
  className,
}: BrandCompactProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const addItem = useCartStore((state) => state.addItem);
  const [addToCartMutation] = useAddToCartMutation();
  const [isAdding, setIsAdding] = React.useState(false);

  const isUuid = (id?: string) =>
    Boolean(
      id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          id
        )
    );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (user?.role === "admin") {
      router.push("/dashboard/products");
      return;
    }

    if (!isAuthenticated) {
      const redirectUrl = `/login?callbackUrl=${encodeURIComponent(
        pathname
      )}&action=add-to-cart&productId=${product.id}&quantity=1`;
      router.push(redirectUrl);
      return;
    }

    setIsAdding(true);
    addItem(product, 1);
    if (isUuid(product.id)) {
      try {
        await addToCartMutation({
          productId: product.id,
          quantity: 1,
        }).unwrap();
      } catch (err: any) {
        console.error("Failed to add to cart on server:", err);
      }
    }
    setTimeout(() => setIsAdding(false), 800);
  };

  const productUrl = ROUTES.PRODUCT_DETAIL(product.slug);

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3.5 rounded-2xl bg-card p-3 transition-all duration-300 hover:-translate-y-1 select-none",
        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.55),0_2px_10px_-2px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_18px_38px_-8px_rgba(0,0,0,0.75)]",
        className
      )}
    >
      {/* Full-frame Thumbnail Container */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted/40 dark:bg-zinc-900/50">
        <Link href={productUrl} className="relative block h-full w-full">
          <ProductImageDisplay
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </Link>
      </div>

      {/* Main Content Area (Spacious Horizontal Distribution) */}
      <div className="flex flex-1 min-w-0 flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Title - Clean font, line-clamp-1 */}
          <Link
            href={productUrl}
            className="block text-[13px] font-bold text-foreground truncate hover:text-amber-500 transition-colors leading-snug tracking-tight"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Meta specs / rating info row */}
          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
              <span className="font-bold text-foreground">
                {product.rating ? product.rating.toFixed(1) : "5.0"}
              </span>
              <span className="text-[10px] text-muted-foreground/70">
                ({product.reviewCount || 0})
              </span>
            </div>
            <span className="text-border/70">·</span>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <ShieldCheck className="h-3 w-3 shrink-0" />
              Official
            </span>
          </div>
        </div>

        {/* Price & Action Button Row */}
        <div className="mt-1.5 flex items-center justify-between gap-2 pt-1 border-t border-border/40">
          <div className="min-w-0">
            <span className="text-sm font-black text-foreground tracking-tight block truncate">
              ৳{product.price.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={user?.role === "admin" ? "Admin" : "Add to cart"}
            className={cn(
              "flex h-7 items-center justify-center gap-1 rounded-lg px-2.5 text-[11px] font-bold transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs shrink-0",
              user?.role === "admin"
                ? "bg-muted text-foreground border border-border/60"
                : isAdding
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black hover:scale-105"
            )}
          >
            {user?.role === "admin" ? (
              <Shield className="h-3 w-3" />
            ) : isAdding ? (
              <>
                <Check className="h-3 w-3 stroke-[2.5]" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 stroke-[2.5]" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
