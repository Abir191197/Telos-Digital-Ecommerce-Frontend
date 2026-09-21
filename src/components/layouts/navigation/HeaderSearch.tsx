"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { AppImage } from "@/components/shared";
import { useGetProductsQuery } from "@/services/api/products/productApi";

interface HeaderSearchProps {
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isMobile?: boolean;
}

export function HeaderSearch({
  searchQuery,
  onSearchQueryChange,
  onSubmit,
}: HeaderSearchProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search query for backend lookup
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isFetching } = useGetProductsQuery(
    {
      searchTerm: debouncedQuery,
      limit: 6,
    },
    {
      skip: !debouncedQuery || debouncedQuery.length < 2,
    }
  );

  const matchedProducts = searchResults?.data || [];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    onSubmit(e);
  };

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    router.push(ROUTES.PRODUCT_DETAIL(slug));
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 justify-center max-w-[210px] xs:max-w-[260px] sm:max-w-md md:max-w-2xl mx-auto"
    >
      <form
        onSubmit={handleFormSubmit}
        className="relative flex w-full items-center"
        role="search"
      >
        <Search className="absolute left-2.5 md:left-3.5 h-3.5 w-3.5 md:h-4.5 md:w-4.5 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onFocus={() => {
            if (searchQuery.trim().length >= 2) setIsOpen(true);
          }}
          onChange={(e) => {
            onSearchQueryChange(e.target.value);
            if (e.target.value.trim().length >= 2) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          }}
          placeholder="Search products..."
          aria-label="Search catalog"
          className="h-8 md:h-11 w-full rounded-full border border-border/80 bg-muted/40 pl-8 md:pl-11 pr-7 md:pr-10 text-[11px] md:text-sm placeholder:text-[11px] md:placeholder:text-sm text-foreground placeholder:text-muted-foreground/70 shadow-xs transition-all duration-200 hover:border-amber-500/40 hover:bg-muted/60 focus:border-amber-500 focus:bg-background focus:ring-1.5 md:focus:ring-4 focus:ring-amber-500/15 focus:outline-none"
        />

        {searchQuery.trim().length > 0 && (
          <button
            type="button"
            onClick={() => {
              onSearchQueryChange("");
              setIsOpen(false);
            }}
            aria-label="Clear search query"
            className="absolute right-2 md:right-3 flex h-4.5 w-4.5 md:h-6 md:w-6 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-amber-500/20 hover:text-amber-500 transition-all duration-150 active:scale-90 cursor-pointer"
          >
            <X className="h-3 w-3 md:h-3.5 md:w-3.5 stroke-[2.5]" />
          </button>
        )}
      </form>

      {/* ── Live Search Dropdown ── */}
      {isOpen && searchQuery.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border/30">
            {isFetching ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                <span>Searching catalog...</span>
              </div>
            ) : matchedProducts.length > 0 ? (
              <>
                <div className="p-1.5 space-y-1">
                  {matchedProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectProduct(product.slug || product.id)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/60 transition-colors text-left group cursor-pointer"
                    >
                      <div className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-muted/40 border border-border/40">
                        <AppImage
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          fallbackIconSize={18}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {product.brand} • <span className="font-semibold text-foreground">৳{product.price.toLocaleString()}</span>
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-2 bg-muted/20 border-t border-border/40 text-center">
                  <Link
                    href={`/products?q=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 py-1"
                  >
                    <span>View all matching results</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-8 px-4 text-center space-y-1">
                <p className="text-xs font-bold text-foreground">
                  No products found for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Press enter to browse full catalog with related keywords
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
