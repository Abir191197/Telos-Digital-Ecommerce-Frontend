"use client";

import React from "react";
import { ShieldAlert, CheckCircle2, PauseCircle, MapPin, Building2, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerStatus } from "@/services/api/customers/customerApi";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
  size?: "sm" | "md";
}

export function CustomerStatusBadge({ status, size = "md" }: CustomerStatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-bold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
            size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      );
    case "INACTIVE":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-bold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
            size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
          )}
        >
          <PauseCircle className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
          Inactive
        </span>
      );
    case "SUSPENDED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-bold rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30",
            size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
          )}
        >
          <ShieldAlert className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
          Suspended
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center font-bold px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
          {status}
        </span>
      );
  }
}

interface AddressTypeBadgeProps {
  type: string;
}

export function AddressTypeBadge({ type }: AddressTypeBadgeProps) {
  const normalized = type?.toUpperCase();
  const Icon = normalized === "HOME" ? Home : normalized === "OFFICE" ? Building2 : MapPin;

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
      <Icon className="h-2.5 w-2.5" />
      {normalized}
    </span>
  );
}

interface CustomerAvatarProps {
  name: string;
  avatar?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CustomerAvatar({ name, avatar, className, size = "md" }: CustomerAvatarProps) {
  const initials = (name || "Customer")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={cn("rounded-2xl object-cover border border-border/80", sizeClasses[size], className)}
      />
    );
  }

  // Consistent pleasant gradient background based on initials
  return (
    <div
      className={cn(
        "rounded-2xl font-black flex items-center justify-center border shadow-xs select-none transition-transform hover:scale-105",
        "bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-amber-600/25 text-amber-700 dark:text-amber-300 border-amber-500/30",
        sizeClasses[size],
        className
      )}
    >
      {initials || "TC"}
    </div>
  );
}
