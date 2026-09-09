import type { Metadata } from "next";
import { CustomerAccountHub } from "@/components/account";

export const metadata: Metadata = {
  title: "My Account & Orders | Telos Cart",
  description: "View order history, track live shipments, and manage delivery addresses.",
};

export default function ProfilePage() {
  return <CustomerAccountHub />;
}

