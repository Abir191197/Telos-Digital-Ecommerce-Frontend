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

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setDemoLoaded(true);
    setTimeout(() => {
      loginAsDemo();
      // Set mock token cookie for edge middleware compatibility
      document.cookie = "accessToken=mock-demo-jwt-token; path=/; max-age=86400; SameSite=Lax";
      setIsLoading(false);
      router.push(ROUTES.PROFILE);
    }, 500);
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
            Customer Sign In
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign in to access your orders, track shipments & saved addresses
          </p>
        </div>

        {/* One-Tap Demo Login Banner */}
        <div className="mb-6 p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              1-Tap Demo Customer
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              Dhaka, Bangladesh
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Test full order history & tracking without registration. Auto-loads:{" "}
            <strong className="text-foreground">Rahim Ahmed</strong> (+880 1712-345678).
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white py-2.5 text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isLoading && demoLoaded ? (
              <span>Signing In as Demo...</span>
            ) : (
              <>
                <span>Sign In as Demo Customer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
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
