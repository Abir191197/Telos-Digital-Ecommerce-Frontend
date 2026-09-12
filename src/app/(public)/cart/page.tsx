import { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Cart | TELOS Digital",
  description: "Review and manage items in your shopping bag before proceeding to secure checkout with official Bangladesh warranty.",
};

export default function CartPage() {
  return <CartView />;
}
