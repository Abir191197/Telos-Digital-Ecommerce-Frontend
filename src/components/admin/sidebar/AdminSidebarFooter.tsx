import React from "react";
import { LogOut } from "lucide-react";

interface AdminSidebarFooterProps {
  isOpen: boolean;
  isMobileOpen: boolean;
  onLogout: () => void;
}

export function AdminSidebarFooter({
  isOpen,
  isMobileOpen,
  onLogout,
}: AdminSidebarFooterProps) {
  return (
    <div className="border-t border-border/40 p-3.5 space-y-1">
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
      >
        <LogOut className="h-5 w-5 shrink-0" />
        {(isOpen || isMobileOpen) && <span className="truncate">Log Out</span>}
      </button>
    </div>
  );
}
