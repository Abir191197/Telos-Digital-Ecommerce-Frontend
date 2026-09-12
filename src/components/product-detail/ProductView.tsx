"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/ecommerce.types";
import { ProductCard, Button } from "@/components/common";
import { SupportAndHelpstrip, TrustGuaranteeCards } from "@/components/shared";
import { ROUTES } from "@/constants";
import { useCartStore, useWishlistStore, useRecentlyViewedStore } from "@/stores";
import { cn } from "@/lib/utils";
import { LazyMotion, domAnimation, m, AnimatePresence, type Variants } from "framer-motion";
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
  BellRing,
} from "lucide-react";
import { useMounted } from "@/hooks";
import { NotifyStockModal } from "./NotifyStockModal";

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
  const [showNotifyStock, setShowNotifyStock] = useState(false);

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
            {/* Left Column: Media Stage (6 cols on lg, sticky) */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
              {/* ── Mobile View: Swipeable Carousel Stage ── */}
              <div className="block lg:hidden relative aspect-square w-full overflow-hidden rounded-3xl bg-muted/20">
                <m.div
                  key={activeImageIndex}
                  drag={images.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    const threshold = 40;
                    if (info.offset.x < -threshold && activeImageIndex < images.length - 1) {
                      setActiveImageIndex((prev) => prev + 1);
                    } else if (info.offset.x > threshold && activeImageIndex > 0) {
                      setActiveImageIndex((prev) => prev - 1);
                    }
                  }}
                  className="relative h-full w-full touch-pan-y"
                >
                  <Image
                    src={images[activeImageIndex] || product.thumbnail}
                    alt={`${product.name} - slide ${activeImageIndex + 1}`}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center select-none pointer-events-none"
                  />
                </m.div>

                {/* Badges */}
                <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
                  {product.discountPercentage && product.discountPercentage > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-zinc-950 px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-sm">
                      <Zap className="h-3 w-3 fill-zinc-950" />
                      Save {product.discountPercentage}%
                    </span>
                  ) : null}
                  {product.badge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/80 dark:bg-white/90 text-white dark:text-zinc-900 backdrop-blur-md px-3 py-1 text-[11px] font-bold shadow-xs">
                      <Sparkles className="h-3 w-3" />
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Wishlist & Share floating action pills */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share product"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-muted-foreground shadow-xs hover:text-foreground hover:bg-background transition-all cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md shadow-xs transition-all cursor-pointer",
                      isWishlisted ? "text-rose-600" : "text-muted-foreground hover:text-rose-600"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isWishlisted && "fill-rose-600 text-rose-600")} />
                  </button>
                </div>

                {/* Mobile Floating Pagination / Photo Count Pill Indicator */}
                {images.length > 1 && (
                  <div className="absolute bottom-3.5 right-3.5 z-10 pointer-events-none">
                    <span className="inline-flex items-center rounded-full bg-zinc-950/70 text-white px-2.5 py-1 text-[10px] font-bold backdrop-blur-md shadow-xs">
                      {activeImageIndex + 1} / {images.length}
                    </span>
                  </div>
                )}

                {/* Mobile Swipe Navigation Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                    {images.map((_, dotIdx) => (
                      <button
                        key={`mobile-dot-${dotIdx}`}
                        type="button"
                        onClick={() => setActiveImageIndex(dotIdx)}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                          activeImageIndex === dotIdx
                            ? "w-5 bg-amber-500 shadow-xs"
                            : "w-1.5 bg-white/70 hover:bg-white"
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* Share copied toast indicator */}
                {showShareToast && (
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-foreground/90 text-background px-4 py-1.5 text-xs font-semibold shadow-lg z-20 whitespace-nowrap">
                    Link copied to clipboard!
                  </div>
                )}
              </div>

              {/* ── Desktop View: Traditional Media Stage + Thumbnails (Hidden on Mobile) ── */}
              <div className="hidden lg:block space-y-4">
                {/* Main Stage Image (Full-bleed cover, zero white space) */}
                <div className="group relative aspect-square w-full overflow-hidden rounded-3xl">
                  <AnimatePresence mode="wait">
                    <m.div
                      key={activeImageIndex}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={images[activeImageIndex] || product.thumbnail}
                        alt={product.name}
                        fill
                        priority
                        sizes="50vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                    </m.div>
                  </AnimatePresence>

                  {/* Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                    {product.discountPercentage && product.discountPercentage > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-zinc-950 px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-sm">
                        <Zap className="h-3 w-3 fill-zinc-950" />
                        Save {product.discountPercentage}%
                      </span>
                    ) : null}
                    {product.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/80 dark:bg-white/90 text-white dark:text-zinc-900 backdrop-blur-md px-3 py-1 text-[11px] font-bold shadow-xs">
                        <Sparkles className="h-3 w-3" />
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Wishlist & Share floating action pills */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                    <button
                      type="button"
                      onClick={handleShare}
                      aria-label="Share product"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-muted-foreground shadow-xs hover:text-foreground hover:bg-background transition-all cursor-pointer"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md shadow-xs transition-all cursor-pointer",
                        isWishlisted ? "text-rose-600" : "text-muted-foreground hover:text-rose-600"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", isWishlisted && "fill-rose-600 text-rose-600")} />
                    </button>
                  </div>

                  {/* Share copied toast indicator */}
                  {showShareToast && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-foreground/90 text-background px-4 py-1.5 text-xs font-semibold shadow-lg z-20">
                      Link copied to clipboard!
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                    {images.map((img, idx) => (
                      <button
                        key={img + idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={cn(
                          "relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl transition-all cursor-pointer",
                          activeImageIndex === idx
                            ? "ring-2 ring-amber-500 shadow-sm"
                            : "opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image src={img} alt={`${product.name} thumb ${idx + 1}`} fill className="object-cover object-center" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Buying Decision Hub (6 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Brand & Stock Pill */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={ROUTES.PRODUCTS}
                      className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-zinc-950 transition-colors"
                    >
                      {product.brand} Official
                    </Link>
                    <span className="text-[11px] text-muted-foreground font-mono">SKU: {product.sku}</span>
                  </div>

                  {product.inStock ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-600">Out of Stock</span>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="mt-3 text-2xl sm:text-3xl xl:text-4xl font-black tracking-tight text-foreground leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Short Review Summary */}
                <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 rounded-lg bg-amber-500/15 px-2 py-0.5 text-amber-700 dark:text-amber-400 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground font-medium">
                    {product.reviewCount} customer reviews
                  </span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-muted-foreground">
                    Aisle:{" "}
                    <strong className="text-foreground font-semibold">
                      {product.specifications?.Subcategory || product.categoryName}
                    </strong>
                  </span>
                </div>

                {/* Clean Frameless Pricing Box */}
                <div className="mt-5 p-5 rounded-3xl bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                      ৳{currentPrice.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > currentPrice && (
                      <>
                        <span className="text-base sm:text-lg text-muted-foreground line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                        <span className="rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-xs font-bold">
                          Save ৳{discountAmount.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Inclusive of VAT and official Bangladesh warranty. Free delivery in Dhaka metro.
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
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={cn(
                            "rounded-2xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs",
                            selectedVariantId === v.id
                              ? "bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                              : "bg-card text-foreground hover:bg-muted"
                          )}
                        >
                          <span>{v.name}</span>
                          {v.price !== product.price && (
                            <span className="ml-1.5 text-[11px] opacity-75">
                              (৳{v.price.toLocaleString()})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper & CTA Buttons */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Quantity:
                    </label>
                    <div className="flex items-center rounded-2xl bg-card shadow-2xs p-1">
                      <button
                        type="button"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 cursor-pointer transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-black">{quantity}</span>
                      <button
                        type="button"
                        disabled={quantity >= product.stock}
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {product.stock > 0 && quantity >= product.stock && (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                        Max stock reached
                      </span>
                    )}
                  </div>

                  {/* Primary Action Buttons */}
                  {product.stock <= 0 ? (
                    <div>
                      <Button
                        type="button"
                        variant="amber"
                        size="lg"
                        onClick={() => setShowNotifyStock(true)}
                        className="w-full rounded-2xl"
                      >
                        <BellRing className="h-4 w-4" />
                        <span>Notify Me When In Stock</span>
                      </Button>
                      <p className="text-center text-[11px] text-muted-foreground mt-1.5">
                        Get an instant SMS or Email notification when fresh stock arrives.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={isAdding ? "default" : "amber"}
                        size="lg"
                        onClick={handleAddToCart}
                        className={cn(
                          "w-full rounded-2xl font-bold shadow-md shadow-amber-500/20",
                          isAdding && "bg-emerald-600 text-white hover:bg-emerald-700"
                        )}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>{isAdding ? "Added to Cart!" : "Add to Cart"}</span>
                      </Button>

                      <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="w-full rounded-2xl font-bold shadow-md"
                      >
                        <Link href={`/checkout?directProduct=${product.slug}&qty=${quantity}`}>
                          <Zap className="h-4 w-4 fill-current text-amber-400" />
                          <span>Buy Now (Instant)</span>
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Delivery & Warranty Guarantees Strip (Clean micro-pill row) */}
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-border/40">
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card shadow-2xs">
                    <Truck className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-foreground">Express 24-48h</p>
                      <p className="text-[10px] text-muted-foreground">Dhaka & Nationwide</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card shadow-2xs">
                    <RotateCcw className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-foreground">7 Days Return</p>
                      <p className="text-[10px] text-muted-foreground">Doorstep replacement</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card shadow-2xs">
                    <Award className="h-4 w-4 text-purple-500 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-foreground">Official Warranty</p>
                      <p className="text-[10px] text-muted-foreground">Authorized service</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* ── Detailed Specifications & Description Tabs ── */}
        <m.section
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 pt-10 border-t border-border/70 space-y-6"
        >
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
        </m.section>

        {/* ── Related Products from Same Aisle ── */}
        {relatedProducts.length > 0 && (
          <m.section
            variants={sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14 pt-10 border-t border-border/70 space-y-6"
          >
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
                className="group inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-zinc-950 border border-amber-500/30 hover:border-amber-500 px-4 py-1.5 text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-amber-500/20 active:scale-95"
              >
                <span>View All</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.slice(0, 5).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </m.section>
        )}

        {/* ── Recently Viewed Products Section ── */}
        {recentlyViewed.length > 0 && (
          <m.section
            aria-label="Recently Viewed Products"
            variants={sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14 pt-10 border-t border-border/70 space-y-6"
          >
            <div className="rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-card p-3 sm:p-7 shadow-xl shadow-amber-500/5 dark:shadow-2xl dark:shadow-black/60">
              <div className="flex flex-row items-center justify-between gap-3 mb-4 sm:mb-5 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-xs">
                    <History className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <h2 className="text-base sm:text-2xl font-black tracking-tight text-foreground">
                        Recently Viewed
                      </h2>
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-400">
                        {recentlyViewed.length}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Pick up right where you left off in your shopping session
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
                {recentlyViewed.slice(0, 6).map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </m.section>
        )}

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
