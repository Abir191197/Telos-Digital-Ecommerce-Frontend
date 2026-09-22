"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { mapBackendUserToCustomerUser, useAuthStore } from "@/stores";
import { ROUTES } from "@/constants";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/services/api/auth/authApi";
import Image from "next/image";
import { Logo } from "@/components/common";
import { GoogleAuthButton } from "./GoogleAuthButton";
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
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const action = searchParams.get("action");
  const productId = searchParams.get("productId");
  const quantityParam = searchParams.get("quantity");
  const variantIdParam = searchParams.get("variantId");

  const loginHref = React.useMemo(() => {
    const params = new URLSearchParams();
    if (callbackUrl) params.set("callbackUrl", callbackUrl);
    if (action) params.set("action", action);
    if (productId) params.set("productId", productId);
    if (quantityParam) params.set("quantity", quantityParam);
    if (variantIdParam) params.set("variantId", variantIdParam);
    const qs = params.toString();
    return qs ? `${ROUTES.LOGIN}?${qs}` : ROUTES.LOGIN;
  }, [callbackUrl, action, productId, quantityParam, variantIdParam]);

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

  const getRedirectUrl = (fallback: string) => {
    return callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : fallback;
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
      router.push(getRedirectUrl(ROUTES.HOME));
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-background lg:bg-gradient-to-r lg:from-emerald-500/10 lg:via-emerald-500/[0.03] lg:to-background dark:lg:from-emerald-950/25 dark:lg:via-zinc-950 dark:lg:to-background">
      {/* Directional Hero Ambient Lighting: intense at left, fading softly to the right */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden hidden lg:block" aria-hidden="true">
        {/* Intense primary radial burst at top-left */}
        <div className="absolute -top-40 -left-40 w-[680px] h-[680px] rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-[130px] dark:from-emerald-500/15 dark:via-teal-600/8" />
        {/* Secondary mid-left glow bridging across */}
        <div className="absolute top-1/3 -left-20 w-[520px] h-[520px] rounded-full bg-gradient-to-r from-teal-400/15 via-emerald-400/5 to-transparent blur-[120px] dark:from-emerald-600/10" />
        {/* Soft bottom-left grounding pool */}
        <div className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16 min-h-[calc(100vh-8rem)] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Hero Storytelling Content (Hidden on mobile/tablet to show form only) */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-6 space-y-8 text-foreground">
            {/* Logo */}
            <div>
              <Link
                href={ROUTES.HOME}
                className="inline-flex items-center gap-3 transition-opacity hover:opacity-85"
              >
                <Logo size={40} />
              </Link>
            </div>

            {/* Editorial Heading & Subtitle */}
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-900 dark:text-emerald-300">
                  Verified Member Access
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
                Unlock Bangladesh&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-400">Smartest Tech Store.</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed">
                Create your Telos ID to save multiple delivery addresses, track live courier dispatches, and get VIP pre-order access.
              </p>
            </div>

            {/* Spec / Benefit Highlights */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-border/40 max-w-lg">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground block">
                  Coverage
                </span>
                <span className="text-xs sm:text-sm font-semibold text-foreground mt-1 block">
                  Official Warranty BD
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground block">
                  Speed Checkout
                </span>
                <span className="text-xs sm:text-sm font-semibold text-foreground mt-1 block">
                  1-Click Saved Hubs
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground block">
                  Security
                </span>
                <span className="text-xs sm:text-sm font-semibold text-foreground mt-1 block">
                  TLS 1.3 Protected
                </span>
              </div>
            </div>

            {/* Bottom Metatag */}
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Storefront • BD / REG-2026</span>
            </div>
          </div>

          {/* Right Hero Form: Pure Seamless Layout (No container card) */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md space-y-6">
              {/* Header */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 font-mono">
                  New Membership
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Create Account
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Join Telos to experience lightning-fast checkouts and live parcel updates.
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

              <div className="relative flex items-center justify-center py-0.5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/60" />
                </div>
                <span className="relative bg-background px-2 text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                  Or sign up with
                </span>
              </div>

              <GoogleAuthButton text="signup_with" onError={setErrorMessage} />
            </form>

            <div className="pt-4 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href={loginHref}
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
  </div>
  );
}