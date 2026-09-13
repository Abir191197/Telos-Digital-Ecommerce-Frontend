"use client";

import React from "react";
import { AlertTriangle, Check, Trash2, X } from "lucide-react";
import type { Address } from "@/types/order.types";

interface AddressConfirmDialogsProps {
  addressToConfirmSave: {
    id?: string;
    data: Omit<Address, "id">;
  } | null;
  onCancelSave: () => void;
  onConfirmSave: () => void;
  addressToDelete: Address | null;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export function AddressConfirmDialogs({
  addressToConfirmSave,
  onCancelSave,
  onConfirmSave,
  addressToDelete,
  onCancelDelete,
  onConfirmDelete,
}: AddressConfirmDialogsProps) {
  return (
    <>
      {/* ── Save Warning / Confirmation Popup Modal ── */}
      {addressToConfirmSave && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 border border-border/70 max-h-[90vh] overflow-y-auto"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {addressToConfirmSave.id ? "Confirm Address Update" : "Confirm New Address"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Verify destination before saving
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancelSave}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Recipient:</span>
                <strong className="font-bold text-foreground">{addressToConfirmSave.data.name}</strong>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Contact Phone:</span>
                <strong className="font-mono font-bold text-foreground">{addressToConfirmSave.data.phone}</strong>
              </div>
              <div className="space-y-0.5">
                <span className="text-muted-foreground block">Shipping Destination:</span>
                <p className="text-foreground font-semibold">
                  {addressToConfirmSave.data.street}, {addressToConfirmSave.data.area},{" "}
                  {addressToConfirmSave.data.city} - {addressToConfirmSave.data.postalCode}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {addressToConfirmSave.id
                ? "Are you sure you want to update this address? Pending dispatches will use these modified details."
                : "Are you sure you want to save this new delivery address to your address book?"}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancelSave}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmSave}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4 stroke-[2.5]" />
                <span>Confirm & Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Warning / Confirmation Popup Modal ── */}
      {addressToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 border border-border/70 max-h-[90vh] overflow-y-auto"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Delete Address?
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancelDelete}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-rose-500/5 p-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{addressToDelete.name}</span>
                <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-500/15 px-2 py-0.5 rounded-md">
                  {addressToDelete.label}
                </span>
              </div>
              <p className="text-muted-foreground">
                {addressToDelete.street}, {addressToDelete.area}, {addressToDelete.city}
              </p>
              <p className="font-mono text-muted-foreground">
                {addressToDelete.phone}
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Are you sure you want to permanently remove this delivery address from your profile?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancelDelete}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Address</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
