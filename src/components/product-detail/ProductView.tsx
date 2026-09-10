"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/ecommerce.types";
import { ProductCard } from "@/components/common";
import { SupportAndHelpstrip } from "@/components/shared";
import { ROUTES } from "@/constants";
import { useCartStore, useWishlistStore, useRecentlyViewedStore } from "@/stores";
import { cn } from "@/lib/utils";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  ShoppingCart,
  Zap,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  Clock,
  History,
  Trash2,
} from "lucide-react";
import { useMounted } from "@/hooks";

interface ProductViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductView({ product, relatedProducts }: ProductViewProps) {
  // Image gallery state
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant selection state
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants?.[0]?.id
  );

  // Store hooks
  const mounted = useMounted();
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlistStore = useWishlistStore((state) => state.isInWishlist(product.id));
  const isWishlisted = mounted ? isInWishlistStore : false;
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addProduct);
  const rawRecentlyViewed = useRecentlyViewedStore((state) => state.items);
  const clearRecentlyViewed = useRecentlyViewedStore((state) => state.clearAll);

  // Recently viewed excluding current product being viewed
  const recentlyViewed = React.useMemo(() => {
    if (!mounted) return [];
    return rawRecentlyViewed.filter((p) => p.id !== product.id);
  }, [mounted, rawRecentlyViewed, product.id]);

  // Track product in recently viewed
  React.useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  // Quantity state
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Price calculation
  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant?.price || product.price;

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

  const discountAmount = product.originalPrice && product.originalPrice > currentPrice
    ? product.originalPrice - currentPrice
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Breadcrumb Navigation ── */}
      <nav aria-label="Breadcrumb" className="border-b border-border/60 bg-muted/20 py-3">
        <div className="container px-3 sm:px-6">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto no-scrollbar whitespace-nowrap">
            <li>
              <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 shrink-0 text-border" />
            <li>
              <Link href={ROUTES.CATEGORIES} className="hover:text-foreground transition-colors">
                Categories
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 shrink-0 text-border" />
            <li>
              <Link
                href={ROUTES.CATEGORY_DETAIL(product.categorySlug)}
                className="hover:text-foreground transition-colors"
              >
                {product.categoryName}
              </Link>
            </li>
            <ChevronRight className="h-3 w-3 shrink-0 text-border" />
            <li className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* ── Main Product Stage ── */}
      <div className="container px-3 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left Column: Media Gallery (5 cols on lg) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xs">
              <Image
                src={images[activeImageIndex] || product.thumbnail}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.discountPercentage && product.discountPercentage > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    <Zap className="h-3.5 w-3.5 fill-white" />
                    Save {product.discountPercentage}%
                  </span>
                ) : null}
                {product.badge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Wishlist & Share floating action pills */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur-md text-muted-foreground shadow-sm hover:text-foreground hover:bg-background transition-all"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full bg-background/85 backdrop-blur-md shadow-sm transition-all",
                    isWishlisted ? "text-rose-600" : "text-muted-foreground hover:text-rose-600"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isWishlisted && "fill-rose-600 text-rose-600")} />
                </button>
              </div>

              {/* Share copied toast indicator */}
              {showShareToast && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-foreground/90 text-background px-4 py-1.5 text-xs font-semibold shadow-lg">
                  Link copied to clipboard!
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer bg-muted/30",
                      activeImageIndex === idx
                        ? "border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                        : "border-border/70 hover:border-muted-foreground/40 opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt={`${product.name} thumb ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Authenticity trust badge below image */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/70 bg-card/60 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-foreground">100% Genuine BD Importer Stock</span>
              </div>
              <span className="text-muted-foreground">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Right Column: Buying Decision Hub (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand & Stock Pill */}
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="rounded-full bg-amber-500/10 border border-amber-500/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-600 hover:bg-amber-500/20 transition-colors"
                >
                  {product.brand} Official
                </Link>

                {product.inStock ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock ({product.stock} units available)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-600">Out of Stock</span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="mt-3 text-2xl sm:text-3xl xl:text-4xl font-black tracking-tight text-foreground">
                {product.name}
              </h1>

              {/* Rating & Short Review Summary */}
              <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-amber-600 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground font-medium">
                  {product.reviewCount} customer reviews
                </span>
                <span className="text-border">|</span>
                <span className="text-muted-foreground">
                  Subcategory:{" "}
                  <strong className="text-foreground">
                    {product.specifications?.Subcategory || product.categoryName}
                  </strong>
                </span>
              </div>

              {/* Pricing Box */}
              <div className="mt-5 p-4 rounded-2xl border border-border/80 bg-muted/30">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-foreground">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > currentPrice && (
                    <>
                      <span className="text-base sm:text-lg text-muted-foreground line-through">
                        ৳{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="rounded-md bg-rose-600/10 text-rose-600 px-2 py-0.5 text-xs font-bold">
                        Save ৳{discountAmount.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Inclusive of all VAT and official Bangladesh import duties.
                </p>
              </div>

              {/* Short Description */}
              <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Variant Selector (if variants exist) */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Select Edition / Specification:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={cn(
                          "rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                          selectedVariantId === v.id
                            ? "border-amber-500 bg-amber-500/10 text-amber-700 shadow-xs"
                            : "border-border/80 bg-card text-foreground hover:border-border"
                        )}
                      >
                        <span>{v.name}</span>
                        {v.price !== product.price && (
                          <span className="ml-1.5 text-[11px] text-muted-foreground">
                            (৳{v.price.toLocaleString()})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & CTA Buttons */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Quantity:
                  </label>
                  <div className="flex items-center rounded-xl border border-border/80 bg-card shadow-2xs">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                    <button
                      type="button"
                      disabled={quantity >= product.stock}
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={cn(
                      "flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer",
                      isAdding
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                    )}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{isAdding ? "Added to Cart!" : "Add to Cart"}</span>
                  </button>

                  <Link
                    href={`/checkout?directProduct=${product.slug}&qty=${quantity}`}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground text-background hover:opacity-90 text-sm font-bold shadow-md transition-all active:scale-98"
                  >
                    <Zap className="h-4 w-4 fill-current" />
                    <span>Buy Now (Instant)</span>
                  </Link>
                </div>
              </div>

              {/* Delivery & Warranty Guarantees Strip */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-border/60">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 text-xs">
                  <Truck className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Express 24-48h</p>
                    <p className="text-[10px] text-muted-foreground">Dhaka & Nationwide</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 text-xs">
                  <RotateCcw className="h-4 w-4 text-blue-500 shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">7 Days Return</p>
                    <p className="text-[10px] text-muted-foreground">Doorstep exchange</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 text-xs">
                  <Award className="h-4 w-4 text-purple-500 shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Official Warranty</p>
                    <p className="text-[10px] text-muted-foreground">Brand service center</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Detailed Specifications & Description Tabs ── */}
        <section className="mt-14 pt-10 border-t border-border/70 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Technical Details
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Specifications & Product Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Long Description (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Highlights Checklist */}
              <div className="mt-4 p-4 rounded-2xl border border-border/70 bg-card/50 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Included in This Box:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Original Sealed Packaging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Official Warranty Documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Verified IMEI / Barcode Serial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Telos Cart Official Invoice</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications Key-Value Table (5 cols) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs">
                <div className="bg-muted/50 px-4 py-3 border-b border-border/70">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Verified Hardware Specs
                  </h3>
                </div>
                <dl className="divide-y divide-border/60 text-xs">
                  {Object.entries(product.specifications || {}).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="font-semibold text-muted-foreground col-span-1">{key}</dt>
                      <dd className="text-foreground font-medium col-span-2">{val}</dd>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <dt className="font-semibold text-muted-foreground col-span-1">Currency</dt>
                    <dd className="text-foreground font-medium col-span-2">BDT (Bangladeshi Taka)</dd>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <dt className="font-semibold text-muted-foreground col-span-1">Availability</dt>
                    <dd className="text-emerald-600 font-bold col-span-2">
                      {product.inStock ? "Ready for Instant Dispatch" : "Temporarily Sold Out"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ── Related Products from Same Aisle ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 pt-10 border-t border-border/70 space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  More In This Category
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Customers Also Viewed
                </h2>
              </div>
              <Link
                href={ROUTES.CATEGORY_DETAIL(product.categorySlug)}
                className="text-xs sm:text-sm font-bold text-amber-600 hover:underline flex items-center gap-1"
              >
                <span>View Full Aisle</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* ── Recently Viewed Products Section ── */}
        {recentlyViewed.length > 0 && (
          <section aria-label="Recently Viewed Products" className="mt-14 pt-10 border-t border-border/70 space-y-6">
            <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-muted/40 via-card to-card p-4 sm:p-6 shadow-xs">
              <div className="flex flex-row items-center justify-between gap-3 mb-5 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <History className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground">
                        Recently Viewed
                      </h2>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {recentlyViewed.length}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Pick up right where you left off in your shopping session
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearRecentlyViewed}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-rose-500/10"
                  title="Clear recently viewed history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Clear History</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {recentlyViewed.slice(0, 6).map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Customer Help & Dhaka Support Strip ── */}
        <section className="mt-14">
          <SupportAndHelpstrip />
        </section>
      </div>
    </div>
  );
}
