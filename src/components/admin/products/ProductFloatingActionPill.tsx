import React from "react";
import { CheckSquare, Trash2 } from "lucide-react";

interface ProductFloatingActionPillProps {
  selectedCount: number;
  onCancel: () => void;
  onDelete: () => void;
}

export function ProductFloatingActionPill({
  selectedCount,
  onCancel,
  onDelete,
}: ProductFloatingActionPillProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center justify-between pl-3 pr-2 py-2 rounded-full bg-zinc-950/85 dark:bg-zinc-900/90 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-white/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-full bg-amber-500/20 backdrop-blur-md flex items-center justify-center text-amber-400 shrink-0">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div className="truncate">
            <p className="text-xs font-black text-white leading-tight">
              {selectedCount} Selected
            </p>
            <p className="text-[10px] text-zinc-400 font-medium">Bulk Action</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-full text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-95 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-600/30 border-none"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
