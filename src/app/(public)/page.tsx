import type { Metadata } from "next";
import { HeroBanner } from "@/components/shared";

export const metadata: Metadata = {
  title: "Telos Cart — Next-Gen Digital & Retail E-Commerce",
  description:
    "Explore authentic electronics, curated fashion, home essentials, and digital software products with fast delivery across Bangladesh.",
};

export default function HomePage() {
  return (
    <div className="w-full space-y-12">
      {/* ── Full-Width Hero Slider (Light in light mode, Dark in dark mode) ── */}
      <HeroBanner autoSwipeDurationMs={2800} />

      {/* ── Center-Aligned Page Body with Minimum Side Gap ── */}
      <div className="container pb-16 space-y-8">
        {/* Further home sections (featured products, categories, flash deals) will sit here */}
      </div>
    </div>
  );
}
