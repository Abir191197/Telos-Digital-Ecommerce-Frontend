import type { Metadata } from "next";
import { BrandsPageView } from "./BrandsPageView";

export const metadata: Metadata = {
  title: "All Brands | Telos Cart - Official Brand Stores",
  description:
    "Shop from authorized brand stores at Telos Cart: Apple, Samsung, Google, Sony, OnePlus, Xiaomi, Asus, Anker and more with genuine BD warranty.",
};

export default function BrandsPage() {
  return <BrandsPageView />;
}
