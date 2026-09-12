"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Logo } from "@/components/common";
import {
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UserCheck,
  CheckCircle2,
  LayoutDashboard,
  User,
  Truck,
  ShieldAlert,
  Zap,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);

  const [inputVal, setInputVal] = useState("rahim.ahmed@example.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      loginWithCredentials(inputVal);
      // Set mock token cookie for edge middleware compatibility
      document.cookie = "accessToken=mock-demo-jwt-token; path=/; max-age=86400; SameSite=Lax";
      setIsLoading(false);
      router.push(ROUTES.PROFILE);
    }, 600);
  };

  const handleQuickDemoCustomer = () => {
    setIsLoading(true);
    setDemoLoaded(true);
    setTimeout(() => {
      loginAsDemo();
      document.cookie = "accessToken=mock-demo-jwt-token; path=/; max-age=86400; SameSite=Lax";
      setIsLoading(false);
      router.push(ROUTES.ACCOUNT);
    }, 400);
  };

  const handleQuickDemoAdmin = () => {
    setIsLoading(true);
    setDemoLoaded(true);
    setTimeout(() => {
      loginAsDemo();
      document.cookie = "accessToken=mock-admin-jwt-token; path=/; max-age=86400; SameSite=Lax";
      setIsLoading(false);
      router.push(ROUTES.DASHBOARD);
    }, 400);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-8rem)]">
        {/* ── Left Column: Editorial Brand & Hardware Showcase (5 cols) ── */}
        <div className="relative lg:col-span-5 p-8 sm:p-10 lg:p-14 flex flex-col justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-border/80 bg-zinc-100/90 dark:bg-zinc-900/60 text-foreground">
          {/* Background Image as Atmospheric Overlay with warm tint */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <Image
              src="/images/hero/electronics.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-center opacity-20 dark:opacity-25 mix-blend-multiply dark:mix-blend-luminosity scale-110"
            />
            {/* Smooth tone dampener - stops pure white glare */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-200/90 via-zinc-100/60 to-zinc-100/90 dark:from-zinc-950/90 dark:via-zinc-900/60 dark:to-zinc-950/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-100/70 via-transparent to-zinc-200/70 dark:from-zinc-950/70 dark:via-transparent dark:to-zinc-900/70" />
          </div>

          <div className="relative z-10 w-full max-w-sm mx-auto space-y-6">
            {/* Brand Logo */}
            <Link href={ROUTES.HOME} className="inline-block group">
              <Logo size={40} />
            </Link>

            {/* Headlines & Description (Left aligned) */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 border border-amber-500/30 px-3.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 backdrop-blur-sm shadow-xs">
                <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Curated Tech Hardware</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
                Authentic Gadgets. Official BD Warranties.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Log in to check live Steadfast & Pathao parcel pings, redeem saved vouchers, and access express checkout.
              </p>
            </div>

            {/* Hardware Stat Cards (Left aligned) */}
            <div className="w-full grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 backdrop-blur-md shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
                  Authenticity
                </span>
                <p className="text-xs font-bold text-foreground">100% Genuine BD</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Official importer seal</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 backdrop-blur-md shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
                  Dispatch
                </span>
                <p className="text-xs font-bold text-foreground">24h Express</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Steadfast & Pathao hub</p>
              </div>
            </div>

            {/* Trust Tag */}
            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-medium text-foreground">BTRC Verified</span>
              <span>•</span>
              <span className="font-mono text-[11px]">Dhaka, BD</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Sign In Form & Instant Demos (7 cols) ── */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-between bg-white dark:bg-zinc-950">
          <div className="w-full max-w-md mx-auto space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Enter your credentials or test immediately with 1-click demo profiles.
              </p>
            </div>

            {/* 1-Tap Instant Demo Access Box */}
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  1-Tap Instant Demo Access
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  No password required
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleQuickDemoCustomer}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 py-2.5 px-3 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <User className="h-3.5 w-3.5 shrink-0" />
                  <span>Demo Customer</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-foreground text-background hover:opacity-90 py-2.5 px-3 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <span>Demo Admin</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Mobile Number or Email</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="e.g. 01712345678 or user@email.com"
                    className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-sm font-semibold text-foreground placeholder:font-normal focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Password</span>
                  </label>
                  <Link
                    href={ROUTES.FORGOT_PASSWORD}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-border/80 bg-background pl-3.5 pr-11 text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Continue with Google (Just above Login) */}
              <button
                type="button"
                onClick={handleQuickDemoCustomer}
                disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-border/80 bg-background hover:bg-muted/60 text-foreground text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 pt-0.5"
              >
                <span>{isLoading ? "Logging in..." : "Login"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="w-full max-w-md mx-auto mt-8 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
            <p>
              Don&apos;t have an account yet?{" "}
              <Link
                href={ROUTES.REGISTER}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
