export interface CatalogFilterState {
  search: string;
  categorySlug?: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating-desc" | "newest";
}

export type GridViewMode = "grid-3" | "grid-4" | "list";
