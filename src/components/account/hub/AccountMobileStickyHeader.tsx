import React from "react";
import { ChevronRight } from "lucide-react";

interface AccountMobileStickyHeaderProps {
  title: string;
  onBack: () => void;
}

export function AccountMobileStickyHeader({
  title,
  onBack,
}: AccountMobileStickyHeaderProps) {
  return (
    <>
      <div className="fixed top-9 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/80 shadow-xs">
        <div className="container flex h-11 items-center justify-between px-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 cursor-pointer active:scale-95 transition-transform"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span>Back to Account Menu</span>
          </button>
          <span className="text-xs font-bold text-foreground">
            {title}
          </span>
        </div>
      </div>
      <div className="h-10 w-full" aria-hidden="true" />
    </>
  );
}
