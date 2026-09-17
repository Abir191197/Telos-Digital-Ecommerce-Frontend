import { Smartphone, Laptop, Headphones } from "lucide-react";
import { ROUTES } from "@/constants";

// Re-export canonical category icon utilities from categoryConfig
export {
  CATEGORY_ICON_MAP,
  getCategoryIcon,
  normalizeCategoryIconName,
} from "@/components/categories/categoryConfig";

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
