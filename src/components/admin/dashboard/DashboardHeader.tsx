import React from "react";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/70">
      {/* Title & Status */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Store overview & performance metrics
        </p>
      </div>
    </div>
  );
}

