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
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Luggage,
  MapPin,
  Package,
  Phone,
  Printer,
  Search,
  Settings,
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
  X,
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

// Quick Highlight Categories for Row 3 with icons
const QUICK_CATEGORIES = [
  {
    label: "Smartphones",
    slug: "smartphones-tablets",
    href: ROUTES.CATEGORY_DETAIL("smartphones-tablets"),
    icon: Smartphone,
    badge: "Hot",
  },
  {
    label: "Laptops",
    slug: "laptops-macbooks",
    href: ROUTES.CATEGORY_DETAIL("laptops-macbooks"),
    icon: Laptop,
    badge: "Popular",
  },
  {
    label: "Audio & Wearables",
    slug: "audio-headphones",
    href: ROUTES.CATEGORY_DETAIL("audio-headphones"),
    icon: Headphones,
  },
];

export function Header() {
  const pathname = usePathname();
  const mounted = useMounted();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = React.useState<string>(
    categories[0]?.slug || "smartphones-tablets",
  );
  const categoriesRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Auth, Cart & Wishlist live state
  const rawCartCount = useCartStore((state) => state.getItemCount());
  const openCart = useCartStore((state) => state.openCart);
  const rawWishlistCount = useWishlistStore((state) => state.items.length);
  const authUser = useAuthStore((state) => state.user);
  const storeLogout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogout();
    setProfileOpen(false);
  };

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
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
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
      {/* ── Row 1: Top Bar (Thematic Deep Obsidian, Sharp Contrast) ── */}
      <div className="border-b border-zinc-800 bg-[#0c0d0e] text-xs text-zinc-300 dark:bg-[#08090a] dark:border-zinc-800/80 transition-colors">
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
              placeholder="Search 250+ authentic gadgets, laptops & electronics..."
              aria-label="Search catalog"
              className="h-11 w-full rounded-full border border-border/80 bg-muted/40 pl-11 pr-24 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm text-foreground placeholder:text-muted-foreground/70 shadow-xs transition-all duration-200 hover:border-amber-500/40 hover:bg-muted/60 focus:border-amber-500 focus:bg-background focus:ring-4 focus:ring-amber-500/15 focus:outline-none"
            />

            {/* Thematic Clear Cross Button */}
            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-11 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-amber-500/20 hover:text-amber-500 transition-all duration-150 active:scale-90 cursor-pointer"
              >
                <X className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            )}

            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-sm shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <Search className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* Right Utilities */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={ROUTES.WISHLIST}
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
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="User account menu"
                className={cn(
                  "group flex items-center gap-2 rounded-full p-1 sm:pr-3 transition-all duration-200 cursor-pointer bg-card/60 hover:bg-card hover:shadow-md active:scale-98",
                  profileOpen && "bg-card shadow-lg"
                )}>
                {/* Minimalist Avatar or Monogram Disc */}
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 text-foreground font-bold text-xs shadow-inner overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[11px] font-extrabold tracking-tight text-zinc-100 uppercase">
                      {user.name ? user.name.slice(0, 2) : "U"}
                    </span>
                  )}
                  {/* Tiny Active Session Dot */}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1.5 ring-background" />
                </div>

                {/* Minimalist Clean First Name */}
                <span className="hidden sm:inline-block max-w-[90px] truncate text-xs font-semibold text-foreground/90 group-hover:text-foreground">
                  {user.name.split(" ")[0]}
                </span>

                <ChevronDown
                  className={cn(
                    "hidden sm:block h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
                    profileOpen && "rotate-180 text-amber-500"
                  )}
                />
              </button>

              {/* ── Profile Dropdown Menu (Borderless with luxury shadow) ── */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2.5 w-64 origin-top-right rounded-3xl bg-popover/98 p-2 text-popover-foreground shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.75)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  {/* User Summary Header */}
                  <div className="px-3 py-2.5 bg-muted/40 rounded-2xl mb-1.5">
                    <p className="text-xs font-bold text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {user.email}
                    </p>
                    {user.phone && (
                      <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                        {user.phone}
                      </p>
                    )}
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-1 text-xs font-medium">
                    {/* Customer Account Section */}
                    <div className="px-2 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Customer Account
                    </div>

                    <Link
                      href={ROUTES.ACCOUNT}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                      <span className="flex items-center gap-2.5">
                        <LayoutGrid className="h-4 w-4 text-amber-500 shrink-0" />
                        <span className="font-semibold">My Account Hub</span>
                      </span>
                    </Link>

                    <Link
                      href={ROUTES.PROFILE}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                      <User className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href={ROUTES.ACCOUNT}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                      <span className="flex items-center gap-2.5">
                        <Package className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>Orders & Tracking</span>
                      </span>
                      <span className="text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                        Live
                      </span>
                    </Link>

                    <Link
                      href={ROUTES.ACCOUNT}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                      <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Saved Addresses</span>
                    </Link>

                    <Link
                      href={ROUTES.WISHLIST}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                      <span className="flex items-center gap-2.5">
                        <Heart className="h-4 w-4 text-rose-500 shrink-0" />
                        <span>Wishlist</span>
                      </span>
                      {wishlistCount > 0 && (
                        <span className="text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    {/* Merchant & Admin Portal Section (Separate & Distinct) */}
                    <div className="pt-2 mt-1 border-t border-border/60">
                      <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Staff & Administration
                      </div>
                      <Link
                        href={ROUTES.DASHBOARD}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-foreground hover:bg-zinc-800/60 transition-colors font-semibold"
                      >
                        <span className="flex items-center gap-2.5">
                          <LayoutDashboard className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>Merchant Dashboard</span>
                        </span>
                        <span className="text-[10px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                          Admin
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Divider & Logout */}
                  <div className="pt-1.5 mt-1 border-t border-border/60">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer">
                      <LogOut className="h-4 w-4 shrink-0" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
            className="h-10 w-full rounded-full border border-border/80 bg-muted/40 pl-10 pr-20 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm text-foreground placeholder:text-muted-foreground/80 shadow-xs transition-all focus:border-amber-500 focus:bg-background focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
          />
          {searchQuery.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search query"
              className="absolute right-10 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-amber-500/20 hover:text-amber-500 transition-all duration-150 active:scale-90 cursor-pointer"
            >
              <X className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          )}
          <button
            type="submit"
            aria-label="Submit search"
            className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-xs transition-all hover:scale-105 active:scale-95">
            <Search className="h-3.5 w-3.5 stroke-[2.5]" />
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
            {/* Home Navigation (First Item) */}
            <Link
              href={ROUTES.HOME}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted/60",
                pathname === ROUTES.HOME
                  ? "font-bold text-amber-600 dark:text-amber-400 bg-muted/40"
                  : "text-muted-foreground hover:text-foreground",
              )}>
              <HomeIcon className={cn("h-4 w-4 shrink-0 stroke-[2.2]", pathname === ROUTES.HOME ? "text-amber-500" : "text-muted-foreground")} />
              <span>Home</span>
            </Link>

            {/* Categories Button (Transparent / No Background) */}
            <button
              type="button"
              onClick={() => setCategoriesOpen((prev) => !prev)}
              onMouseEnter={() => {
                setCategoriesOpen(true);
                setActiveCategorySlug("smartphones-tablets");
              }}
              aria-expanded={categoriesOpen}
              className={cn(
                "flex items-center gap-2 rounded-xl bg-transparent hover:bg-muted/60 text-foreground px-3.5 py-2 text-sm font-semibold active:scale-98 focus-visible:outline-none cursor-pointer transition-all",
                categoriesOpen && "bg-muted/80 text-amber-500",
              )}>
              <LayoutGrid className="h-4 w-4 shrink-0 stroke-[2.2] text-amber-500" />
              <span>Categories</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 stroke-[2.2] text-muted-foreground",
                  categoriesOpen && "rotate-180 text-amber-500",
                )}
              />
            </button>

            {/* Quick Categories with Icons & Interactive Hover Mega Card Trigger */}
            <div className="hidden sm:flex items-center gap-1.5">
              {QUICK_CATEGORIES.map((cat) => {
                const isCatActive =
                  categoriesOpen && activeCategorySlug === cat.slug;
                const CatIcon = cat.icon;
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
                      "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                      isCatActive
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}>
                    <CatIcon className={cn("h-4 w-4 shrink-0 stroke-[2.2]", isCatActive ? "text-amber-500" : "text-muted-foreground/80")} />
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
                      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border/50 mb-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Categories ({categories.length})
                        </div>
                        <Link
                          href={ROUTES.CATEGORIES}
                          onClick={() => setCategoriesOpen(false)}
                          className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500 hover:text-white dark:hover:text-zinc-950 px-2.5 py-1 text-[11px] font-extrabold text-amber-600 dark:text-amber-400 shadow-xs transition-all duration-200 group"
                        >
                          <Grid className="h-3 w-3 text-amber-500 group-hover:text-inherit" />
                          <span>View All</span>
                          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
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

                    {/* Middle Column: Active Category Details, Subcategories & Products with Images (6 cols) */}
                    <div className="md:col-span-5 lg:col-span-5 p-5 flex flex-col justify-between bg-muted/10">
                      <div>
                        {/* Active Category Header */}
                        <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-foreground">
                                {activeCategory?.name}
                              </h3>
                              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                {activeCategory?.itemCount}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                              {activeCategory?.description}
                            </p>
                          </div>

                          <Link
                            href={ROUTES.CATEGORY_DETAIL(activeCategory?.slug || "")}
                            onClick={() => setCategoriesOpen(false)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500 hover:text-white dark:hover:text-zinc-950 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-xs transition-all shrink-0 group"
                          >
                            <span>View All</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </Link>
                        </div>

                        {/* Subcategories Pills */}
                        <div className="mt-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Popular Subcategories
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {activeCategory?.subcategories.slice(0, 6).map((sub) => (
                              <Link
                                key={sub.id}
                                href={ROUTES.CATEGORY_DETAIL(activeCategory?.slug || "")}
                                onClick={() => setCategoriesOpen(false)}
                                className="rounded-lg bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Category Products Quick Grid (4 items) */}
                        <div className="mt-4">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Featured in {activeCategory?.name}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {activeCategoryProducts.slice(0, 4).map((prod) => (
                              <Link
                                key={prod.id}
                                href={ROUTES.PRODUCT_DETAIL(prod.slug)}
                                onClick={() => setCategoriesOpen(false)}
                                className="group flex flex-col rounded-2xl bg-card p-2 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5"
                              >
                                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/40">
                                  <Image
                                    src={prod.thumbnail}
                                    alt={prod.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 15vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  {prod.discountPercentage && prod.discountPercentage > 0 ? (
                                    <span className="absolute top-1 left-1 rounded-full bg-rose-600 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-xs">
                                      -{prod.discountPercentage}%
                                    </span>
                                  ) : null}
                                </div>
                                <h4 className="mt-1.5 text-xs font-semibold text-foreground line-clamp-1 group-hover:text-amber-500 transition-colors">
                                  {prod.name}
                                </h4>
                                <div className="mt-0.5 text-xs font-extrabold text-foreground">
                                  ৳{prod.price.toLocaleString()}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Subtle status indicator */}
                      <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground/70">
                        <span className="text-[11px]">Click any product to view specs & discounts</span>
                        <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">Direct BD Stock</span>
                      </div>
                    </div>

                    {/* Right Column: 2 Stacked Feature Cards (Products & Categories) */}
                    <div className="md:col-span-3 lg:col-span-3 p-3.5 flex flex-col justify-between gap-3 bg-card">
                      {/* Card 1: Explore All Products (Warm Amber-Orange Gradient) */}
                      <div className="flex-1 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-amber-500/16 via-orange-500/10 to-amber-500/5 p-4 shadow-xs transition-all hover:shadow-md hover:from-amber-500/20 hover:via-orange-500/12">
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card/90 backdrop-blur-xs shadow-xs text-amber-500">
                              <Package className="h-5 w-5 stroke-[2.2]" />
                            </div>
                            <span className="rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                              250+ Items
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-foreground tracking-tight">
                            Explore All Products
                          </h4>
                          <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                            Filter by price, brands, in-stock items, and certified BD warranties.
                          </p>
                        </div>
                        <div className="pt-3">
                          <Link
                            href={ROUTES.PRODUCTS}
                            onClick={() => setCategoriesOpen(false)}
                            className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-2 text-xs font-bold shadow-xs transition-all hover:shadow-md hover:shadow-amber-500/20 active:scale-95"
                          >
                            <span>Browse Catalog</span>
                            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>

                      {/* Card 2: Full Category Directory (Sophisticated Slate-Indigo Gradient) */}
                      <div className="flex-1 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-500/12 via-slate-500/8 to-muted/50 dark:from-indigo-500/15 dark:via-zinc-800/60 dark:to-muted/30 p-4 shadow-xs transition-all hover:shadow-md hover:from-indigo-500/16 hover:via-slate-500/12">
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card/90 backdrop-blur-xs shadow-xs text-indigo-500 dark:text-indigo-400">
                              <LayoutGrid className="h-5 w-5 stroke-[2.2]" />
                            </div>
                            <span className="rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-[10px] font-bold">
                              {categories.length} Aisles
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-foreground tracking-tight">
                            Category Directory
                          </h4>
                          <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                            Comprehensive department directory and curated niche collections.
                          </p>
                        </div>
                        <div className="pt-3">
                          <Link
                            href={ROUTES.CATEGORIES}
                            onClick={() => setCategoriesOpen(false)}
                            className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 px-3 py-2 text-xs font-bold shadow-xs transition-all active:scale-95"
                          >
                            <span>All Categories</span>
                            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>
                        </div>
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
              className="group flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors">
              <span className="inline-flex items-center justify-center">
                <Flame className="h-4.5 w-4.5 fill-amber-500 text-amber-500 animate-flame transition-transform" />
              </span>
              <span className="group-hover:underline">Flash Deals</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
