// ── Theme Store (Zustand) ──────────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types/common.types";

interface ThemeState {
  theme: Theme;
}

interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
      },
    }),
    {
      name: "telos-theme",
    }
  )
);
