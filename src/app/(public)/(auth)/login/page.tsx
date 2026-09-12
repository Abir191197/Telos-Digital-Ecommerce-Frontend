import type { Metadata } from "next";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Customer Sign In | Telos Cart BD",
  description: "Sign in to track orders, manage delivery addresses, and view purchase history.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-14rem)] w-full">
      <LoginForm />
    </div>
  );
}
