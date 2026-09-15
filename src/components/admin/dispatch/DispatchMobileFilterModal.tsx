import React from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DispatchMobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  courierFilter: string;
  setCourierFilter: (courier: string) => void;
  zoneFilter: string;
  setZoneFilter: (zone: string) => void;
  onResetPage: () => void;
}

export function DispatchMobileFilterModal({
  isOpen,
  onClose,
  courierFilter,
  setCourierFilter,
  zoneFilter,
  setZoneFilter,
  onResetPage,
}: DispatchMobileFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-background animate-in fade-in duration-200 md:hidden">
      <div className="flex-1 flex flex-col p-5 overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground tracking-tight">Dispatch Queue Filters</h3>
              <p className="text-[11px] text-muted-foreground">Filter by assigned courier &amp; zone</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Courier Filter Options */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-foreground block mb-1">Courier Logistics Partner</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "all", label: "All Couriers" },
              { id: "unassigned", label: "Unassigned Rider" },
              { id: "steadfast", label: "Steadfast Courier" },
              { id: "pathao", label: "Pathao Express" },
            ].map((c) => {
              const isSelected = courierFilter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCourierFilter(c.id);
                    onResetPage();
                  }}
                  className={cn(
                    "p-3 rounded-2xl border text-left transition-all cursor-pointer font-bold text-xs",
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 text-foreground ring-1 ring-amber-500"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone Filter Options */}
        <div className="space-y-2 text-xs">
          <span className="font-bold text-foreground block mb-1">Delivery Geographic Zone</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "all", label: "All Zones" },
              { id: "inside-dhaka", label: "Inside Dhaka" },
              { id: "outside-dhaka", label: "Outside Dhaka" },
            ].map((z) => {
              const isSelected = zoneFilter === z.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => {
                    setZoneFilter(z.id);
                    onResetPage();
                  }}
                  className={cn(
                    "p-3 rounded-2xl border text-left transition-all cursor-pointer font-bold text-xs",
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 text-foreground ring-1 ring-amber-500"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                  )}
                >
                  {z.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Reset & Dismiss */}
        <div className="pt-2 flex items-center gap-2.5 border-t border-border/40">
          <button
            type="button"
            onClick={() => {
              setCourierFilter("all");
              setZoneFilter("all");
              onResetPage();
              onClose();
            }}
            className="py-3 px-4 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-all cursor-pointer shadow-md active:scale-98"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
