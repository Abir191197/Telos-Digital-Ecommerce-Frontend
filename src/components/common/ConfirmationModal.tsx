"use client";

import React from "react";
import { AlertOctagon, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmationVariant = "danger" | "warning" | "success" | "primary";

export interface ConfirmationDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  hideCancel?: boolean;
  variant: ConfirmationVariant;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface ConfirmationModalProps {
  dialog: ConfirmationDialogState;
  onClose: () => void;
}

/**
 * Universal Reusable Confirmation & Success Modal
 * Supports destructive actions (danger), warnings, successes (create/update), and primary actions.
 */
export function ConfirmationModal({ dialog, onClose }: ConfirmationModalProps) {
  if (!dialog.isOpen) return null;

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    } else {
      onClose();
    }
  };

  const renderIcon = () => {
    switch (dialog.variant) {
      case "danger":
        return <AlertOctagon className="h-6 w-6" />;
      case "success":
        return <CheckCircle2 className="h-6 w-6" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6" />;
      case "primary":
      default:
        return <Sparkles className="h-6 w-6" />;
    }
  };

  const getBadgeStyle = () => {
    switch (dialog.variant) {
      case "danger":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "success":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "warning":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "primary":
      default:
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
  };

  const getConfirmButtonStyle = () => {
    switch (dialog.variant) {
      case "danger":
        return "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20";
      case "warning":
        return "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20";
      case "primary":
      default:
        return "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-3.5">
          <div className={cn("p-3 rounded-2xl shrink-0 border", getBadgeStyle())}>
            {renderIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-foreground tracking-tight">
              {dialog.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {dialog.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          {!dialog.hideCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {dialog.cancelLabel || "Cancel"}
            </button>
          )}
          <button
            type="button"
            onClick={dialog.onConfirm}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer",
              getConfirmButtonStyle()
            )}
          >
            {dialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
