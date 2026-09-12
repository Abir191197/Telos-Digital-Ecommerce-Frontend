import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Customer Sign In | Telos Cart BD",
  description: "Sign in to track orders, manage delivery addresses, and view purchase history.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-14rem)] w-full">
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" /></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
