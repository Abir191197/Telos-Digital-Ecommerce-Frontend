"use client";

import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useSidebarStore } from "@/stores/sidebar.store";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar navigation */}
      <AdminSidebar />

      {/* Unified Frame Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 relative",
          isOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <AdminHeader />

        {/* ── Inner Rounded Fillet Scoop at Sidebar + Nav Junction ── */}
        <div
          className="hidden lg:block pointer-events-none fixed top-16 z-30 h-5 w-5 transition-all duration-300"
          style={{ left: isOpen ? "16rem" : "5rem" }}
          aria-hidden="true"
        >
          {/* SVG Inverted Fillet blending nav horizontal and sidebar vertical with continuous liquid shadow */}
          <svg
            className="w-full h-full text-sidebar drop-shadow-[4px_4px_16px_rgba(0,0,0,0.06)] dark:drop-shadow-[4px_4px_20px_rgba(0,0,0,0.45)]"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M0 0 H20 A20 20 0 0 0 0 20 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
