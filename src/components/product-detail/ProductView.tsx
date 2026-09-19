"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { ROUTES } from "@/constants";
import { useCartStore, useWishlistStore, useRecentlyViewedStore, useAuthStore } from "@/stores";
import { useAddToCartMutation } from "@/services/api/cart/cartApi";
import {
  useAddToWishlistMutation,
  useRemoveWishlistItemMutation,
} from "@/services/api/wishlist/wishlistApi";
import { useMounted } from "@/hooks";
import { SupportAndHelpstrip, TrustGuaranteeCards } from "@/components/shared";
import type { Product } from "@/types/ecommerce.types";

import {
  ProductGallery,
  ProductInfo,
  ProductActions,
  ProductDeliveryTrustStrip,
  ProductSpecifications,
  ProductReviewsSection,
  RelatedProducts,
  RecentlyViewedProducts,
  NotifyStockModal,
} from "./";

interface ProductViewProps {
  product: Product;
  relatedProducts?: Product[];
}

const sectionFadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ProductView({ product, relatedProducts = [] }: ProductViewProps) {
  const mounted = useMounted();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistItemMutation] = useRemoveWishlistItemMutation();

  // Stores
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlistStore = useWishlistStore((state) => state.isInWishlist(product.id));
  const isWishlisted = mounted ? isInWishlistStore : false;
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addProduct);
  const rawRecentlyViewed = useRecentlyViewedStore((state) => state.items);

  // Variant state: Auto-select the first in-stock variant, or the first variant
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(() => {
    if (!product.variants || product.variants.length === 0) return undefined;
    const inStockVariant = product.variants.find((v) => (v.stock ?? 0) > 0);
    return inStockVariant ? inStockVariant.id : product.variants[0]?.id;
  });

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return undefined;
    return product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  }, [product.variants, selectedVariantId]);

  const currentPrice = selectedVariant?.price ?? product.price;
  const activeImageUrl = selectedVariant?.image || undefined;

  // Quantity & action state
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showNotifyStock, setShowNotifyStock] = useState(false);

  // Keep quantity capped if variant stock changes
  useEffect(() => {
    const maxStock = selectedVariant ? selectedVariant.stock : product.stock;
    if (maxStock > 0 && quantity > maxStock) {
      setQuantity(maxStock);
    }
  }, [selectedVariant, product.stock, quantity]);

  // Recently viewed excluding current product
  const recentlyViewed = useMemo(() => {
    if (!mounted) return [];
    return rawRecentlyViewed.filter((p) => p.id !== product.id);
  }, [mounted, rawRecentlyViewed, product.id]);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  const handleAddToCart = async () => {
    if (isAdmin) return;
    if (!isAuthenticated) {
      const redirectUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}&action=add-to-cart&productId=${product.id}&quantity=${quantity}${selectedVariant ? `&variantId=${selectedVariant.id}` : ""}`;
      router.push(redirectUrl);
      return;
    }

    setIsAdding(true);
    addItem(product, quantity, selectedVariant);
    try {
      await addToCartMutation({
        productId: product.id,
        quantity,
        variantId: selectedVariant?.id,
      }).unwrap();
    } catch (err) {
      console.error("Failed to add to cart on server:", err);
    }
    setTimeout(() => setIsAdding(false), 900);
  };

  const handleToggleWishlist = async () => {
    if (isAdmin) return;
    if (!isAuthenticated) {
      const redirectUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}&action=add-to-wishlist&productId=${product.id}`;
      router.push(redirectUrl);
      return;
    }
    toggleWishlist(product);
    try {
      if (isInWishlistStore) {
        await removeWishlistItemMutation(product.id).unwrap();
      } else {
        await addToWishlistMutation({ productId: product.id }).unwrap();
      }
    } catch (err) {
      console.error("Failed to toggle wishlist on server:", err);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background text-foreground pb-20">
        {/* 🧭 Breadcrumb Navigation 🧭 */}
        <nav aria-label="Breadcrumb" className="border-b border-border/40 bg-muted/10 py-3">
          <div className="container px-3 sm:px-6">
            <ol className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto no-scrollbar whitespace-nowrap">
              <li>
                <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
              <li>
                <Link href={ROUTES.PRODUCTS} className="hover:text-foreground transition-colors">
                  Products
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
              <li>
                <Link
                  href={ROUTES.CATEGORY_DETAIL(product.categorySlug)}
                  className="hover:text-foreground transition-colors"
                >
                  {product.categoryName}
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
              <li className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
                {product.name}
              </li>
            </ol>
          </div>
        </nav>

        {/* 🌟 Main Product Stage 🌟 */}
        <div className="container px-3 sm:px-6 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 items-start">
            {/* Left Column: Media Gallery (6 cols on lg, sticky) */}
            <div className="lg:col-span-6 lg:sticky lg:top-20">
              <ProductGallery
                product={product}
                activeImageUrl={activeImageUrl}
                isWishlisted={isWishlisted}
                onToggleWishlist={handleToggleWishlist}
                onShare={handleShare}
                showShareToast={showShareToast}
                isAdmin={isAdmin}
              />
            </div>

            {/* Right Column: Buying Decision Hub (6 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col justify-start space-y-4">
              <ProductInfo
                product={product}
                selectedVariantId={selectedVariantId}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariantId}
                currentPrice={currentPrice}
              />

              <ProductActions
                product={product}
                selectedVariant={selectedVariant}
                quantity={quantity}
                onQuantityChange={setQuantity}
                isAdding={isAdding}
                onAddToCart={handleAddToCart}
                onOpenNotifyStock={() => setShowNotifyStock(false)}
                isAdmin={isAdmin}
              />

              <ProductDeliveryTrustStrip />
            </div>
          </div>

          {/* 📄 Detailed Specifications & Description 📄 */}
          <ProductSpecifications
            product={product}
            sectionFadeUp={sectionFadeUp}
          />

          {/* ⭐ Customer Reviews & Ratings Section ⭐ */}
          <ProductReviewsSection
            product={product}
            sectionFadeUp={sectionFadeUp}
          />

          {/* 📦 Related Products from Same Category 📦 */}
          {relatedProducts.length > 0 && (
            <RelatedProducts
              categorySlug={product.categorySlug}
              relatedProducts={relatedProducts}
              sectionFadeUp={sectionFadeUp}
            />
          )}

          {/* 🕒 Recently Viewed Products Shelf 🕒 */}
          {recentlyViewed.length > 0 && (
            <RecentlyViewedProducts
              recentlyViewed={recentlyViewed}
              sectionFadeUp={sectionFadeUp}
            />
          )}

          {/* 🛡️ High-Density BD Trust & Guarantee Cards Strip 🛡️ */}
          <m.section
            variants={sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14"
          >
            <TrustGuaranteeCards />
          </m.section>

          {/* 📞 Customer Help & Dhaka Support Strip 📞 */}
          <m.section
            variants={sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10"
          >
            <SupportAndHelpstrip />
          </m.section>
        </div>
      </div>

      {/* 🔔 Notify Me When In Stock Modal 🔔 */}
      <NotifyStockModal
        productName={product.name}
        productSlug={product.slug}
        isOpen={showNotifyStock}
        onClose={() => setShowNotifyStock(false)}
      />
    </LazyMotion>
  );
}
