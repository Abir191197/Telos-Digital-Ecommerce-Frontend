"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className: _className }: ThemeToggleProps) {
  // Theme toggle isolated / disabled while working exclusively on light theme.
  return null;
}
