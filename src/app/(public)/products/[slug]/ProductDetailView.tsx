"use client";

import React, { use } from "react";
import Link from "next/link";
import { PackageX, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants";
import { Button } from "@/components/common";
import { useGetProductBySlugQuery, useGetProductsQuery } from "@/services/api/products/productApi";
import { ProductView, ProductDetailSkeleton } from "@/components/product-detail";
import type { Product } from "@/types/ecommerce.types";

interface Props {
  params: Promise<{ slug: string }>;
  /** Pre-fetched product from the Server Component. When provided, the page
   *  renders immediately with data — no skeleton flash on first visit.
   *  RTK Query runs in background for stale-while-revalidate. */
  initialProduct?: Product | null;
}

export function ProductDetailView({ params, initialProduct }: Props) {
  const { slug } = use(params);

  // RTK Query — runs client-side for SWR background refresh.
  // When initialProduct is provided, skip the loading skeleton.
  const { data: product, isLoading: rtkLoading, isError } = useGetProductBySlugQuery(slug);

  // Use SSR-provided product immediately; RTK Query data takes over after hydration.
  const resolvedProduct = product ?? initialProduct ?? undefined;
  const isLoading = rtkLoading && !initialProduct;

  // Dynamically load related products from the same category excluding the current one
  const { data: relatedResponse } = useGetProductsQuery(
    { categoryId: resolvedProduct?.categoryId, limit: 8 },
    { skip: !resolvedProduct?.categoryId },
  );

  const relatedProducts = (relatedResponse?.data || []).filter(
    (p) => p.id !== resolvedProduct?.id,
  );

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !resolvedProduct) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="h-16 w-16 rounded-3xl bg-muted/60 text-muted-foreground flex items-center justify-center">
          <PackageX className="h-8 w-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Product Not Found
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The product you are looking for might have been moved, sold out, or is temporarily unavailable in our Bangladesh catalog.
          </p>
        </div>
        <Button asChild variant="amber" size="sm" className="rounded-2xl font-bold mt-2 shadow-md">
          <Link href={ROUTES.PRODUCTS} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Browse All Products</span>
          </Link>
        </Button>
      </div>
    );
  }

  return <ProductView product={resolvedProduct} relatedProducts={relatedProducts} />;
}
