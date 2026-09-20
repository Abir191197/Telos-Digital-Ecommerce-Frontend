"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageDisplayProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  fallbackIconSize?: number;
}

export function ProductImageDisplay({
  src,
  alt,
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 350px",
  priority = false,
  className = "object-cover",
  containerClassName,
  fallbackIconSize = 24,
}: ProductImageDisplayProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const isValidSrc = Boolean(src && typeof src === "string" && src.trim().length > 0);

  if (!isValidSrc || hasError) {
    return (
      <div
        className={cn(
          "w-full h-full flex flex-col items-center justify-center bg-muted/40 text-muted-foreground select-none p-2",
          containerClassName
        )}
        title={`Image unavailable for ${alt}`}
      >
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground/50 border border-border/40">
          <ImageIcon style={{ width: fallbackIconSize, height: fallbackIconSize }} />
        </div>
      </div>
    );
  }

  const isRemote = src!.startsWith("http://") || src!.startsWith("https://");

  return (
    <Image
      src={src!}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={fill ? sizes : undefined}
      priority={priority}
      unoptimized={isRemote}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
