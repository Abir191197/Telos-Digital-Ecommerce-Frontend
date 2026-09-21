"use client";

import React, { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt: string;
  fallbackIconSize?: number;
  fallbackIcon?: React.ReactNode;
  containerClassName?: string;
}

/**
 * Universal safe image component.
 * If src missing, empty, or fails loading (broken/error),
 * renders clean default photo icon placeholder instead of broken UI.
 */
export function AppImage({
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
  fallbackIcon,
  ...rest
}: AppImageProps) {
  const [hasError, setHasError] = useState(false);

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
        aria-label={`Image unavailable for ${alt}`}
      >
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground/50 border border-border/40">
          {fallbackIcon || <ImageIcon style={{ width: fallbackIconSize, height: fallbackIconSize }} />}
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
      {...rest}
    />
  );
}
