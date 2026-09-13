"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { ROUTES } from "@/constants";
import { useCartStore, useWishlistStore, useRecentlyViewedStore } from "@/stores";
import { useMounted } from "@/hooks";
import { SupportAndHelpstrip, TrustGuaranteeCards } from "@/components/shared";
import type { Product } from "@/types/ecommerce.types";

import {
  ProductGallery,
  ProductInfo,
  ProductActions,
  ProductDeliveryTrustStrip,
  ProductSpecifications,
  RelatedProducts,
  RecentlyViewedProducts,
  NotifyStockModal,
} from "./";

interface ProductViewProps {
  product: Product;
  relatedProducts: Product[];
}

const sectionFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ProductView({ product, relatedProducts }: ProductViewProps) {
  const mounted = useMounted();

  // Stores
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlistStore = useWishlistStore((state) => state.isInWishlist(product.id));
  const isWishlisted = mounted ? isInWishlistStore : false;
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addProduct);
  const rawRecentlyViewed = useRecentlyViewedStore((state) => state.items);

  // Variant state
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants?.[0]?.id
  );
  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant?.price || product.price;

  // Quantity & action state
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showNotifyStock, setShowNotifyStock] = useState(false);

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

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, quantity, selectedVariant);
    setTimeout(() => setIsAdding(false), 900);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
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
        {/* ── Breadcrumb Navigation ── */}
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
                <Link href={ROUTES.CATEGORIES} className="hover:text-foreground transition-colors">
                  Categories
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

        {/* ── Main Product Stage ── */}
        <div className="container px-3 sm:px-6 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">
            {/* Left Column: Media Gallery (6 cols on lg, sticky) */}
            <ProductGallery
              product={product}
              isWishlisted={isWishlisted}
              onToggleWishlist={handleToggleWishlist}
              onShare={handleShare}
              showShareToast={showShareToast}
            />

            {/* Right Column: Buying Decision Hub (6 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <ProductInfo
                  product={product}
                  selectedVariantId={selectedVariantId}
                  onSelectVariant={setSelectedVariantId}
                  currentPrice={currentPrice}
                />

                <ProductActions
                  product={product}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  isAdding={isAdding}
                  onAddToCart={handleAddToCart}
                  onOpenNotifyStock={() => setShowNotifyStock(true)}
                />

                <ProductDeliveryTrustStrip />
              </div>
            </div>
          </div>

          {/* ── Detailed Specifications & Description ── */}
          <ProductSpecifications
            product={product}
            sectionFadeUp={sectionFadeUp}
          />

          {/* ── Related Products from Same Aisle ── */}
          <RelatedProducts
            categorySlug={product.categorySlug}
            relatedProducts={relatedProducts}
            sectionFadeUp={sectionFadeUp}
          />

          {/* ── Recently Viewed Products Shelf ── */}
          <RecentlyViewedProducts
            recentlyViewed={recentlyViewed}
            sectionFadeUp={sectionFadeUp}
          />

          {/* ── High-Density BD Trust & Guarantee Cards Strip ── */}
          <m.section
            variants={sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14"
          >
            <TrustGuaranteeCards />
          </m.section>

          {/* ── Customer Help & Dhaka Support Strip ── */}
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

      {/* ── Notify Me When In Stock Modal ── */}
      <NotifyStockModal
        productName={product.name}
        productSlug={product.slug}
        isOpen={showNotifyStock}
        onClose={() => setShowNotifyStock(false)}
      />
    </LazyMotion>
  );
}
