"use client";

// ── Theme Provider ─────────────────────────────────────
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/dashboard");

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
      forcedTheme={isAdmin ? undefined : "light"}
      enableSystem={isAdmin}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

