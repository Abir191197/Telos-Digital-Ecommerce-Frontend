"use client";

import React from "react";
import { Save, X, Check } from "lucide-react";
import { AppImage } from "@/components/shared";
import type { CustomerUser } from "@/stores";

interface ProfileConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
  user: CustomerUser;
  profileName: string;
  profileAvatar: string;
}

export function ProfileConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isSaving,
  user,
  profileName,
  profileAvatar,
}: ProfileConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Save className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Confirm Profile Update
              </h3>
              <p className="text-xs text-muted-foreground">
                Save contact changes to your account
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-2.5 text-xs">
          <div className="flex items-center gap-3 pb-2 border-b border-border/50">
            <div className="relative h-12 w-12 shrink-0 rounded-xl border border-amber-500/60 overflow-hidden bg-muted/40 flex items-center justify-center font-bold text-amber-600">
              <AppImage
                src={profileAvatar}
                alt={profileName}
                fill
                className="object-cover"
                fallbackIcon={<span className="font-bold text-amber-600 text-sm">{profileName.charAt(0)}</span>}
                containerClassName="p-0 bg-transparent"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Profile Avatar
              </span>
              <span className="text-xs font-semibold text-foreground">
                {profileAvatar !== user.avatar ? "New Photo Selected" : "Unchanged"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Updated Name:</span>
            <span className="font-bold text-foreground">{profileName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Updated Phone:</span>
            <span className="font-bold font-mono text-foreground">
              {user?.phone || "None"}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          These details will be used for future invoice generations, delivery SMS dispatches, and rider calling.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border/80 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>{isSaving ? "Saving..." : "Yes, Confirm & Save"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
