import type { Metadata } from "next";
import PrivacyPolicyView from "@/components/legal/PrivacyPolicyView";

export const metadata: Metadata = {
  title: "Privacy Policy | Telos Cart Bangladesh",
  description: "Learn how Telos Cart collects, secures, and handles customer data across our e-commerce platform.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}
