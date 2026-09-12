import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, getProductsByCategory, categories } from "@/data";
import { CategoryDetailView } from "@/components/categories";
import { ROUTES } from "@/constants";
import { ChevronRight } from "lucide-react";

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

  // Get other sister/popular categories to display at bottom of page
  const sisterCategories = categories
    .filter((c) => c.slug !== category.slug)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* ── Breadcrumb Navigation ── */}
      <div className="border-b border-border/60 bg-muted/20 py-3">
        <div className="container px-3 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
            <Link href={ROUTES.CATEGORIES} className="hover:text-foreground transition-colors">
              Categories
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
            <span className="font-semibold text-foreground truncate">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Category Detail Rich Hub ── */}
      <CategoryDetailView
        category={category}
        initialProducts={categoryProducts}
        sisterCategories={sisterCategories}
      />
    </div>
  );
}
