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

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          isOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
