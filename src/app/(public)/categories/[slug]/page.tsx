import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory, categories } from "@/data";
import { ProductCard } from "@/components/common";
import {
  ChevronRight,
  SlidersHorizontal,
  ArrowLeft,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { ROUTES } from "@/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | Telos Cart",
    };
  }

  return {
    title: `${category.name} | Telos Cart Storefront`,
    description: category.description,
  };
}

// Generate static params for all 25 categories
export async function generateStaticParams() {
  return categories.map((c) => ({
    slug: c.slug,
  }));
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Breadcrumb & Category Header ── */}
      <section className="border-b border-border/60 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent py-8 sm:py-12">
        <div className="container">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <Link href={ROUTES.CATEGORIES} className="hover:text-foreground transition-colors">
              Categories
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="font-semibold text-foreground truncate">{category.name}</span>
          </nav>

          {/* Title & Stats */}
          <div className="mt-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Sparkles className="h-3 w-3" />
                <span>Official Department</span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {category.name}
              </h1>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {category.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={ROUTES.CATEGORIES}
                className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs hover:border-amber-500 hover:text-amber-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Categories</span>
              </Link>
            </div>
          </div>

          {/* Subcategories Filter Bar */}
          {category.subcategories.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                Filter by:
              </span>
              <span className="rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-bold shadow-xs">
                All ({categoryProducts.length})
              </span>
              {category.subcategories.map((sub) => (
                <span
                  key={sub.id}
                  className="rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium text-foreground hover:border-amber-500 hover:text-amber-600 cursor-pointer transition-colors"
                >
                  {sub.name} ({sub.itemCount})
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Products Grid & Product Count Bar ── */}
      <section className="container mt-8 sm:mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-semibold text-foreground">
            Showing <span className="text-amber-600 dark:text-amber-400 font-bold">{categoryProducts.length}</span> verified products
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Sort by: <strong>Featured</strong></span>
          </div>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
            <p className="text-base font-semibold text-foreground">No products found in this category</p>
            <p className="mt-1 text-xs text-muted-foreground">Check back soon for new additions.</p>
            <Link
              href={ROUTES.CATEGORIES}
              className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600"
            >
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
