"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mapBackendUserToCustomerUser, useAuthStore } from "@/stores";
import { ROUTES } from "@/constants";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/services/api/auth/authApi";
import Image from "next/image";
import { Logo } from "@/components/common";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const setAuthCookies = (accessToken: string, role: string) => {
  document.cookie = `accessToken=${encodeURIComponent(
    accessToken,
  )}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `authRole=${encodeURIComponent(
    role,
  )}; path=/; max-age=86400; SameSite=Lax`;
};

const getErrorMessage = (error: unknown) => {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return "Registration failed. Please try again.";
  }

  const data = (error as { data?: unknown }).data;
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }

  return "Registration failed. Please try again.";
};

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [registerCustomer, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const isLoading = isRegisterLoading || isLoginLoading;

  const persistSession = (
    accessToken: string,
    user: Parameters<typeof mapBackendUserToCustomerUser>[0],
  ) => {
    setAuth(mapBackendUserToCustomerUser(user), accessToken);
    setAuthCookies(accessToken, user.role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) return;

    try {
      setErrorMessage("");
      const response = await registerCustomer({
        name,
        email,
        phone: phone.trim(),
        password,
      }).unwrap();
      persistSession(response.data.accessToken, response.data.user);
      router.push(ROUTES.ACCOUNT);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-8rem)]">
        {/* Left Hero Panel - Luxury Deep Emerald & Sage Rich Gradient */}
        <div className="hidden lg:flex relative lg:col-span-5 p-10 xl:p-14 flex-col justify-between overflow-hidden border-r border-emerald-900/10 dark:border-emerald-950/30 bg-gradient-to-br from-emerald-100/85 via-teal-50/60 to-zinc-100 dark:from-emerald-950/60 dark:via-zinc-950 dark:to-teal-950/40 text-foreground">
          {/* Intense Ambient Emerald Glow Orbs & Smartwatch Overlay */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <Image
              src="/images/hero/smartwatch.png"
              alt="Telos Member Perks"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-center opacity-[0.09] dark:opacity-[0.14] mix-blend-multiply dark:mix-blend-luminosity scale-105"
            />
            {/* Emerald/Teal multi-stop glow */}
            <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-400/30 via-teal-500/20 to-transparent blur-[90px]" />
            <div className="absolute bottom-0 right-0 w-88 h-88 rounded-full bg-gradient-to-tl from-teal-400/20 via-emerald-300/15 to-transparent dark:from-emerald-600/20 blur-[100px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
          </div>

          {/* Top Logo */}
          <div className="relative z-10">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-85"
            >
              <Logo size={36} />
            </Link>
          </div>

          {/* Center Editorial Focus */}
          <div className="relative z-10 max-w-sm space-y-6 my-auto py-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-600/25 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-950 dark:text-emerald-300">
                  Verified Member Access
                </span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-[1.15]">
                Unlock Bangladesh&apos;s Smartest Tech Store.
              </h2>
              <p className="text-xs xl:text-sm text-muted-foreground font-normal leading-relaxed">
                Create your Telos ID to save multiple delivery addresses, track live courier dispatches, and get VIP pre-order access.
              </p>
            </div>

            {/* Spec Row */}
            <div className="pt-2 border-t border-emerald-950/10 dark:border-emerald-500/15 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground block">
                  Coverage
                </span>
                <span className="text-xs font-semibold text-foreground mt-0.5 block">
                  Official Warranty BD
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground block">
                  Speed Checkout
                </span>
                <span className="text-xs font-semibold text-foreground mt-0.5 block">
                  1-Click Saved Hubs
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Metatag */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-emerald-950/10 dark:border-emerald-500/15 pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-foreground">TLS 1.3 End-to-End Secure</span>
            </div>
            <span>BD / REG-2026</span>
          </div>
        </div>

        {/* Form Panel - Cool Slate & Opal Rich Gradient */}
        <div className="relative lg:col-span-7 px-6 py-10 sm:px-12 sm:py-16 lg:px-16 xl:px-20 flex flex-col justify-center overflow-hidden bg-gradient-to-bl from-slate-50 via-zinc-50 to-stone-100/90 dark:from-zinc-950 dark:via-zinc-900 dark:to-stone-950">
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/[0.04] dark:bg-amber-500/[0.03] blur-[100px]" />

          <div className="relative z-10 w-full max-w-lg mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground font-mono">
                New Membership
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Get started in under 30 seconds.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Hossain"
                  className="h-10 w-full rounded-lg border border-border bg-card px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-normal"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tanvir@example.com"
                    className="h-10 w-full rounded-lg border border-border bg-card px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-normal"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="h-10 w-full rounded-lg border border-border bg-card px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-normal"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="h-10 w-full rounded-lg border border-border bg-card pl-3.5 pr-10 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-border accent-amber-500 h-4 w-4 cursor-pointer"
                />
                <span className="text-xs text-muted-foreground leading-snug">
                  I agree to the{" "}
                  <Link
                    href={ROUTES.TERMS}
                    className="text-foreground font-medium hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href={ROUTES.PRIVACY_POLICY}
                    className="text-foreground font-medium hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-foreground text-background hover:bg-amber-500 hover:text-zinc-950 hover:shadow-md hover:shadow-amber-500/20 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  className="font-semibold text-foreground hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}