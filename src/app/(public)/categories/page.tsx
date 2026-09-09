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
      <section className="container mt-10 sm:mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComponent =
              (cat.icon && CATEGORY_ICON_MAP[cat.icon]) || LayoutGrid;

            return (
              <Link
                key={cat.id}
                href={ROUTES.CATEGORY_DETAIL(cat.slug)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/5"
              >
                {/* Visual Category Cover Image */}
                <div className="relative h-44 w-full overflow-hidden bg-muted/40">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Floating Category Icon & Item Count Badge */}
                  <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-background/90 backdrop-blur-md text-amber-500 shadow-md">
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <span className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                    {cat.itemCount} items
                  </span>

                  {/* Overlay Title on bottom of image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="text-lg font-bold text-white drop-shadow-md truncate">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Subcategories preview tags */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {cat.subcategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub.id}
                          className="rounded-md bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground group-hover:bg-muted group-hover:text-foreground transition-colors"
                        >
                          {sub.name}
                        </span>
                      ))}
                      {cat.subcategories.length > 3 && (
                        <span className="rounded-md bg-muted/30 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          +{cat.subcategories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <span>Explore Products</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
