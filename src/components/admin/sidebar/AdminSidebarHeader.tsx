import React from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants";

interface AdminSidebarHeaderProps {
  isOpen: boolean;
  onToggleSidebar: () => void;
  onCloseMobile: () => void;
}

export function AdminSidebarHeader({
  isOpen,
  onToggleSidebar,
  onCloseMobile,
}: AdminSidebarHeaderProps) {
  return (
    <>
      {/* On Mobile: Rich Admin Profile Card */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-muted/40 border-b border-border/70">
        <div className="flex items-center gap-3 min-w-0">
          {/* Admin Avatar Squircle */}
          <div className="relative shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 font-black text-white text-xs shadow-xs">
            AD
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-sidebar" />
          </div>
          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-xs text-foreground truncate">
                Store Administrator
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              admin@telos.com.bd
            </p>
          </div>
        </div>

        {/* Close Drawer Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors shrink-0"
          aria-label="Close sidebar"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* On Desktop: Standard Brand Header with Collapse Toggle */}
      <div className="hidden lg:flex h-16 items-center justify-between px-3.5 rounded-br-2xl bg-gradient-to-br from-sidebar via-sidebar to-muted/60 border-b border-r border-border/70 shadow-sm">
        <Link
          href={ROUTES.DASHBOARD}
          className="flex items-center gap-2.5 overflow-hidden group min-w-0"
        >
          {/* Telos Cart Real Squircle Icon */}
          <div className="relative shrink-0 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-[#141312] p-[1.5px] shadow-sm transition-transform duration-200 group-hover:scale-105 h-9 w-9">
            <div className="flex h-full w-full items-center justify-center rounded-[10.5px] bg-[#141312] p-1">
              <svg
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <defs>
                  <linearGradient
                    id="sidebarCartGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fde68a" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <path
                  d="M104 140 H164 L204 316 C208 332 222 344 238 344 H366 C382 344 396 332 400 316 L424 204 C426 194 418 184 408 184 H174"
                  stroke="url(#sidebarCartGrad)"
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M214 244 H396"
                  stroke="url(#sidebarCartGrad)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeOpacity="0.75"
                />
                <path
                  d="M260 196 L244 332"
                  stroke="url(#sidebarCartGrad)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeOpacity="0.6"
                />
                <path
                  d="M328 196 L320 332"
                  stroke="url(#sidebarCartGrad)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeOpacity="0.6"
                />
                <circle cx="240" cy="404" r="28" fill="url(#sidebarCartGrad)" />
                <circle cx="364" cy="404" r="28" fill="url(#sidebarCartGrad)" />
                <circle cx="240" cy="404" r="12" fill="#141312" />
                <circle cx="364" cy="404" r="12" fill="#141312" />
                <path
                  d="M366 100 L372 118 L390 124 L372 130 L366 148 L360 130 L342 124 L360 118 Z"
                  fill="url(#sidebarCartGrad)"
                />
              </svg>
            </div>
          </div>

          {isOpen && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-[14px] tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
                  Telos Admin
                </span>
              </div>
              <p className="text-[11.5px] font-semibold text-zinc-600 dark:text-zinc-400 truncate flex items-center gap-1.5 mt-1 tracking-tight">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                Store Active
              </p>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Icon Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted dark:bg-zinc-800 text-foreground shadow-xs border border-border/80 hover:bg-foreground hover:text-background transition-all duration-200 cursor-pointer"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4 stroke-[2.4]" />
          ) : (
            <ChevronRight className="h-4 w-4 stroke-[2.4]" />
          )}
        </button>
      </div>
    </>
  );
}
