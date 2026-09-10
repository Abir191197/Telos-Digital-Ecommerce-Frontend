import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout";

export const metadata: Metadata = {
  title: "Frictionless Secure Checkout | Telos Cart BD",
  description:
    "Fast 1-page checkout for genuine electronics in Bangladesh. Cash on Delivery, bKash, Nagad, and Credit Card payments accepted.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
