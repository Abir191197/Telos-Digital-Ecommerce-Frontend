import React from "react";
import { AlertOctagon, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmationDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant: "danger" | "warning" | "primary";
  onConfirm: () => void;
}

interface ProductConfirmDialogProps {
  dialog: ConfirmationDialogState;
  onClose: () => void;
}

export function ProductConfirmDialog({ dialog, onClose }: ProductConfirmDialogProps) {
  if (!dialog.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              "p-3 rounded-2xl shrink-0",
              dialog.variant === "danger"
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
            )}
          >
            {dialog.variant === "danger" ? (
              <AlertOctagon className="h-6 w-6" />
            ) : (
              <AlertTriangle className="h-6 w-6" />
            )}
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
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={dialog.onConfirm}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer",
              dialog.variant === "danger"
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20"
                : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20"
            )}
          >
            {dialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
