import React from "react";
import { Filter } from "lucide-react";

interface ProductFloatingFilterFabProps {
  position: { x: number; y: number };
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  isFiltered: boolean;
}

export function ProductFloatingFilterFab({
  position,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  isFiltered,
}: ProductFloatingFilterFabProps) {
  return (
    <div
      style={{
        right: `${position.x}px`,
        bottom: `${position.y}px`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="md:hidden fixed z-40 touch-none select-none cursor-grab active:cursor-grabbing"
    >
      <button
        type="button"
        aria-label="Open Filters"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-2xl border-2 border-background/20 active:scale-90 transition-transform pointer-events-none"
      >
        <Filter className="h-5 w-5 text-amber-500 fill-amber-500/30" />
        {isFiltered && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-background animate-pulse" />
        )}
      </button>
    </div>
  );
}
