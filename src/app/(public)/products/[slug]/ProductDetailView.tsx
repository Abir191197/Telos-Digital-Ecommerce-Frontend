"use client";

import React, { use } from "react";
import Link from "next/link";
import { PackageX, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants";
import { PageLoader, Button } from "@/components/common";
import { useGetProductBySlugQuery, useGetProductsQuery } from "@/services/api/products/productApi";
import { ProductView } from "@/components/product-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export function ProductDetailView({ params }: Props) {
  const { slug } = use(params);
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug);

  // Dynamically load related products from the same category excluding the current one
  const { data: relatedResponse } = useGetProductsQuery(
    { categoryId: product?.categoryId, limit: 8 },
    { skip: !product?.categoryId }
  );

  const relatedProducts = (relatedResponse?.data || []).filter((p) => p.id !== product?.id);

  if (isLoading) {
    return (
      <PageLoader
        title="Loading Product Details..."
        description="Fetching high-resolution imagery, variants, stock, and customer reviews."
        badgeText="Product Catalog"
      />
    );
  }

  if (isError || !product) {
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

  return <ProductView product={product} relatedProducts={relatedProducts} />;
}
