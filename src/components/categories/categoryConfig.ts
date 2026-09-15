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
import type { Variants } from "framer-motion";

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

export const CATEGORY_GROUPS = [
  { id: "all", label: "All Categories" },
  {
    id: "tech",
    label: "Tech & Devices",
    match: [
      "smartphones-tablets",
      "laptops-macbooks",
      "pc-components",
      "cameras-optics",
    ],
  },
  {
    id: "audio-gaming",
    label: "Audio & Gaming",
    match: [
      "audio-headphones",
      "gaming-consoles",
      "wearables-smartwatches",
      "smart-home-iot",
    ],
  },
  {
    id: "home-office",
    label: "Office & Home",
    match: [
      "networking-wifi",
      "printers-scanners",
      "home-appliances",
      "kitchen-dining",
    ],
  },
  {
    id: "lifestyle",
    label: "Fashion & Lifestyle",
    match: [
      "mens-fashion",
      "womens-fashion",
      "sports-fitness",
      "watches-jewellery",
      "beauty-personal-care",
      "footwear",
      "eyewear-sunglasses",
    ],
  },
] as const;

export const INITIAL_BATCH_SIZE = 10;
export const BATCH_INCREMENT = 10;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};
