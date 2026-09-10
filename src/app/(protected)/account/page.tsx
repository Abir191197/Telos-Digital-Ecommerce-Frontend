import type { Metadata } from "next";
import { CustomerAccountHub } from "@/components/account";

export const metadata: Metadata = {
  title: "Customer Hub & Orders | Telos Cart BD",
  description:
    "Manage delivery addresses, review recent order history, and track shipments in Bangladesh.",
};

export default function AccountPage() {
  return <CustomerAccountHub />;
}
