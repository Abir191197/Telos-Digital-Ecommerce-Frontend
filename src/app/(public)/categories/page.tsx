import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data";
import {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Camera,
  Cpu,
  Tv,
  Home as HomeIcon,
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
  LayoutGrid,
  ArrowRight,
  Layers,
} from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "All Categories | Telos Cart - Digital Storefront",
  description:
    "Explore all product categories at Telos Cart: Smartphones, Laptops, Gaming, Wearables, Fashion, Audio, and more with genuine BD warranty.",
};

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
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

export default function CategoriesPage() {
  const totalProducts = categories.reduce((sum, c) => sum + c.itemCount, 0);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Hero Banner Section ── */}
      <section className="relative border-b border-border/60 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Layers className="h-3.5 w-3.5" />
              Complete Catalog
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Browse All Categories
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl">
              Discover {categories.length} curated categories and over {totalProducts} verified authentic products with official Bangladesh warranty and express delivery.
            </p>
          </div>
        </div>
      </section>

      {/* ── Categories Grid ── */}
      <section className="container mt-8 sm:mt-12 px-3 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {categories.map((cat) => {
            const IconComponent =
              (cat.icon && CATEGORY_ICON_MAP[cat.icon]) || LayoutGrid;

            return (
              <Link
                key={cat.id}
                href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/5"
              >
                {/* Visual Category Cover Image */}
                <div className="relative h-28 sm:h-36 md:h-40 w-full overflow-hidden bg-muted/40">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Floating Category Icon & Item Count Badge */}
                  <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-background/90 backdrop-blur-md text-amber-500 shadow-sm">
                    <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>

                  <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white">
                    {cat.itemCount}
                  </span>

                  {/* Overlay Title on bottom of image */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-2.5 sm:left-3 sm:right-3">
                    <h2 className="text-xs sm:text-sm md:text-base font-bold text-white drop-shadow-md truncate">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5">
                  <div>
                    <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-snug">
                      {cat.description}
                    </p>

                    {/* Subcategories preview tags */}
                    <div className="mt-2 hidden sm:flex flex-wrap gap-1">
                      {cat.subcategories.slice(0, 2).map((sub) => (
                        <span
                          key={sub.id}
                          className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground group-hover:bg-muted group-hover:text-foreground transition-colors truncate max-w-full"
                        >
                          {sub.name}
                        </span>
                      ))}
                      {cat.subcategories.length > 2 && (
                        <span className="rounded bg-muted/30 px-1 py-0.5 text-[10px] text-muted-foreground">
                          +{cat.subcategories.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
