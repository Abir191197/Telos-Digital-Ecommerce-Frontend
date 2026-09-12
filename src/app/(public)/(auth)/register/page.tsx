import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Create an Account | Telos Cart - Digital Storefront",
  description: "Join Telos Cart to track live shipments, save delivery addresses, and manage your orders.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-14rem)] w-full">
      <RegisterForm />
    </div>
  );
}
