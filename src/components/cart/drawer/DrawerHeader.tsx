import React from "react";
import { ShoppingBag, Trash2, X } from "lucide-react";

interface DrawerHeaderProps {
  itemCount: number;
  hasItems: boolean;
  showClearConfirm: boolean;
  onShowClearConfirm: (show: boolean) => void;
  onClearCart: () => void;
  onCloseCart: () => void;
}

export function DrawerHeader({
  itemCount,
  hasItems,
  showClearConfirm,
  onShowClearConfirm,
  onClearCart,
  onCloseCart,
}: DrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 bg-muted/20">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/20 shadow-inner">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black tracking-tight text-foreground">
              Shopping Bag
            </h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {itemCount}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {itemCount === 0
              ? "No items selected"
              : `Ready for express Bangladesh delivery`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {hasItems && (
          <>
            {showClearConfirm ? (
              <div className="flex items-center gap-1 bg-destructive/10 rounded-lg p-1 border border-destructive/20 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => {
                    onClearCart();
                    onShowClearConfirm(false);
                  }}
                  className="px-2 py-1 text-[11px] font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground rounded transition-colors cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => onShowClearConfirm(false)}
                  className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onShowClearConfirm(true)}
                title="Clear entire cart"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </>
        )}

        <button
          type="button"
          onClick={onCloseCart}
          aria-label="Close cart"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
