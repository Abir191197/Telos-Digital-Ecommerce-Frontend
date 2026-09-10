"use client";

import { Logo, ThemeToggle } from "@/components/common";
import { ROUTES } from "@/constants";
import { categories, products } from "@/data";
import { useMounted } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAuthStore, useCartStore, useWishlistStore } from "@/stores";
import {
  ArrowRight,
  Baby,
  BookOpen,
  Camera,
  Car,
  ChevronDown,
  Cpu,
  Dog,
  Dumbbell,
  Flame,
  Footprints,
  Gamepad2,
  Gem,
  Glasses,
  Grid,
  Headphones,
  Heart,
  Home as HomeIcon,
  Info,
  Laptop,
  LayoutGrid,
  Luggage,
  Phone,
  Printer,
  Search,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkle,
  Sparkles,
  Tag,
  Truck,
  Tv,
  User,
  UtensilsCrossed,
  Watch,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

// Map category icons to Lucide icons
const CATEGORY_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Camera,
  Cpu,
  Tv,
  Home: HomeIcon,
  Shirt,
  Sparkles,
  Footprints,
  Sparkle,
  Gem,
  ShieldCheck,
  Wifi,
  Printer,
  Dumbbell,
  Car,
  BookOpen,
  Luggage,
  Baby,
  Glasses,
  UtensilsCrossed,
  Dog,
};

// 4 Quick Highlight Categories for Row 3
const QUICK_CATEGORIES = [
  {
    label: "Smartphones",
    slug: "smartphones-tablets",
    href: ROUTES.CATEGORY_DETAIL("smartphones-tablets"),
    badge: "Hot",
  },
  {
    label: "Laptops",
    slug: "laptops-macbooks",
    href: ROUTES.CATEGORY_DETAIL("laptops-macbooks"),
    badge: "Popular",
  },
  {
    label: "Audio & Wearables",
    slug: "audio-headphones",
    href: ROUTES.CATEGORY_DETAIL("audio-headphones"),
  },
];

