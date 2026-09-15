import React from "react";
import {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Camera,
  Cpu,
  Tv,
  Home as HomeIcon,
  Shirt,
  Sparkles,
  Footprints,
  Sparkle,
  Gem,
  ShieldCheck,
  Wifi,
  Printer,
  Dumbbell,
  Car,
  BookOpen,
  Luggage,
  Baby,
  Glasses,
  UtensilsCrossed,
  Dog,
} from "lucide-react";
import { ROUTES } from "@/constants";

// Map category icons to Lucide icons
export const CATEGORY_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Camera,
  Cpu,
  Tv,
  Home: HomeIcon,
  Shirt,
  Sparkles,
  Footprints,
  Sparkle,
  Gem,
  ShieldCheck,
  Wifi,
  Printer,
  Dumbbell,
  Car,
  BookOpen,
  Luggage,
  Baby,
  Glasses,
  UtensilsCrossed,
  Dog,
};

export const QUICK_CATEGORIES = [
  {
    label: "Smartphones",
    slug: "smartphones-tablets",
    href: ROUTES.CATEGORY_DETAIL("smartphones-tablets"),
    icon: Smartphone,
    badge: "Hot",
  },
  {
    label: "Laptops",
    slug: "laptops-macbooks",
    href: ROUTES.CATEGORY_DETAIL("laptops-macbooks"),
    icon: Laptop,
    badge: "Popular",
  },
  {
    label: "Audio & Wearables",
    slug: "audio-headphones",
    href: ROUTES.CATEGORY_DETAIL("audio-headphones"),
    icon: Headphones,
  },
];
