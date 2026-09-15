"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Category, Product } from "@/types/ecommerce.types";
import { SupportAndHelpstrip, TrustGuaranteeCards } from "@/components/shared";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useRecentlyViewedStore } from "@/stores";
import { useMounted } from "@/hooks";
import {
  CATEGORY_GROUPS,
  INITIAL_BATCH_SIZE,
  BATCH_INCREMENT,
  fadeInUp,
  CategoryFilterHeader,
  CategoryGridSection,
  CategoryPopularSection,
  CategoryRecentlyViewedSection,
} from "./";

interface CategoriesViewProps {
  categories: Category[];
  popularProducts: Product[];
}

export function CategoriesView({
  categories,
  popularProducts,
}: CategoriesViewProps) {
  const mounted = useMounted();
  const rawRecentlyViewed = useRecentlyViewedStore((state) => state.items);
  const recentlyViewed = mounted ? rawRecentlyViewed : [];

  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const gridSectionRef = useRef<HTMLElement>(null);

  // Filtered categories based on selected group & search query
  const filteredCategories = useMemo(() => {
    let list = categories;

    if (selectedGroup !== "all") {
      const groupDef = CATEGORY_GROUPS.find((g) => g.id === selectedGroup);
      if (groupDef && "match" in groupDef) {
        list = list.filter((c) =>
          (groupDef.match as readonly string[]).includes(c.slug)
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    return list;
  }, [categories, selectedGroup, searchQuery]);

  // When changing group or search, reset visible batch
  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handleClearFilters = () => {
    setSelectedGroup("all");
    setSearchQuery("");
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  // Infinite scroll trigger sentinel ref
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Sliced items for display
  const displayedCategories = useMemo(() => {
    return filteredCategories.slice(0, visibleCount);
  }, [filteredCategories, visibleCount]);

  const hasMore = visibleCount < filteredCategories.length;

  // Infinite scroll trigger
  useEffect(() => {
    if (!hasMore) return;

    let isFetching = false;

    const handleCheck = () => {
      if (isFetching || !hasMore) return;
      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const rect = sentinel.getBoundingClientRect();
      // Trigger when user scrolls to within 180px of sentinel
      if (rect.top <= window.innerHeight + 180) {
        isFetching = true;
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) =>
            Math.min(prev + BATCH_INCREMENT, filteredCategories.length)
          );
          setIsLoadingMore(false);
          isFetching = false;
        }, 650);
      }
    };

    window.addEventListener("scroll", handleCheck, { passive: true });
    window.addEventListener("resize", handleCheck, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleCheck);
      window.removeEventListener("resize", handleCheck);
    };
  }, [hasMore, visibleCount, filteredCategories.length]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-10 sm:space-y-14">
        {/* 1. Search Bar & Parent Group Filter Tabs */}
        <CategoryFilterHeader
          selectedGroup={selectedGroup}
          searchQuery={searchQuery}
          filteredCount={filteredCategories.length}
          totalCount={categories.length}
          onGroupChange={handleGroupChange}
          onSearchChange={handleSearchChange}
          onClearSearch={() => setSearchQuery("")}
          onResetFilters={handleClearFilters}
        />

        {/* 2. High-Conversion Category Grid */}
        <CategoryGridSection
          gridSectionRef={gridSectionRef}
          displayedCategories={displayedCategories}
          totalFilteredCount={filteredCategories.length}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          sentinelRef={sentinelRef}
          onClearFilters={handleClearFilters}
        />

        {/* 3. Most Popular Across Categories Rail */}
        <CategoryPopularSection products={popularProducts} />

        {/* 4. Recently Viewed Products Section */}
        <CategoryRecentlyViewedSection products={recentlyViewed} />

        {/* 5. High-Density BD Trust & Guarantee Cards */}
        <m.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="container px-3 sm:px-6"
        >
          <TrustGuaranteeCards />
        </m.div>

        {/* 6. Customer Hotline & Support Strip */}
        <m.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="container px-3 sm:px-6"
        >
          <SupportAndHelpstrip />
        </m.section>
      </div>
    </LazyMotion>
  );
}