export function Header() {
  const pathname = usePathname();
  const mounted = useMounted();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = React.useState<string>(
    categories[0]?.slug || "smartphones-tablets",
  );
  const categoriesRef = React.useRef<HTMLDivElement>(null);

  // Auth, Cart & Wishlist live state
  const rawCartCount = useCartStore((state) => state.getItemCount());
  const openCart = useCartStore((state) => state.openCart);
  const rawWishlistCount = useWishlistStore((state) => state.items.length);
  const authUser = useAuthStore((state) => state.user);

  const cartCount = mounted ? rawCartCount : 0;
  const wishlistCount = mounted ? rawWishlistCount : 0;
  const user = mounted ? authUser : null;

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(e.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
  };

  // Find active category & sample products for the image preview
  const activeCategory = React.useMemo(() => {
    return (
      categories.find((c) => c.slug === activeCategorySlug) || categories[0]
    );
  }, [activeCategorySlug]);

  const activeCategoryProducts = React.useMemo(() => {
    if (!activeCategory) return [];
    return products
      .filter((p) => p.categorySlug === activeCategory.slug)
      .slice(0, 6);
  }, [activeCategory]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md transition-colors shadow-xs">
      {/* ── Row 1: Top Bar (Dark Contrast, standard readable text) ── */}
      <div className="border-b border-black/20 bg-zinc-950 text-xs text-zinc-300 dark:bg-black dark:border-zinc-800 transition-colors">
        <div className="container flex h-9 items-center justify-between gap-3 px-4 sm:px-6">
          {/* Left: BD Support / Hotline */}
          <div className="flex items-center gap-2 shrink-0 text-xs sm:text-sm">
            <Phone className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden xs:inline text-zinc-400 font-normal">
              Support Hotline:
            </span>
            <a
              href="tel:+8801700000000"
              className="font-medium text-zinc-100 hover:text-amber-400 transition-colors">
              +880 1700-000000
            </a>
          </div>

          {/* Center: Discount Promotion Announcement */}
          <div className="hidden md:flex items-center gap-2 overflow-hidden text-center truncate text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300 tracking-wide">
              <Tag className="h-3 w-3" />
              HOT DEAL
            </span>
            <span className="truncate text-zinc-200">
              Free delivery on orders over ৳2,000 | Use code{" "}
              <strong className="text-amber-400 font-mono tracking-wider underline underline-offset-2">
                TELOS20
              </strong>{" "}
              for 20% OFF
            </span>
          </div>

          {/* Right: Quick Links */}
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-300">
            <Link
              href={ROUTES.TRACKING}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Truck className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Track Order</span>
            </Link>
            <span className="h-3 w-px bg-zinc-800" />
            <Link
              href={ROUTES.ABOUT}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Info className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">About Us</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 2: Main Header Bar (Logo, Large Search, Cart, Wishlist, Theme) ── */}
      <div className="container flex h-18 items-center justify-between gap-4 sm:gap-8">
        {/* Brand Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <Logo size={36} />
        </Link>

        {/* Big Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex w-full items-center"
            role="search">
            <Search className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 250+ products, gadgets, fashion & brands..."
              aria-label="Search catalog"
              className="h-11 w-full rounded-full border border-border/70 bg-muted/30 pl-11 pr-14 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/80 shadow-xs transition-all duration-200 hover:border-border hover:bg-muted/50 focus:border-amber-500 focus:bg-background focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />

            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs transition-all hover:bg-amber-600 active:scale-95">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Utilities */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={ROUTES.HOME}
            aria-label="Wishlist"
            className="hidden md:flex relative h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white shadow-xs animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label="Shopping Cart"
            className="hidden md:flex relative h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white shadow-xs animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>

          <ThemeToggle />

          {user ? (
            <Link
              href={ROUTES.PROFILE}
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-amber-500/20 transition-colors">
              <div className="relative h-6 w-6 overflow-hidden rounded-full border border-amber-500/50">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-full w-full p-0.5 text-amber-600" />
                )}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">
                {user.name.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-muted/60 transition-colors">
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile Always-Visible Search Bar ── */}
      <div className="md:hidden px-4 pb-3">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex w-full items-center"
          role="search">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands & categories..."
            aria-label="Search catalog"
            className="h-10 w-full rounded-full border border-border/80 bg-muted/40 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground/80 shadow-xs transition-all focus:border-amber-500 focus:bg-background focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs transition-all hover:bg-amber-600 active:scale-95">
            <Search className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* ── Row 3: Navigation Bar (Home, Expanded Categories, Quick Links, Flash Deals) ── */}
      {/* Hidden on mobile: Home and Categories are in bottom navigation */}
      <div className="hidden md:block border-t border-border/60 bg-muted/20">
        <div className="container flex h-12 items-center justify-between gap-4">
          {/* Categories & Quick Highlights Container with Seamless Hover Mega Menu */}
          <div
            ref={categoriesRef}
            className="relative flex items-center gap-1 sm:gap-2"
            onMouseLeave={() => setCategoriesOpen(false)}>
            {/* Primary Categories Button (Click toggles, Hover opens) */}
            <button
              type="button"
              onClick={() => setCategoriesOpen((prev) => !prev)}
              onMouseEnter={() => {
                setCategoriesOpen(true);
                setActiveCategorySlug("smartphones-tablets");
              }}
              aria-expanded={categoriesOpen}
              className={cn(
                "flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all hover:bg-amber-600 focus-visible:outline-none cursor-pointer",
                categoriesOpen && "bg-amber-600 ring-2 ring-amber-500/20",
              )}>
              <LayoutGrid className="h-4 w-4 shrink-0" />
              <span>Categories</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  categoriesOpen && "rotate-180",
                )}
              />
            </button>

            {/* Home Navigation */}
            <Link
              href={ROUTES.HOME}
              className={cn(
                "px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-foreground",
                pathname === ROUTES.HOME
                  ? "font-bold text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground",
              )}>
              Home
            </Link>

            {/* Quick Categories with Interactive Hover Mega Card Trigger */}
            <div className="hidden sm:flex items-center gap-1.5">
              {QUICK_CATEGORIES.map((cat) => {
                const isCatActive =
                  categoriesOpen && activeCategorySlug === cat.slug;
                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    onMouseEnter={() => {
                      setActiveCategorySlug(cat.slug);
                      setCategoriesOpen(true);
                    }}
                    onClick={() => setCategoriesOpen(false)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                      isCatActive
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}>
                    <span>{cat.label}</span>
                    {cat.badge && (
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tight",
                          cat.badge === "Hot"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                        )}>
                        {cat.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Rich Expanded Categories Mega Menu ── */}
            {categoriesOpen && (
              <div className="absolute left-0 top-full pt-2 z-50 w-[min(96vw,1200px)] animate-fade-in">
                <div className="overflow-hidden rounded-2xl border border-border/80 bg-popover/98 text-popover-foreground shadow-2xl backdrop-blur-xl transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border/60">
                    {/* Left Column: Categories List with Icons & Item Counts (4 cols) */}
                    <div className="md:col-span-4 max-h-[480px] overflow-y-auto p-2.5 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                      <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Browse Categories ({categories.length})
                      </div>
                      <div className="space-y-1 mt-1">
                        {categories.map((cat) => {
                          const IconComponent =
                            (cat.icon && CATEGORY_ICON_MAP[cat.icon]) ||
                            LayoutGrid;
                          const isActive = cat.slug === activeCategorySlug;

                          return (
                            <Link
                              key={cat.id}
                              href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                              onMouseEnter={() =>
                                setActiveCategorySlug(cat.slug)
                              }
                              onClick={() => setCategoriesOpen(false)}
                              className={cn(
                                "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all",
                                isActive
                                  ? "bg-amber-500 text-white font-semibold shadow-xs"
                                  : "text-foreground hover:bg-muted/70",
                              )}>
                              <span className="flex items-center gap-2.5 truncate">
                                <IconComponent
                                  className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    isActive
                                      ? "text-white"
                                      : "text-amber-500 group-hover:scale-110",
                                  )}
                                />
                                <span className="truncate">{cat.name}</span>
                              </span>
                              <span
                                className={cn(
                                  "ml-2 text-xs font-medium rounded-full px-1.5 py-0.5 shrink-0",
                                  isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-muted text-muted-foreground group-hover:text-foreground",
                                )}>
                                {cat.itemCount}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Active Category Details, Subcategories & Products with Images (8 cols) */}
                    <div className="md:col-span-8 p-5 md:p-6 flex flex-col justify-between bg-muted/10">
                      <div>
                        {/* Active Category Header */}
                        <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3.5">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h3 className="text-lg font-bold text-foreground">
                                {activeCategory?.name}
                              </h3>
                              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                {activeCategory?.itemCount} Products
                              </span>
                            </div>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-1">
                              {activeCategory?.description}
                            </p>
                          </div>

                          <Link
                            href={ROUTES.CATEGORY_DETAIL(
                              activeCategory?.slug || "",
                            )}
                            onClick={() => setCategoriesOpen(false)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-500 hover:text-white dark:text-amber-400 transition-all shrink-0">
                            <span>Explore Category</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>

                        {/* Subcategories Pills */}
                        <div className="mt-3.5">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Popular Subcategories
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {activeCategory?.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={ROUTES.CATEGORY_DETAIL(
                                  activeCategory?.slug || "",
                                )}
                                onClick={() => setCategoriesOpen(false)}
                                className="rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-amber-500 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Category Products with Real Images (6 items, 3 cols sm / 6 cols lg) */}
                        <div className="mt-4">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Featured in {activeCategory?.name}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                            {activeCategoryProducts.map((prod) => (
                              <Link
                                key={prod.id}
                                href={ROUTES.PRODUCT_DETAIL(prod.slug)}
                                onClick={() => setCategoriesOpen(false)}
                                className="group flex flex-col rounded-xl border border-border/60 bg-background p-2 transition-all hover:border-amber-500/60 hover:shadow-md">
                                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted/30">
                                  <Image
                                    src={prod.thumbnail}
                                    alt={prod.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  {prod.discountPercentage &&
                                  prod.discountPercentage > 0 ? (
                                    <span className="absolute top-1 left-1 rounded bg-rose-600 px-1 py-0.2 text-[9px] font-bold text-white shadow-xs">
                                      -{prod.discountPercentage}%
                                    </span>
                                  ) : null}
                                </div>
                                <h4 className="mt-1.5 text-xs font-semibold text-foreground line-clamp-1 group-hover:text-amber-600 transition-colors">
                                  {prod.name}
                                </h4>
                                <div className="mt-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                                  ৳{prod.price.toLocaleString()}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ── Bottom Strip: Card to Visit All Products + View All Categories Button ── */}
                      <div className="mt-4 pt-3 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Card to Visit All Products */}
                        <Link
                          href={ROUTES.CATEGORIES}
                          onClick={() => setCategoriesOpen(false)}
                          className="group flex w-full sm:w-auto items-center gap-3 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-2.5 hover:border-amber-500 hover:from-amber-500/20 transition-all">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
                            <ShoppingBag className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex-1 pr-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-amber-600 transition-colors">
                              <span>Explore All 250+ Products</span>
                              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              Complete catalog with instant BD delivery
                            </p>
                          </div>
                        </Link>

                        {/* View All Categories Button */}
                        <Link
                          href={ROUTES.CATEGORIES}
                          onClick={() => setCategoriesOpen(false)}
                          className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-xs hover:border-amber-500 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400 transition-all shrink-0">
                          <Grid className="h-3.5 w-3.5 text-amber-500" />
                          <span>View All Categories</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right link in nav row */}
          <div className="hidden lg:flex items-center gap-4 text-sm font-semibold text-muted-foreground">
            <Link
              href={`${ROUTES.HOME}?filter=deals`}
              className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:underline">
              <Flame className="h-4 w-4 fill-amber-500/20" />
              <span>Flash Deals</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
