"use client";

import { ROUTES } from "@/constants";
import { brands, products } from "@/data";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

// High-precision minimalist vector brand marks
function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 170 170"
      fill="currentColor"
      className={className}
      aria-label="Apple">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.71-7.92-12.02-14.53-6.53-10.01-11.43-20.95-14.7-32.82-3.27-11.87-4.9-22.95-4.9-33.24 0-14.18 3.58-26.04 10.74-35.59 7.16-9.55 16.29-14.39 27.38-14.52 4.8 0 10.06 1.34 15.78 4.02 5.72 2.68 9.53 4.08 11.43 4.2 1.7 0 5.65-1.4 11.87-4.2 6.22-2.8 11.45-4.14 15.7-4.02 12.02.58 21.68 5.25 28.98 14.02-10.66 6.45-15.88 15.34-15.66 26.68.22 8.71 3.58 16.03 10.09 21.96 6.5 5.92 14.15 9.29 22.94 10.09-2.23 6.97-4.91 14.06-8.03 21.28zM119.22 33.64c0-7.39 2.66-14.28 7.97-20.67 5.31-6.39 11.75-10.42 19.33-12.09.22 1.25.33 2.37.33 3.35 0 7.39-2.82 14.47-8.47 21.23-5.65 6.76-12.24 10.64-19.78 11.64-.22-1.12-.33-2.27-.33-3.46z" />
    </svg>
  );
}

function SamsungLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 45"
      fill="currentColor"
      className={className}
      aria-label="Samsung">
      <text
        x="50%"
        y="65%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        letterSpacing="3.5"
        fontSize="22">
        SAMSUNG
      </text>
    </svg>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function SonyLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 40"
      fill="currentColor"
      className={className}
      aria-label="Sony">
      <text
        x="50%"
        y="65%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Times New Roman', Georgia, serif"
        fontWeight="bold"
        letterSpacing="4.5"
        fontSize="24">
        SONY
      </text>
    </svg>
  );
}

function AsusLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 45"
      fill="currentColor"
      className={className}
      aria-label="Asus">
      <text
        x="50%"
        y="65%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontStyle="italic"
        letterSpacing="3"
        fontSize="22">
        ASUS
      </text>
    </svg>
  );
}

function XiaomiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Xiaomi">
      <rect width="48" height="48" rx="14" fill="#FF6900" />
      <path
        fill="#FFFFFF"
        d="M15 15h6v18h-6zm12 0h6v10.5c0 1.93 1.57 3.5 3.5 3.5h.5V33h-.5c-4.14 0-7.5-3.36-7.5-7.5V15z"
      />
    </svg>
  );
}

function OnePlusLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="OnePlus">
      <rect width="48" height="48" rx="10" fill="#EB0028" />
      <path fill="#FFFFFF" d="M22 13h4v8h8v4h-8v8h-4v-8h-8v-4h8v-8z" />
    </svg>
  );
}

function AnkerLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 40"
      fill="currentColor"
      className={className}
      aria-label="Anker">
      <text
        x="50%"
        y="65%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        letterSpacing="3"
        fontSize="20">
        ANKER
      </text>
    </svg>
  );
}

const LOGO_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Apple: AppleLogo,
  Samsung: SamsungLogo,
  Google: GoogleLogo,
  Sony: SonyLogo,
  OnePlus: OnePlusLogo,
  Xiaomi: XiaomiLogo,
  Asus: AsusLogo,
  Anker: AnkerLogo,
};

export function OfficialBrandsSection() {
  // Duplicate array for infinite seamless marquee
  const marqueeItems = [...brands, ...brands];

  return (
    <section
      aria-label="Official Brand Stores"
      className="w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-amber-500">
              <Sparkles className="h-3 w-3" />
              Direct Partnerships
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Official Brand Stores
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Authorized Bangladesh warranty and certified dealer support
          </p>
        </div>

        <Link
          href={`${ROUTES.HOME}?brand=all`}
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors shrink-0 group">
          <span>All Brands</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 text-amber-500" />
        </Link>
      </div>

      {/* Infinite Marquee Track with Fade Masks */}
      <div className="relative w-full overflow-hidden py-1">
        {/* Left Fade Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10 sm:w-20 bg-gradient-to-r from-background to-transparent"
        />

        {/* Right Fade Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 sm:w-20 bg-gradient-to-l from-background to-transparent"
        />

        {/* Scrolling Strip */}
        <div className="animate-marquee gap-3 sm:gap-4 select-none">
          {marqueeItems.map((brand, idx) => {
            const Logo = LOGO_MAP[brand.icon] || AppleLogo;
            const matchingCount = products.filter(
              (p) => p.brand.toLowerCase() === brand.name.toLowerCase(),
            ).length;

            return (
              <Link
                key={`${brand.id}-${idx}`}
                href={`${ROUTES.HOME}?brand=${brand.slug}`}
                className="group relative flex flex-col items-center justify-between w-[155px] sm:w-[180px] shrink-0 p-5 rounded-3xl bg-card text-card-foreground shadow-[0_4px_20px_-4px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.45)] hover:shadow-[0_14px_30px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.65)] hover:-translate-y-1 transition-all duration-300 text-center select-none overflow-hidden">
                {/* Ambient glow on hover - borderless design */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-amber-500/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                />

                {/* Logo Capsule */}
                <div className="relative z-10 flex h-16 w-full items-center justify-center text-foreground/80 group-hover:text-foreground transition-colors duration-200">
                  <Logo className="h-9 sm:h-10 max-w-[120px] object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>

                {/* Brand Info */}
                <div className="relative z-10 flex flex-col items-center gap-0.5 mt-2 w-full">
                  <span className="text-sm font-bold text-foreground group-hover:text-foreground transition-colors truncate w-full tracking-tight">
                    {brand.name}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground/80">
                    {matchingCount > 0 ? `${matchingCount} items` : brand.tag}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
