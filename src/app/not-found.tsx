import Link from "next/link";
import { ROUTES } from "@/constants";
import {
  Home,
  ShoppingBag,
  Grid,
  Search,
  ArrowLeft,
  Headphones,
  Sparkles,
  Compass,
} from "lucide-react";

export default function NotFound() {
  const quickLinks = [
    {
      title: "All Products Catalog",
      desc: "Explore 250+ tech gadgets, laptops & smartphones",
      href: ROUTES.PRODUCTS,
      icon: ShoppingBag,
      badge: "250+ Items",
    },
    {
      title: "Browse Categories",
      desc: "Find devices by category and collection",
      href: ROUTES.CATEGORIES,
      icon: Grid,
      badge: "25+ Categories",
    },
    {
      title: "Customer Account",
      desc: "Track existing orders and view delivery updates",
      href: ROUTES.PROFILE,
      icon: Compass,
      badge: "Tracking",
    },
  ];

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 sm:py-24 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="h-80 w-80 translate-x-32 -translate-y-20 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Visual 404 Stamp Badge */}
        <div className="relative inline-flex items-center justify-center">
          <span className="select-none font-black text-7xl sm:text-9xl tracking-tighter text-amber-500/15">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 backdrop-blur-md shadow-xs">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Page Not Found</span>
            </div>
          </div>
        </div>

        {/* Heading & Context */}
        <div className="space-y-3 max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Oops! This product or page has vanished.
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The link you clicked might be outdated, the item was discontinued, or the address was mistyped. Don&apos;t worry—our catalog is full of authentic gear with official BD warranty.
          </p>
        </div>

        {/* Priority Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background px-6 py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-foreground/10 hover:opacity-90 active:scale-98 transition-all cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white px-6 py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Explore Catalog</span>
          </Link>

          <Link
            href={ROUTES.CATEGORIES}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/80 bg-card hover:bg-muted/60 text-foreground px-5 py-3.5 text-xs sm:text-sm font-bold shadow-xs active:scale-98 transition-all cursor-pointer"
          >
            <Grid className="h-4 w-4 text-amber-500" />
            <span>All Categories</span>
          </Link>
        </div>

        {/* Thematic Quick Navigation Cards */}
        <div className="pt-4 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 text-center sm:text-left">
            Or Jump Directly To:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-md cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Customer Support Strip */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Need help finding a specific product or shipment?</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+8801700000000"
              className="font-bold text-foreground hover:text-amber-600 transition-colors"
            >
              Hotline: +880 1700-000000
            </a>
            <span className="text-border">•</span>
            <Link
              href={ROUTES.CONTACT}
              className="font-bold text-amber-600 hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
