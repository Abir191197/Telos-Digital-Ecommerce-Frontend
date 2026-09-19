"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { useGetCategoryTreeQuery } from "@/services/api/categories/categoryApi";
import { useGetProductsQuery } from "@/services/api/products/productApi";
import { CategoriesView, CategoriesPageSkeleton } from "@/components/categories";

export function CategoriesPageView() {
  const { data: categories = [], isLoading: catsLoading } = useGetCategoryTreeQuery();
  const { data: productsResponse } = useGetProductsQuery({
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 4,
  });

  const popularProducts = productsResponse?.data || [];

  if (catsLoading) {
    return <CategoriesPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Compact Header & Breadcrumb ── */}
      <div className="border-b border-border/40 bg-muted/20 py-3 mb-6 sm:mb-8">
        <div className="container px-3 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href={ROUTES.HOME}
              className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-border">/</span>
            <span className="font-semibold text-foreground">Categories</span>
          </nav>
        </div>
      </div>

      {/* ── Client View with Filters, Subcategories & Popular Rail ── */}
      <CategoriesView
        categories={categories}
        popularProducts={popularProducts}
      />
    </div>
  );
}
