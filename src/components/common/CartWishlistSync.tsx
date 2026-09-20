"use client";

import { useGetMyCartQuery } from "@/services/api/cart/cartApi";
import { useGetMyWishlistQuery } from "@/services/api/wishlist/wishlistApi";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import type { CartItem } from "@/types/cart.types";
import type { Product, ProductVariant } from "@/types/ecommerce.types";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function CartWishlistSync() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // Never run personal cart/wishlist sync on admin dashboard or for admin roles
  const isCustomerSession =
    isAuthenticated &&
    user?.role !== "admin" &&
    !pathname?.startsWith("/dashboard");

  const { data: cartResponse } = useGetMyCartQuery(undefined, {
    skip: !isCustomerSession,
    refetchOnMountOrArgChange: true,
  });

  const { data: wishlistResponse } = useGetMyWishlistQuery(undefined, {
    skip: !isCustomerSession,
    refetchOnMountOrArgChange: true,
  });

  // Note: auth.store logout() handles clearing cart & wishlist on sign out.
  // Do NOT wipe them synchronously here before auth store hydrates from localStorage on refresh!

  useEffect(() => {
    if (isCustomerSession && cartResponse?.data?.items) {
      const serverItems: CartItem[] = cartResponse.data.items.map((it) => {
        const productThumbnail =
          it.product.thumbnail ||
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";

        const product: Product = {
          ...it.product,
          thumbnail: productThumbnail,
          description: (it.product as any).description || "",
          category: (it.product.category?.name || "General") as any,
          brand: (it.product.brand?.name || "Standard") as any,
          images: productThumbnail ? [productThumbnail] : [],
          tags: [],
          isFeatured: false,
          isNew: false,
          rating: (it.product as any).rating || 5,
          reviewCount: (it.product as any).reviewCount || 0,
          status: (it.product.stockStatus || "IN_STOCK") as any,
          createdAt: it.createdAt,
          updatedAt: it.updatedAt,
        } as unknown as Product;

        const variant: ProductVariant | undefined = it.variant
          ? ({
              id: it.variant.id,
              name:
                [it.variant.color, it.variant.size]
                  .filter(Boolean)
                  .join(" / ") || "Variant",
              sku: it.variant.sku,
              price: it.variant.price ?? it.product.price,
              stock: it.variant.stock,
              color: it.variant.color || undefined,
              size: it.variant.size || undefined,
              image: it.variant.image || undefined,
              inStock: (it.variant.stock ?? 0) > 0,
            } as unknown as ProductVariant)
          : undefined;

        return {
          id: it.id,
          product,
          variant,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          subtotal: it.subtotal,
          addedAt: it.createdAt,
        };
      });

      useCartStore.getState().setServerItems(serverItems);
    }
  }, [isCustomerSession, cartResponse]);

  useEffect(() => {
    if (isCustomerSession && wishlistResponse?.data?.items) {
      const serverProducts: Product[] = wishlistResponse.data.items.map(
        (it) => {
          const itemStock = Number(it.product.stock) || 0;
          return {
            ...it.product,
            stock: itemStock,
            inStock: itemStock > 0 || it.product.stockStatus === "IN_STOCK",
            description: (it.product as any).description || "",
            category: (it.product.category?.name || "General") as any,
            brand: (it.product.brand?.name || "Standard") as any,
            images: it.product.thumbnail ? [it.product.thumbnail] : [],
            tags: [],
            isFeatured: false,
            isNew: false,
            rating: it.product.rating || 5,
            reviewCount: it.product.reviewCount || 0,
            status: (it.product.stockStatus || "IN_STOCK") as any,
            createdAt: it.createdAt,
            updatedAt: it.updatedAt,
          };
        }
      ) as unknown as Product[];

      useWishlistStore.getState().setServerItems(serverProducts);
    }
  }, [isCustomerSession, wishlistResponse]);

  return null;
}
