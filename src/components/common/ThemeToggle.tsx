"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("h-9 w-9 rounded-full border border-border/60 bg-muted/30", className)} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground shadow-xs backdrop-blur-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-300",
          isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100 text-amber-500"
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          isDark ? "scale-100 rotate-0 opacity-100 text-blue-400" : "scale-0 -rotate-90 opacity-0"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
