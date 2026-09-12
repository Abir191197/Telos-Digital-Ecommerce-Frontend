import type { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact & Customer Support | Telos Cart Bangladesh",
  description:
    "Get in touch with Telos Cart BD. Hotline, email support, corporate office address, and customer help desk.",
};

export default function ContactPage() {
  return <ContactView />;
}
