"use client";

import React from "react";
import { AppImage } from "@/components/shared";
import { Sparkles, Edit3 } from "lucide-react";
import type { CustomerUser } from "@/stores";

interface OverviewProfileCardProps {
  user: CustomerUser;
  onEditProfile: () => void;
}

export function OverviewProfileCard({ user, onEditProfile }: OverviewProfileCardProps) {
  return (
    <div className="order-1 rounded-3xl border border-border/40 dark:border-white/10 bg-gradient-to-br from-card via-card/95 to-amber-500/[0.04] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.2),0_8px_20px_-4px_rgba(245,158,11,0.12)] transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-500/80 shadow-md shadow-amber-500/20 bg-muted/40">
          <AppImage
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
            fallbackIcon={
              <span className="font-bold text-lg text-amber-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            }
          />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight truncate">
              {user.name}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
              <Sparkles className="h-2.5 w-2.5 text-amber-500" />
              <span>Telos Gold Member</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {user.email} • {user.phone}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onEditProfile}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 dark:border-white/10 bg-card/80 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-transparent text-foreground px-4 py-2.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5 text-amber-500" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}
