"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { m, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  Share2,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/ecommerce.types";

interface ProductGalleryProps {
  product: Product;
  activeImageUrl?: string;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onShare: () => void;
  showShareToast: boolean;
  isAdmin?: boolean;
}

export function ProductGallery({
  product,
  activeImageUrl,
  isWishlisted,
  onToggleWishlist,
  onShare,
  showShareToast,
  isAdmin = false,
}: ProductGalleryProps) {
  const rawImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  // If variant image is provided and not in images array, prepend it
  const images =
    activeImageUrl && !rawImages.includes(activeImageUrl)
      ? [activeImageUrl, ...rawImages]
      : rawImages;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

  const selectImage = (newIndex: number, dir?: 1 | -1) => {
    if (newIndex === activeImageIndex) return;
    const determinedDir = dir ?? (newIndex > activeImageIndex ? 1 : -1);
    setSlideDirection(determinedDir);
    setActiveImageIndex(newIndex);
  };

  useEffect(() => {
    if (activeImageUrl) {
      const idx = images.findIndex((img) => img === activeImageUrl);
      if (idx !== -1 && idx !== activeImageIndex) {
        setSlideDirection(idx > activeImageIndex ? 1 : -1);
        setActiveImageIndex(idx);
      }
    }
  }, [activeImageUrl, images, activeImageIndex]);

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prevIdx = activeImageIndex > 0 ? activeImageIndex - 1 : images.length - 1;
    selectImage(prevIdx, -1);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextIdx = activeImageIndex < images.length - 1 ? activeImageIndex + 1 : 0;
    selectImage(nextIdx, 1);
  };

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 32 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 32 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 40;
    if (diff > minSwipeDistance) {
      handleNextImage();
    } else if (diff < -minSwipeDistance) {
      handlePrevImage();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <div className="w-full space-y-3">
      {/* 📱 Mobile View: Swipeable Carousel Stage 📱 */}
      <div
        className="block lg:hidden relative aspect-square w-full overflow-hidden rounded-3xl bg-muted/20 select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={slideDirection}>
          <m.div
            key={activeImageIndex}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const threshold = 40;
              if (info.offset.x < -threshold) {
                handleNextImage();
              } else if (info.offset.x > threshold) {
                handlePrevImage();
              }
            }}
            className="absolute inset-0 h-full w-full"
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
        </AnimatePresence>

        {/* Left/Right Carousel Nav Arrows on Mobile */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

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
            onClick={onShare}
            aria-label="Share product"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-muted-foreground shadow-xs hover:text-foreground hover:bg-background transition-all cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
          </button>
          {!isAdmin && (
            <button
              type="button"
              onClick={onToggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md shadow-xs transition-all cursor-pointer",
                isWishlisted ? "text-rose-600" : "text-muted-foreground hover:text-rose-600"
              )}
            >
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-rose-600 text-rose-600")} />
            </button>
          )}
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
                onClick={() => selectImage(dotIdx)}
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

      {/* 🖥️ Desktop View: Traditional Media Stage + Thumbnails (Hidden on Mobile) 🖥️ */}
      <div className="hidden lg:block space-y-4">
        {/* Main Stage Image */}
        <div className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-muted/20 border border-border/60">
          <AnimatePresence initial={false} custom={slideDirection}>
            <m.div
              key={activeImageIndex}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 h-full w-full"
            >
              <Image
                src={images[activeImageIndex] || product.thumbnail}
                alt={product.name}
                fill
                priority
                sizes="50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105 select-none"
              />
            </m.div>
          </AnimatePresence>

          {/* Desktop Prev / Next Carousel Arrow Buttons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous photo"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground shadow-md opacity-0 group-hover:opacity-100 hover:bg-background transition-all cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next photo"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground shadow-md opacity-0 group-hover:opacity-100 hover:bg-background transition-all cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

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
              onClick={onShare}
              aria-label="Share product"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-muted-foreground shadow-xs hover:text-foreground hover:bg-background transition-all cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
            </button>
            {!isAdmin && (
              <button
                type="button"
                onClick={onToggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md shadow-xs transition-all cursor-pointer",
                  isWishlisted ? "text-rose-600" : "text-muted-foreground hover:text-rose-600"
                )}
              >
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-rose-600 text-rose-600")} />
              </button>
            )}
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
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-0.5">
            {images.map((img, idx) => (
              <button
                key={img + idx}
                type="button"
                onClick={() => selectImage(idx)}
                className={cn(
                  "relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl transition-all cursor-pointer border-2 bg-muted/20",
                  activeImageIndex === idx
                    ? "border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                    : "border-border/60 hover:border-border opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover object-center"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
