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
  ShoppingBag,
  Tag,
  Package,
  Layers,
  Heart,
  Gift,
  Coffee,
  Music,
  LayoutGrid,
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
  ShoppingBag,
  Tag,
  Package,
  Layers,
  Heart,
  Gift,
  Coffee,
  Music,
  LayoutGrid,
};

// Canonical alias mapping for robust resolution from backend payloads or slugs
const ICON_ALIASES: Record<string, string> = {
  // Mobile / Tech
  smartphone: "Smartphone",
  smartphones: "Smartphone",
  phone: "Smartphone",
  mobile: "Smartphone",
  cellphone: "Smartphone",
  "smartphones-tablets": "Smartphone",
  tablet: "Smartphone",
  tablets: "Smartphone",

  // Computing
  laptop: "Laptop",
  laptops: "Laptop",
  macbook: "Laptop",
  computer: "Laptop",
  pc: "Laptop",
  "laptops-macbooks": "Laptop",
  "pc-components": "Cpu",
  cpu: "Cpu",
  hardware: "Cpu",
  processor: "Cpu",

  // Audio / Gaming
  headphones: "Headphones",
  headphone: "Headphones",
  audio: "Headphones",
  "audio-headphones": "Headphones",
  earphones: "Headphones",
  earbuds: "Headphones",
  music: "Music",
  gamepad: "Gamepad2",
  gamepad2: "Gamepad2",
  gaming: "Gamepad2",
  "gaming-consoles": "Gamepad2",
  console: "Gamepad2",

  // Wearables / Watches
  watch: "Watch",
  watches: "Watch",
  smartwatch: "Watch",
  wearable: "Watch",
  wearables: "Watch",
  "wearables-smartwatches": "Watch",

  // Visual / Display / Camera
  camera: "Camera",
  cameras: "Camera",
  "cameras-optics": "Camera",
  optics: "Camera",
  tv: "Tv",
  television: "Tv",
  display: "Tv",
  monitor: "Tv",

  // Smart Home / Office
  home: "Home",
  smarthome: "Home",
  "smart-home": "Home",
  "smart-home-iot": "Home",
  appliances: "Home",
  "home-appliances": "Home",
  wifi: "Wifi",
  networking: "Wifi",
  "networking-wifi": "Wifi",
  internet: "Wifi",
  router: "Wifi",
  printer: "Printer",
  printers: "Printer",
  scanner: "Printer",
  "printers-scanners": "Printer",

  // Fashion / Apparel / Footwear / Eyewear
  shirt: "Shirt",
  apparel: "Shirt",
  clothing: "Shirt",
  clothes: "Shirt",
  fashion: "Shirt",
  "mens-fashion": "Shirt",
  "womens-fashion": "Shirt",
  tshirt: "Shirt",
  "t-shirt": "Shirt",
  footprints: "Footprints",
  footwear: "Footprints",
  shoes: "Footprints",
  sneakers: "Footprints",
  glasses: "Glasses",
  eyewear: "Glasses",
  sunglasses: "Glasses",
  "eyewear-sunglasses": "Glasses",

  // Luxury / Jewelry / Accessories
  gem: "Gem",
  luxury: "Gem",
  jewellery: "Gem",
  jewelry: "Gem",
  diamond: "Gem",
  "watches-jewellery": "Gem",
  sparkles: "Sparkles",
  sparkle: "Sparkles",
  accessories: "Sparkles",

  // Security / Fitness / Automotive
  shieldcheck: "ShieldCheck",
  shield: "ShieldCheck",
  security: "ShieldCheck",
  protection: "ShieldCheck",
  dumbbell: "Dumbbell",
  fitness: "Dumbbell",
  gym: "Dumbbell",
  sports: "Dumbbell",
  "sports-fitness": "Dumbbell",
  workout: "Dumbbell",
  car: "Car",
  automotive: "Car",
  auto: "Car",
  vehicle: "Car",

  // Lifestyle / Dining / Pets / Books / Travel
  bookopen: "BookOpen",
  book: "BookOpen",
  books: "BookOpen",
  reading: "BookOpen",
  luggage: "Luggage",
  travel: "Luggage",
  bag: "Luggage",
  suitcase: "Luggage",
  baby: "Baby",
  kids: "Baby",
  children: "Baby",
  utensilscrossed: "UtensilsCrossed",
  utensils: "UtensilsCrossed",
  dining: "UtensilsCrossed",
  kitchen: "UtensilsCrossed",
  food: "UtensilsCrossed",
  "kitchen-dining": "UtensilsCrossed",
  dog: "Dog",
  pets: "Dog",
  animals: "Dog",

  // Retail / Generic
  shoppingbag: "ShoppingBag",
  shopping: "ShoppingBag",
  retail: "ShoppingBag",
  store: "ShoppingBag",
  tag: "Tag",
  sale: "Tag",
  deal: "Tag",
  deals: "Tag",
  offers: "Tag",
  package: "Package",
  heart: "Heart",
  gift: "Gift",
  coffee: "Coffee",
  layers: "Layers",
  layoutgrid: "LayoutGrid",
  grid: "LayoutGrid",
  default: "LayoutGrid",
};

/**
 * Normalizes any category icon string received from backend, URL, or form
 * to a verified canonical icon key present in CATEGORY_ICON_MAP.
 *
 * Handles:
 * - Direct case matches ("Smartphone", "Laptop")
 * - Case-insensitivity ("smartphone", "SMARTPHONE")
 * - Kebab-case & snake_case ("smart-phones", "gamepad_2", "shield-check")
 * - Category slug / semantic aliases ("gaming-consoles" -> "Gamepad2")
 * - Safe fallback to "LayoutGrid" if unrecognized or empty
 */
export function normalizeCategoryIconName(rawIcon?: string | null): string {
  if (!rawIcon || typeof rawIcon !== "string") {
    return "LayoutGrid";
  }

  const trimmed = rawIcon.trim();
  if (!trimmed) {
    return "LayoutGrid";
  }

  // 1. Direct exact match in map
  if (CATEGORY_ICON_MAP[trimmed]) {
    return trimmed;
  }

  // 2. Cleaned key (lowercase, stripped hyphens and underscores)
  const cleaned = trimmed.toLowerCase().replace(/[-_\s]+/g, "");

  // 3. Direct cleaned alias lookup
  if (ICON_ALIASES[cleaned]) {
    return ICON_ALIASES[cleaned];
  }

  // 4. Case-insensitive search across CATEGORY_ICON_MAP keys
  const matchedKey = Object.keys(CATEGORY_ICON_MAP).find(
    (key) => key.toLowerCase() === cleaned
  );
  if (matchedKey) {
    return matchedKey;
  }

  // 5. Fallback
  return "LayoutGrid";
}

/**
 * Safely resolves a category icon to a valid Lucide React component.
 * Guaranteed never to return undefined.
 */
export function getCategoryIcon(
  rawIcon?: string | null
): React.ComponentType<{ className?: string }> {
  const canonicalName = normalizeCategoryIconName(rawIcon);
  return CATEGORY_ICON_MAP[canonicalName] || LayoutGrid;
}

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
