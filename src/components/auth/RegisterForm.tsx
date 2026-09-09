"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/constants";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const registerCustomer = useAuthStore((state) => state.registerCustomer);
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+880 1");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setIsLoading(true);
    setTimeout(() => {
      registerCustomer(name, email, phone);
      // Set cookie for edge middleware
      document.cookie = "accessToken=mock-demo-jwt-token; path=/; max-age=86400; SameSite=Lax";
      setIsLoading(false);
      router.push(ROUTES.PROFILE);
    }, 600);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemo();
      document.cookie = "accessToken=mock-demo-jwt-token; path=/; max-age=86400; SameSite=Lax";
      setIsLoading(false);
      router.push(ROUTES.PROFILE);
    }, 400);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl text-card-foreground">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 shadow-sm mx-auto mb-1">
            <User className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Join Telos Cart to track orders, save delivery addresses & get member discounts
          </p>
        </div>

        {/* 1-Tap Demo Alternative */}
        <div className="mb-6 p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Skip Form With Demo
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              Dhaka, Bangladesh
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Want to test immediately? Auto-load pre-configured demo account with live order history.
          </p>
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-2.5 text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <span>Sign In as Demo Customer</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/70" />
          </div>
          <span className="relative bg-card px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Or Register New Profile
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Full Name
            </label>
            <div className="relative mt-1.5">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Hossain"
                className="h-11 w-full rounded-xl border border-border/80 bg-background pl-10 pr-3.5 text-xs sm:text-sm font-semibold text-foreground placeholder:font-normal focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Mobile Number (Bangladesh)
            </label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1712-000000"
                className="h-11 w-full rounded-xl border border-border/80 bg-background pl-10 pr-3.5 text-xs sm:text-sm font-semibold text-foreground placeholder:font-normal focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tanvir@example.com"
                className="h-11 w-full rounded-xl border border-border/80 bg-background pl-10 pr-3.5 text-xs sm:text-sm font-semibold text-foreground placeholder:font-normal focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="h-11 w-full rounded-xl border border-border/80 bg-background pl-10 pr-3.5 text-xs sm:text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
              className="mt-0.5 rounded border-border accent-amber-500"
            />
            <span className="text-[11px] text-muted-foreground leading-snug">
              I agree to the{" "}
              <Link href={ROUTES.TERMS} className="text-amber-600 underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href={ROUTES.PRIVACY_POLICY} className="text-amber-600 underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading || !agreeTerms}
            className="mt-2 w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground text-background hover:opacity-90 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? "Creating Profile..." : "Create Free Account"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-border/60 text-center text-xs text-muted-foreground space-y-2">
          <p>
            Already have an account?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="font-bold text-amber-600 hover:underline"
            >
              Sign In
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 pt-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified Bangladesh Merchant Store</span>
          </div>
        </div>
      </div>
    </div>
  );
}
