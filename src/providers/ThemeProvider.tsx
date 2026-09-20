"use client";

// ── Theme Provider ─────────────────────────────────────
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const pathname = usePathname();
  // mounted flag: ensures theme-dependent logic only runs client-side,
  // so the server render and client hydration produce identical initial HTML.
  const [mounted, setMounted] = useState(false);

  const isAdmin =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/notifications");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, [isAdmin, pathname]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      // Only apply forcedTheme after mounting — before mount, server and client
      // must render identically to avoid React #418 hydration mismatch.
      forcedTheme={mounted && !isAdmin ? "light" : undefined}
      enableSystem={mounted && isAdmin}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
