"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { mapBackendUserToCustomerUser, useAuthStore } from "@/stores";
import { ROUTES } from "@/constants";
import {
  useAdminLoginMutation,
  useLoginMutation,
} from "@/services/api/auth/authApi";
import { useAddToCartMutation } from "@/services/api/cart/cartApi";
import { useAddToWishlistMutation } from "@/services/api/wishlist/wishlistApi";
import Image from "next/image";
import { Logo } from "@/components/common";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  User,
} from "lucide-react";

const DEMO_CUSTOMER = {
  identifier: "customer@teloscart.website",
  password: "Customer123!",
};

const DEMO_ADMIN = {
  email: "admin@teloscart.website",
  password: "SuperAdmin123!",
};

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
    return "Login failed. Please try again.";
  }

  const data = (error as { data?: unknown }).data;
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }

  return "Login failed. Please try again.";
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const action = searchParams.get("action");
  const productId = searchParams.get("productId");
  const quantityParam = searchParams.get("quantity");
  const variantIdParam = searchParams.get("variantId");

  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();

  const handlePendingAction = async () => {
    if (!productId) return;
    try {
      if (action === "add-to-cart") {
        const qty = quantityParam ? parseInt(quantityParam, 10) : 1;
        await addToCartMutation({
          productId,
          quantity: isNaN(qty) ? 1 : qty,
          variantId: variantIdParam || undefined,
        }).unwrap();
      } else if (action === "add-to-wishlist") {
        await addToWishlistMutation({ productId }).unwrap();
      }
    } catch (err) {
      console.error("Failed to execute pending action on login:", err);
    }
  };

  const setAuth = useAuthStore((state) => state.setAuth);
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [adminLogin, { isLoading: isAdminLoginLoading }] =
    useAdminLoginMutation();

  const [inputVal, setInputVal] = useState(DEMO_CUSTOMER.identifier);
  const [password, setPassword] = useState(DEMO_CUSTOMER.password);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isLoading = isLoginLoading || isAdminLoginLoading;

  const getRedirectUrl = (fallback: string) => {
    return callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : fallback;
  };

  const persistSession = (
    accessToken: string,
    user: Parameters<typeof mapBackendUserToCustomerUser>[0],
  ) => {
    setAuth(mapBackendUserToCustomerUser(user), accessToken);
    setAuthCookies(accessToken, user.role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = inputVal.trim();
    if (!identifier || !password) return;

    try {
      setErrorMessage("");
      const response = await login(
        identifier.includes("@")
          ? { email: identifier, password }
          : { phone: identifier, password },
      ).unwrap();
      persistSession(response.data.accessToken, response.data.user);
      const userRole = response.data.user.role;
      const isAdmin =
        userRole === "SUPER_ADMIN" || userRole === "ADMIN" || userRole === "admin";
      if (isAdmin) {
        router.push(ROUTES.DASHBOARD);
      } else {
        await handlePendingAction();
        router.push(getRedirectUrl(ROUTES.ACCOUNT));
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleApplyDemo = async (role: "customer" | "admin") => {
    setErrorMessage("");

    if (role === "customer") {
      setInputVal(DEMO_CUSTOMER.identifier);
      setPassword(DEMO_CUSTOMER.password);
      try {
        const response = await login(DEMO_CUSTOMER).unwrap();
        persistSession(response.data.accessToken, response.data.user);
        await handlePendingAction();
        router.push(getRedirectUrl(ROUTES.ACCOUNT));
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      }
    } else {
      setInputVal(DEMO_ADMIN.email);
      setPassword(DEMO_ADMIN.password);
      try {
        const response = await adminLogin(DEMO_ADMIN).unwrap();
        persistSession(response.data.accessToken, response.data.user);
        router.push(ROUTES.DASHBOARD);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      }
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-8rem)]">
        {/* Left Hero Panel - Warm Golden Amber & Slate Rich Gradient */}
        <div className="hidden lg:flex relative lg:col-span-5 p-10 xl:p-14 flex-col justify-between overflow-hidden border-r border-amber-900/10 dark:border-border/70 bg-gradient-to-br from-amber-100/80 via-orange-50/50 to-stone-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-stone-950 text-foreground">
          {/* Intense Ambient Light Orbs & Texture */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <Image
              src="/images/hero/electronics.png"
              alt="Telos Hardware Showcase"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-center opacity-[0.09] dark:opacity-[0.14] mix-blend-multiply dark:mix-blend-luminosity scale-105"
            />
            {/* Rich multi-stop lighting */}
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/25 to-orange-500/10 blur-[90px]" />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tl from-amber-300/20 via-orange-200/15 to-transparent dark:from-amber-600/15 blur-[100px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-600/20 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-950 dark:text-amber-300">
                  Telos Central Access
                </span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-[1.15]">
                Curated electronics, guaranteed origin.
              </h2>
              <p className="text-xs xl:text-sm text-muted-foreground font-normal leading-relaxed">
                Connect your account to inspect warranty certificates, live parcel dispatches, and priority fulfillment across Bangladesh.
              </p>
            </div>

            {/* Spec Row */}
            <div className="pt-2 border-t border-amber-950/10 dark:border-white/10 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground block">
                  Distribution
                </span>
                <span className="text-xs font-semibold text-foreground mt-0.5 block">
                  Official Importer Seal
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground block">
                  Logistics SLA
                </span>
                <span className="text-xs font-semibold text-foreground mt-0.5 block">
                  Express Hub Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Metatag */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-amber-950/10 dark:border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="font-medium text-foreground">TLS 1.3 End-to-End Secure</span>
            </div>
            <span>BD / REG-2026</span>
          </div>
        </div>

        {/* Form Panel - Cool Slate & Opal Rich Gradient */}
        <div className="relative lg:col-span-7 px-6 py-10 sm:px-12 sm:py-16 lg:px-16 xl:px-20 flex flex-col justify-center overflow-hidden bg-gradient-to-bl from-slate-50 via-zinc-50 to-stone-100/90 dark:from-zinc-950 dark:via-zinc-900 dark:to-stone-950">
          {/* Subtle Ambient Radial Highlight on Form side */}
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/[0.04] dark:bg-amber-500/[0.03] blur-[100px]" />

          <div className="relative z-10 w-full max-w-md mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground font-mono">
                Authentication
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Sign in to your account
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Enter your registered mobile or email to continue.
              </p>
            </div>

            {/* Authentic Minimal Demo Access Bar with Rich Ambient Gradient */}
            <div className="relative overflow-hidden rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-amber-400/[0.04] to-orange-500/[0.08] dark:from-amber-500/15 dark:via-zinc-900/60 dark:to-orange-500/10 backdrop-blur-md p-3.5 shadow-xs transition-all">
              {/* Inner ambient glow orb */}
              <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-400/20 dark:bg-amber-500/15 blur-xl" />

              <div className="relative z-10 flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-500/30 animate-pulse" />
                  <span className="text-xs font-semibold text-foreground tracking-tight">
                    Instant Demo Login
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-800/80 dark:text-amber-400/80 uppercase tracking-wider font-medium">
                  1-Click Sign In
                </span>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyDemo("customer")}
                  disabled={isLoading}
                  className="group relative flex items-center justify-between px-3 py-2 rounded-lg border border-border/80 bg-background/80 hover:bg-background hover:border-amber-500/40 text-left transition-all shadow-2xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-foreground leading-none">
                        Customer
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">
                        customer@teloscart
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyDemo("admin")}
                  disabled={isLoading}
                  className="group relative flex items-center justify-between px-3 py-2 rounded-lg border border-border/80 bg-background/80 hover:bg-background hover:border-amber-500/40 text-left transition-all shadow-2xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <LayoutDashboard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 shrink-0 transition-colors" />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-foreground leading-none">
                        Admin Portal
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">
                        admin@teloscart
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </button>
              </div>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="name@email.com or 017xxxxxxxx"
                  className="h-10 w-full rounded-lg border border-border bg-card px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">
                    Password
                  </label>
                  <Link
                    href={ROUTES.FORGOT_PASSWORD}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-foreground text-background hover:bg-amber-500 hover:text-zinc-950 hover:shadow-md hover:shadow-amber-500/20 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? "Signing in..." : "Continue"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyDemo("customer")}
                  disabled={isLoading}
                  className="w-full h-10 flex items-center justify-center gap-2.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground text-xs sm:text-sm font-medium transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            </form>

            {/* Bottom Link */}
            <div className="pt-4 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href={ROUTES.REGISTER}
                  className="font-semibold text-foreground hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
