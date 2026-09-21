"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

// Minimalist vector brand marks
export function AppleLogo({ className }: { className?: string }) {
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

export function SamsungLogo({ className }: { className?: string }) {
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

export function GoogleLogo({ className }: { className?: string }) {
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

export function SonyLogo({ className }: { className?: string }) {
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

export function AsusLogo({ className }: { className?: string }) {
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

export function XiaomiLogo({ className }: { className?: string }) {
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

export function OnePlusLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="OnePlus">
      <rect width="48" height="48" rx="10" fill="#EB0028" />
      <path fill="#FFFFFF" d="M22 13h4v8h8v4h-8v8h-4v-8h-8v-4h8v-8z" />
    </svg>
  );
}

export function AnkerLogo({ className }: { className?: string }) {
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

export function VivoLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 45"
      fill="currentColor"
      className={className}
      aria-label="vivo">
      <text
        x="50%"
        y="65%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        letterSpacing="4"
        fontSize="24">
        vivo
      </text>
    </svg>
  );
}

export const BRAND_LOGO_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  apple: AppleLogo,
  samsung: SamsungLogo,
  google: GoogleLogo,
  sony: SonyLogo,
  oneplus: OnePlusLogo,
  xiaomi: XiaomiLogo,
  asus: AsusLogo,
  anker: AnkerLogo,
  vivo: VivoLogo,
};

interface BrandLogoDisplayProps {
  name: string;
  slug?: string | null;
  image?: string | null;
  className?: string;
}

export function BrandLogoDisplay({
  name,
  slug,
  image,
  className = "h-9 sm:h-10 max-w-[120px]",
}: BrandLogoDisplayProps) {
  const [imgError, setImgError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  // Reset imgError & aspect ratio state when image URL or name changes
  React.useEffect(() => {
    setImgError(false);
    setAspectRatio(null);
  }, [image, name, slug]);

  const normalizedKey = (slug?.trim().toLowerCase() || name?.trim().toLowerCase() || "");
  const SvgLogo = BRAND_LOGO_MAP[normalizedKey] || BRAND_LOGO_MAP[name?.trim().toLowerCase() || ""];

  // Dynamic optical scale factor based on natural aspect ratio:
  // - Wide logos (AR > 2.0 like SONY, SAMSUNG, ASUS) need slight boost or full width
  // - Square / Tall logos (AR < 1.3 like Apple, Xiaomi, OnePlus) are optical giants, so we cushion scale to prevent them from overpowering
  const dynamicScaleClass = React.useMemo(() => {
    if (!aspectRatio) return "scale-100";
    if (aspectRatio > 2.2) return "scale-105"; // wide wordmarks
    if (aspectRatio < 1.25) return "scale-[0.82]"; // compact/square marks
    if (aspectRatio < 1.5) return "scale-[0.90]";
    return "scale-100";
  }, [aspectRatio]);

  // 1. Database image has top priority if provided and hasn't failed to load
  if (image && !imgError) {
    const isRemote = image.startsWith("http://") || image.startsWith("https://");

    return (
      <div
        className={`relative w-full flex items-center justify-center overflow-hidden transition-transform duration-300 ${dynamicScaleClass} ${className}`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 120px, 160px"
          unoptimized={isRemote}
          className="object-contain object-center p-0.5"
          onLoad={(e) => {
            const target = e.currentTarget;
            if (target.naturalWidth && target.naturalHeight) {
              setAspectRatio(target.naturalWidth / target.naturalHeight);
            }
          }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // 2. Vector brand SVG fallback if database image is not uploaded or failed
  if (SvgLogo) {
    // Svg logos also get normalized optical scaling based on known archetype
    const isWideSvg = ["samsung", "sony", "asus", "anker", "vivo"].includes(normalizedKey);
    const isSquareSvg = ["apple", "xiaomi", "oneplus"].includes(normalizedKey);
    const svgScale = isWideSvg ? "scale-105" : isSquareSvg ? "scale-[0.85]" : "scale-100";

    return (
      <div className={`relative flex items-center justify-center ${svgScale}`}>
        <SvgLogo className={className} />
      </div>
    );
  }

  // 3. Monogram initial or photo icon fallback
  if (name?.trim()) {
    return (
      <span className="text-xl sm:text-2xl font-black text-foreground/80 tracking-wider">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground/50 border border-border/40">
      <ImageIcon className="h-5 w-5" />
    </div>
  );
}
