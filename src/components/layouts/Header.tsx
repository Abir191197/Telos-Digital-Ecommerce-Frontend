"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Tag,
  Truck,
  Info,
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  LayoutGrid,
  Flame,
  Laptop,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { Logo, ThemeToggle } from "@/components/common";
import { cn } from "@/lib/utils";

// ── Categories definition ─────────────────────────────────
const ALL_CATEGORIES = [
  {
    title: "Electronics & Gadgets",
    icon: Laptop,
    href: `${ROUTES.HOME}?category=electronics`,
    items: ["Smartphones & Tablets", "Laptops & Desktops", "Audio & Headphones", "Smart Wearables"],
  },
  {
    title: "Fashion & Lifestyle",
    icon: Sparkles,
    href: `${ROUTES.HOME}?category=fashion`,
    items: ["Men's Wear", "Women's Fashion", "Watches & Jewelry", "Bags & Footwear"],
  },
  {
    title: "Home & Living",
    icon: LayoutGrid,
    href: `${ROUTES.HOME}?category=home`,
    items: ["Home Decor", "Kitchen & Dining", "Smart Appliances", "Furniture"],
  },
  {
    title: "Digital Products & Software",
    icon: Flame,
    href: `${ROUTES.HOME}?category=digital`,
    items: ["UI Kits & Templates", "E-Books & Courses", "SaaS Subscriptions", "Digital Art"],
  },
];

const QUICK_CATEGORIES = [
  { label: "Electronics", href: `${ROUTES.HOME}?category=electronics`, badge: "Popular" },
  { label: "Fashion", href: `${ROUTES.HOME}?category=fashion` },
  { label: "Home Appliances", href: `${ROUTES.HOME}?category=home` },
  { label: "Digital Assets", href: `${ROUTES.HOME}?category=digital`, badge: "New" },
];

export function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const categoriesRef = React.useRef<HTMLDivElement>(null);

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md transition-colors shadow-xs">
      {/* ── Row 1: Top Bar (Dark Contrast, standard readable text) ── */}
      <div className="border-b border-black/20 bg-zinc-950 text-xs text-zinc-300 dark:bg-black dark:border-zinc-800 transition-colors">
        <div className="container flex h-9 items-center justify-between gap-3 px-4 sm:px-6">
          {/* Left: BD Support / Hotline */}
          <div className="flex items-center gap-2 shrink-0 text-xs sm:text-sm">
            <Phone className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden xs:inline text-zinc-400 font-normal">Support Hotline:</span>
            <a
              href="tel:+8801700000000"
              className="font-medium text-zinc-100 hover:text-amber-400 transition-colors"
            >
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
              <strong className="font-semibold text-amber-400">
                TELOS20
              </strong>{" "}
              for 20% off
            </span>
          </div>

          {/* Right: Quick Links (Track Order, About Us) */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-xs sm:text-sm">
            <Link
              href={ROUTES.TRACKING}
              className="flex items-center gap-1.5 text-zinc-200 hover:text-amber-300 transition-colors font-medium"
            >
              <Truck className="h-3.5 w-3.5 text-amber-400/90" />
              <span>Track Order</span>
            </Link>
            <span className="h-3.5 w-px bg-zinc-700" aria-hidden="true" />
            <Link
              href={ROUTES.ABOUT}
              className="flex items-center gap-1.5 text-zinc-200 hover:text-amber-300 transition-colors font-medium"
            >
              <Info className="h-3.5 w-3.5 text-amber-400/90" />
              <span>About Us</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 2: Main Branding, Centered Search & E-Commerce Utilities ── */}
      <div className="container flex h-18 items-center justify-between gap-4 sm:gap-6 py-2">
        {/* Brand Logo */}
        <div className="flex shrink-0 items-center">
          <Link href={ROUTES.HOME} className="group flex items-center">
            <Logo size={36} />
          </Link>
        </div>

        {/* Center: Prominent Search Box */}
        <div className="flex flex-1 items-center justify-center max-w-2xl px-1 sm:px-4">
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="group relative flex w-full items-center"
          >
            <div className="pointer-events-none absolute left-4 flex items-center text-muted-foreground transition-colors group-focus-within:text-amber-500">
              <Search className="h-4.5 w-4.5" />
            </div>

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, digital assets..."
              aria-label="Search catalog"
              className="h-11 w-full rounded-full border border-border/70 bg-muted/30 pl-11 pr-14 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/80 shadow-xs transition-all duration-200 hover:border-border hover:bg-muted/50 focus:border-amber-500 focus:bg-background focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
            />

            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs transition-all hover:bg-amber-600 active:scale-95"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Utilities */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={ROUTES.HOME}
            aria-label="Wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <Heart className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white shadow-xs">
              0
            </span>
          </Link>

          <Link
            href={ROUTES.HOME}
            aria-label="Shopping Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white shadow-xs">
              0
            </span>
          </Link>

          <ThemeToggle />

          <Link
            href={ROUTES.LOGIN}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
          >
            <User className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>

      {/* ── Row 3: Navigation Bar (Home, Expandable Categories, 3-4 Featured Categories) ── */}
      <div className="border-t border-border/60 bg-muted/20">
        <div className="container flex h-12 items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* All Categories Dropdown (Hover + Click) */}
            <div
              ref={categoriesRef}
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoriesOpen((prev) => !prev)}
                aria-expanded={categoriesOpen}
                className={cn(
                  "flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all hover:bg-amber-600 focus-visible:outline-none",
                  categoriesOpen && "bg-amber-600 ring-2 ring-amber-500/20"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                <span>All Categories</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    categoriesOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Mega / Expandable Categories Menu */}
              {categoriesOpen && (
                <div className="absolute left-0 top-full pt-1.5 z-50 w-80 sm:w-96">
                  <div className="rounded-xl border border-border/80 bg-popover p-2.5 text-popover-foreground shadow-xl backdrop-blur-lg animate-fade-in">
                    <div className="space-y-1.5">
                      {ALL_CATEGORIES.map((cat) => (
                        <div
                          key={cat.title}
                          className="group/item rounded-lg p-2.5 transition-colors hover:bg-muted/70"
                        >
                          <Link
                            href={cat.href}
                            onClick={() => setCategoriesOpen(false)}
                            className="flex items-center justify-between font-semibold text-sm text-foreground"
                          >
                            <span className="flex items-center gap-2.5">
                              <cat.icon className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                              {cat.title}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover/item:opacity-100 text-muted-foreground" />
                          </Link>
                          <div className="mt-2 pl-7 flex flex-wrap gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
                            {cat.items.slice(0, 3).map((sub) => (
                              <span
                                key={sub}
                                className="hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Home Navigation */}
            <Link
              href={ROUTES.HOME}
              className={cn(
                "px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-foreground",
                pathname === ROUTES.HOME
                  ? "font-bold text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
              )}
            >
              Home
            </Link>

            {/* 3-4 Quick Categories */}
            <div className="hidden sm:flex items-center gap-2">
              {QUICK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  <span>{cat.label}</span>
                  {cat.badge && (
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tight",
                        cat.badge === "Popular"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {cat.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right link in nav row */}
          <div className="hidden lg:flex items-center gap-4 text-sm font-semibold text-muted-foreground">
            <Link
              href={`${ROUTES.HOME}?filter=deals`}
              className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Flame className="h-4 w-4 fill-amber-500/20" />
              <span>Flash Deals</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
