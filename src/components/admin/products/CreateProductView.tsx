"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UploadCloud,
  X,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  DollarSign,
  Package,
  Eye,
  AlertTriangle,
  Star,
  ChevronDown,
  ChevronUp,
  Tag,
  Zap,
  Ticket,
  ImageIcon,
} from "lucide-react";
import { useAdminStore } from "@/stores";
import categoriesData from "@/data/categories.json";
import brandsData from "@/data/brands.json";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/ecommerce.types";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function CreateProductView() {
  const router = useRouter();
  const { addProduct } = useAdminStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState(brandsData[0]?.name || "Apple");
  const [categorySlug, setCategorySlug] = useState(
    categoriesData[0]?.slug || "smartphones-tablets"
  );
  const [price, setPrice] = useState<number | "">(95000);
  const [originalPrice, setOriginalPrice] = useState<number | "">(105000);
  const [stock, setStock] = useState<number>(15);
  const [badge, setBadge] = useState<string>("New");
  const [shortDesc, setShortDesc] = useState("");

  // Voucher / Promo Discount State
  const [hasVoucher, setHasVoucher] = useState(false);
  const [voucherType, setVoucherType] = useState<"percentage" | "flat">("percentage");
  const [voucherValue, setVoucherValue] = useState<number | "">(10);
  const [voucherCode, setVoucherCode] = useState<string>("TELOS10");
  const [showVoucherOnCard, setShowVoucherOnCard] = useState(true);

  // Advanced Options Accordion (Clean toggle so non-techy person isn't overwhelmed)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [warranty, setWarranty] = useState("1 Year Official Brand Warranty");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isFlashDeal, setIsFlashDeal] = useState(false);

  // Photos State
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Selected Category Object
  const selectedCategory =
    categoriesData.find((c) => c.slug === categorySlug) || categoriesData[0];

  // Image Upload handler
  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError(null);
    const validUrls: string[] = [];
    const oversizedFileNames: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        oversizedFileNames.push(`"${file.name}" (${sizeMb}MB)`);
      } else {
        const url = URL.createObjectURL(file);
        validUrls.push(url);
      }
    });

    if (oversizedFileNames.length > 0) {
      setImageError(
        `File exceeds ${MAX_FILE_SIZE_MB}MB limit: ${oversizedFileNames.join(", ")}. Please use smaller images.`
      );
    }

    if (validUrls.length > 0) {
      setImages((prev) => [...prev, ...validUrls]);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Preview Calculations
  const numericPrice = Number(price) || 0;
  const numericOriginal = Number(originalPrice) || 0;
  const discountPercent =
    numericOriginal > numericPrice && numericPrice > 0
      ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)
      : 0;

  const previewThumbnail =
    images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1511707171634-5f897ff0259f?auto=format&fit=crop&w=800&q=80";

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || numericPrice <= 0) return;

    setIsSubmitting(true);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const generatedSku =
      sku.trim() ||
      `TELOS-${brand.slice(0, 3).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: title.trim(),
      shortDescription:
        shortDesc.trim() ||
        `Authentic ${brand} ${title.trim()} backed with official Bangladesh manufacturer warranty.`,
      description:
        description.trim() ||
        `Authentic ${title.trim()} from ${brand}. Includes official verified importer coverage.`,
      categoryId: selectedCategory.id,
      categorySlug: selectedCategory.slug,
      categoryName: selectedCategory.name,
      price: numericPrice,
      originalPrice: numericOriginal > numericPrice ? numericOriginal : numericPrice,
      discountPercentage: discountPercent,
      currency: "BDT",
      rating: 5.0,
      reviewCount: 0,
      stock: Number(stock),
      inStock: Number(stock) > 0,
      isFeatured,
      isFlashDeal,
      isNewArrival: true,
      badge: (badge as any) || undefined,
      images: images.length > 0 ? images : [previewThumbnail],
      thumbnail: previewThumbnail,
      brand,
      sku: generatedSku,
      specifications: {
        Brand: brand,
        Warranty: warranty || "1 Year Official Warranty",
      },
      tags: ["official-store", "bangladesh-tech"],
      createdAt: new Date().toISOString(),
    };

    addProduct(newProduct);
    setSuccessToast(true);

    setTimeout(() => {
      router.push("/dashboard/products");
    }, 900);
  };

  return (
    <div className="w-full space-y-5 pb-24">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors shadow-2xs"
            title="Back to Product Catalog"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                Admin Catalog
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Quick Entry</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
              Add New Product
            </h1>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {successToast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <div className="text-xs font-medium">
            <strong className="font-bold">Product saved!</strong> &ldquo;{title}&rdquo; added to live inventory. Redirecting...
          </div>
        </div>
      )}

      {/* ── Main Two-Column Structure ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (8 cols): Card 1 (Upload Card) + Card 2 (Input Card) */}
        <div className="lg:col-span-8 space-y-6">
          {/* ══════════════════════════════════════════════
              CARD 1: PRODUCT PHOTO UPLOAD CARD
             ══════════════════════════════════════════════ */}
          <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Product Photos
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Upload product pictures from your device. First photo becomes the main store thumbnail.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                {images.length} photo{images.length === 1 ? "" : "s"}
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelect}
              className="hidden"
            />

            {/* Upload Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border/80 hover:border-amber-500 bg-muted/20 hover:bg-amber-500/5 p-6 text-center transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center gap-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-foreground hover:underline">
                    Click to browse photo(s)
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground"> or drag & drop here</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Supported formats: PNG, JPG, WebP (Max 5MB per image)
                </p>
              </div>
            </div>

            {/* Oversized Warning */}
            {imageError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-700 dark:text-rose-400 flex items-start gap-2.5 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block">Photo size too large</span>
                  <span className="text-[11px]">{imageError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setImageError(null)}
                  className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Thumbnails Gallery */}
            {images.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-foreground mb-2">
                  Uploaded Gallery (First is primary):
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border border-border bg-muted/40 shrink-0 shadow-2xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 rounded bg-amber-500 px-1 py-0.2 text-[8px] font-black uppercase text-zinc-950 shadow-xs">
                          Main
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="h-4 w-4 text-rose-400 hover:text-rose-300" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════
              CARD 2: PRODUCT INPUT DETAILS CARD
             ══════════════════════════════════════════════ */}
          <form
            id="unified-product-form"
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-6"
          >
            {/* Section: Basic Info */}
            <div className="space-y-4 pb-5 border-b border-border/50">
              <h3 className="text-sm font-bold text-foreground">
                Basic Information
              </h3>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple iPhone 16 Pro Max 256GB"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Brand <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                  >
                    {brandsData.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                    <option value="Other">Other Brand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                  >
                    {categoriesData.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Short Description (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fast A18 Pro chip, 5x Telephoto camera, Ceramic Shield."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Section: Price & Stock */}
            <div className="space-y-4 pb-5 border-b border-border/50">
              <h3 className="text-sm font-bold text-foreground">
                Pricing & Inventory
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Selling Price (৳) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="95000"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value ? Number(e.target.value) : "")
                    }
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Original Price (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="105000"
                    value={originalPrice}
                    onChange={(e) =>
                      setOriginalPrice(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Available Stock <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Storefront Badge
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Trending">Trending</option>
                    <option value="Hot">Hot</option>
                    <option value="Sale">Sale</option>
                    <option value="Official Warranty">Official Warranty</option>
                    <option value="">No Badge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Warranty Tenure
                  </label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g. 1 Year Official Brand Warranty"
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Interactive Voucher / Coupon Section with Toggle */}
              <div className="pt-2">
                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                        <Ticket className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">
                          Special Voucher / Promo Discount
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Attach an optional coupon code for extra discount on this item
                        </p>
                      </div>
                    </div>

                    {/* Main ON/OFF Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasVoucher}
                        onChange={(e) => setHasVoucher(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                      <span className="ml-2 text-[11px] font-bold text-foreground">
                        {hasVoucher ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>

                  {/* Expanded Voucher Controls when ON */}
                  {hasVoucher && (
                    <div className="space-y-3 pt-2 border-t border-border/50 animate-in fade-in slide-in-from-top-1 duration-150">
                      {/* Discount Type Pill Selector */}
                      <div>
                        <label className="block text-[11px] font-bold text-foreground mb-1.5">
                          Discount Type
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/40 border border-border/60">
                          <button
                            type="button"
                            onClick={() => {
                              setVoucherType("percentage");
                              if (!voucherValue || Number(voucherValue) > 100) setVoucherValue(10);
                            }}
                            className={cn(
                              "py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                              voucherType === "percentage"
                                ? "bg-amber-500 text-zinc-950 shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            % Percentage Off
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setVoucherType("flat");
                              if (!voucherValue || Number(voucherValue) <= 100) setVoucherValue(500);
                            }}
                            className={cn(
                              "py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                              voucherType === "flat"
                                ? "bg-amber-500 text-zinc-950 shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            ৳ Flat Money Off
                          </button>
                        </div>
                      </div>

                      {/* Value and Coupon Code Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-foreground mb-1">
                            {voucherType === "percentage" ? "Discount Percentage (%)" : "Discount Amount (৳)"}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max={voucherType === "percentage" ? 99 : 500000}
                              placeholder={voucherType === "percentage" ? "10" : "500"}
                              value={voucherValue}
                              onChange={(e) => setVoucherValue(e.target.value ? Number(e.target.value) : "")}
                              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                              {voucherType === "percentage" ? "%" : "৳"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-foreground mb-1">
                            Coupon Code
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. TELOS10"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Storefront Card Visibility Toggle */}
                      <label className="flex items-center justify-between p-2 rounded-xl bg-background/60 border border-border/60 hover:bg-background cursor-pointer transition-colors">
                        <div>
                          <span className="text-xs font-bold text-foreground block">
                            Show Voucher Badge on Storefront Card
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            When enabled, customers see coupon ribbon directly on the product card
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={showVoucherOnCard}
                          onChange={(e) => setShowVoucherOnCard(e.target.checked)}
                          className="h-4 w-4 rounded accent-amber-500 cursor-pointer ml-3 shrink-0"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Optional Details Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors text-xs font-bold text-foreground cursor-pointer"
              >
                <span>Additional Details (SKU, Full Description, Deals)</span>
                {showAdvanced ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 p-4 rounded-2xl bg-muted/15 border border-border/60 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      SKU Reference
                    </label>
                    <input
                      type="text"
                      placeholder="Leave blank to auto-generate (TELOS-...)"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Full Details / Specs
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detailed features, box contents, battery capacity..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-1">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="h-4 w-4 rounded accent-amber-500"
                      />
                      <span>Feature on Homepage</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFlashDeal}
                        onChange={(e) => setIsFlashDeal(e.target.checked)}
                        className="h-4 w-4 rounded accent-amber-500"
                      />
                      <span>Include in Flash Deals</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Link
                href="/dashboard/products"
                className="px-4 py-2.5 rounded-xl border border-border/80 bg-card text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSubmitting ? "Saving..." : "Save Product"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT (4 cols): Real-Time Live Preview Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Eye className="h-3.5 w-3.5 text-amber-500" />
              <span>Real-Time Storefront Preview</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>

          {/* Actual Storefront Product Card Mockup */}
          <div className="relative flex flex-col rounded-3xl bg-card text-card-foreground p-3 border border-border/80 shadow-md">
            {/* Image Box */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted/40 flex items-center justify-center">
              {images.length > 0 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewThumbnail}
                  alt={title || "Product preview"}
                  className="h-full w-full object-cover transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground/60 gap-1.5 p-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground/50">
                    <ImageIcon className="h-7 w-7" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground/70">
                    Product Photo Preview
                  </span>
                </div>
              )}

              {/* Discount or Custom Badge */}
              {discountPercent > 0 ? (
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-zinc-950 shadow-xs">
                  <Zap className="h-3 w-3 fill-zinc-950" />
                  <span>-{discountPercent}%</span>
                </div>
              ) : badge ? (
                <div className="absolute top-2.5 left-2.5 rounded-full bg-zinc-900/85 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                  {badge}
                </div>
              ) : null}

              <div className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/85 backdrop-blur-md text-muted-foreground shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              </div>
            </div>

            {/* Info Body */}
            <div className="flex flex-1 flex-col px-1 pt-3 pb-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-bold uppercase tracking-wider text-foreground">
                  {brand || "Brand"}
                </span>
                <span className="truncate max-w-[130px] text-[10px]">
                  {selectedCategory.name}
                </span>
              </div>

              <h4 className="mt-1 font-bold text-sm text-foreground line-clamp-2 leading-snug">
                {title || "Product Title Will Appear Here"}
              </h4>

              {shortDesc && (
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                  {shortDesc}
                </p>
              )}

              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="ml-1 font-bold text-foreground text-[11px]">
                    5.0
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">(New SKU)</span>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
                </span>
              </div>

              {/* Price Row */}
              <div className="mt-3 pt-2 border-t border-border/50 flex items-baseline justify-between">
                <div>
                  <span className="text-base font-extrabold text-foreground">
                    ৳{numericPrice > 0 ? numericPrice.toLocaleString() : "0"}
                  </span>
                  {numericOriginal > numericPrice && (
                    <span className="ml-2 text-xs line-through text-muted-foreground">
                      ৳{numericOriginal.toLocaleString()}
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  {warranty.split(" ")[0]} Yr Warranty
                </span>
              </div>

              {/* Live Voucher Pill in Preview */}
              {hasVoucher && showVoucherOnCard && voucherCode && (
                <div className="mt-2.5 flex items-center justify-between rounded-xl bg-amber-500/10 border border-dashed border-amber-500/35 px-2.5 py-1 text-[10px] text-amber-700 dark:text-amber-300 font-bold animate-in fade-in duration-200">
                  <span className="flex items-center gap-1.5">
                    <Ticket className="h-3.5 w-3.5 text-amber-500" />
                    <span>
                      {voucherType === "percentage"
                        ? `${voucherValue || 0}% OFF with ${voucherCode}`
                        : `৳${(voucherValue || 0).toLocaleString()} OFF with ${voucherCode}`}
                    </span>
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                    Coupon
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Helper Note for Admin */}
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-3 text-[11px] text-muted-foreground space-y-1">
            <p className="font-bold text-foreground">💡 How customers see it</p>
            <p>
              This preview matches your storefront product card layout. Updates change instantly as you type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
