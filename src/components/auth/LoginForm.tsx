"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import {
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UserCheck,
  CheckCircle2,
  LayoutDashboard,
  User,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);

  const [inputVal, setInputVal] = useState("rahim.ahmed@example.com");
  const [password, setPassword] = useState("••••••••");
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
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* ── Card Container ── */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl text-card-foreground">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 shadow-sm mx-auto mb-1">
            <UserCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Sign In to Telos Cart
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign in as a customer to track orders or as store admin to manage shop
          </p>
        </div>

        {/* Two Separate 1-Tap Demo Buttons */}
        <div className="mb-6 p-4 rounded-3xl border border-border/80 bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              1-Tap Instant Demo Access
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              No password needed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Demo Customer Button */}
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white py-3 px-3 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <User className="h-3.5 w-3.5 shrink-0" />
              <span>Demo Customer</span>
            </button>

            {/* Demo Admin Button */}
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background hover:opacity-90 py-3 px-3 text-xs font-bold shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/70" />
          </div>
          <span className="relative bg-card px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Or Sign In With Email / Phone
          </span>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Mobile Number or Email
            </label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="+880 1700-000000 or email@domain.com"
                className="h-11 w-full rounded-xl border border-border/80 bg-background pl-10 pr-3.5 text-xs sm:text-sm font-semibold text-foreground placeholder:font-normal focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-[11px] font-semibold text-amber-600 hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                className="h-11 w-full rounded-xl border border-border/80 bg-background pl-10 pr-3.5 text-xs sm:text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground text-background hover:opacity-90 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? "Logging in..." : "Login"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-border/60 text-center text-xs text-muted-foreground space-y-2">
          <p>
            New customer at Telos Cart?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="font-bold text-amber-600 hover:underline"
            >
              Create an Account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 pt-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Encrypted & Secured Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
