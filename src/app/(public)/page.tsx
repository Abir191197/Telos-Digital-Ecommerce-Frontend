import type { Metadata } from "next";
import {
  HeroBanner,
  QuickCategoryBar,
  FlashDealsSection,
  FeaturedProductsTabs,
  BentoShowcaseSection,
  AuthenticityGuaranteeBanner,
  ShopByBudgetSection,
  CategorySpotlightBanner,
  CategoryAisleSection,
  DeliveryAndReturnBanner,
  BestSellersLeaderboard,
  OfficialBrandsSection,
  SupportAndHelpstrip,
} from "@/components/home";
import { TrendingSearchesStrip } from "@/components/shared";

export const metadata: Metadata = {
  title: "Telos Cart — Next-Gen Digital & Retail E-Commerce",
  description:
    "Explore authentic electronics, curated fashion, home essentials, and digital software products with fast delivery across Bangladesh.",
};

export default function HomePage() {
  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* ── Full-Width Hero Slider ── */}
      <HeroBanner autoSwipeDurationMs={2800} />

      {/* ── Center-Aligned Page Body ── */}
      <div className="container px-3 sm:px-6 pb-16 space-y-10 sm:space-y-14">
        {/* Quick Category Bar */}
        <QuickCategoryBar />

        {/* Trending Searches & Aisles Strip */}
        <TrendingSearchesStrip />

        {/* Flash Deals with Live Countdown */}
        <FlashDealsSection />

        {/* ── Official Brand Stores Marquee (Apple, Samsung, Google, Sony, etc.) ── */}
        <OfficialBrandsSection />

        {/* Curated Products Tabs (Featured / Trending / New / Top Rated) */}
        <FeaturedProductsTabs />

        {/* Dynamic Multi-Height & Multi-Weight Bento Lifestyle Showcase */}
        <BentoShowcaseSection />

        {/* ── Trust Advertising Banner 1: 100% Genuine & Official BD Warranty ── */}
        <AuthenticityGuaranteeBanner />

        {/* Shop By Budget Section (Under ৳5k, Under ৳15k, Under ৳35k, ৳35k+) */}
        <ShopByBudgetSection />

        {/* Category Spotlight Zone (Smartphones & Tablets) */}
        <CategorySpotlightBanner />

        {/* Category Aisle 1: Laptops & Computing */}
        <CategoryAisleSection
          categorySlug="laptops-macbooks"
          badge="Computing Hub"
          badgeColor="bg-blue-500/10 text-blue-600 border-blue-500/20"
          title="Laptops, MacBooks & Ultrabooks"
          subtitle="Top performance laptops for creators, software developers, and professionals"
          limit={5}
        />

        {/* ── Trust Advertising Banner 2: Express Delivery + 7-Day Easy Return Split Cards ── */}
        <DeliveryAndReturnBanner />

        {/* Best Sellers Leaderboard (#1, #2, #3, #4) */}
        <BestSellersLeaderboard />

        {/* Category Aisle 2: Audio & Headphones */}
        <CategoryAisleSection
          categorySlug="audio-headphones"
          badge="Sound & Beats"
          badgeColor="bg-purple-500/10 text-purple-600 border-purple-500/20"
          title="Audio, Headphones & TWS Earbuds"
          subtitle="Immerse in high-fidelity sound, noise cancelling headsets, and Bluetooth speakers"
          limit={5}
        />

        {/* ── Trust Advertising Banner 3: Dedicated BD Hotline & Instant Help ── */}
        <SupportAndHelpstrip />
      </div>
    </div>
  );
}
