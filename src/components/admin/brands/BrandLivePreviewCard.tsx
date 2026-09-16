"use client";

import React from "react";
import Image from "next/image";
import { Tag, Award } from "lucide-react";

interface BrandLivePreviewCardProps {
  name: string;
  slug: string;
  tag: string;
  featured: boolean;
  description: string;
  logoUrl: string | null;
}

export function BrandLivePreviewCard({
  name,
  slug,
  tag,
  featured,
  description,
  logoUrl,
}: BrandLivePreviewCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Tag className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Live Showcase Preview
        </span>
      </div>

      <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card border-none p-6 transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_20px_50px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_25px_60px_-10px_rgba(0,0,0,0.4)]">
        {/* Logo / Emblem */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-xs flex items-center justify-center p-2.5 bg-muted/30 border border-border/40 transition-transform group-hover:scale-105">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={name || "Brand logo"}
                fill
                className="object-contain p-1.5"
                unoptimized
              />
            ) : (
              <Award className="h-8 w-8 text-amber-500" />
            )}
          </div>

          <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {tag}
          </span>
        </div>

        {/* Title & Info */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-foreground tracking-tight">
            {name || "Brand Name"}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description || "Authentic official warranty products and verified direct imports."}
          </p>
        </div>

        {/* Meta tags */}
        <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>/{slug || "slug-url"}</span>
          {featured && (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              ★ Featured
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
