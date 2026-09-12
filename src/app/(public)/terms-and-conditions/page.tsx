import type { Metadata } from "next";
import TermsAndConditionsView from "@/components/legal/TermsAndConditionsView";

export const metadata: Metadata = {
  title: "Terms & Conditions | Telos Cart Bangladesh",
  description: "Terms and conditions governing purchases, deliveries, returns, and warranties on Telos Cart across Bangladesh.",
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsView />;
}
