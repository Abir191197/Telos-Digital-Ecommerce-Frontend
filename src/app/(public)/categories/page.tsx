import type { Metadata } from "next";
import { CategoriesPageView } from "./CategoriesPageView";

export const metadata: Metadata = {
  title: "All Categories | Telos Cart - Digital Storefront",
  description:
    "Explore all product categories at Telos Cart: Smartphones, Laptops, Gaming, Wearables, Fashion, Audio, and more with genuine BD warranty.",
};

export default function CategoriesPage() {
  return <CategoriesPageView />;
}
