import categoriesData from "./categories.json";
import productsData from "./products.json";
import type { Category, Product } from "@/types/ecommerce.types";

export const categories: Category[] = categoriesData as unknown as Category[];
export const products: Product[] = productsData as unknown as Product[];

// Helper query selectors for components & pages
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getFlashDeals(): Product[] {
  return products.filter((p) => p.isFlashDeal);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
