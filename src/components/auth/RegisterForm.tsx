"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/constants";
import Image from "next/image";
import { Logo } from "@/components/common";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Gift,
  Truck,
  MapPin,
  Flame,
  Zap,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const registerCustomer = useAuthStore((state) => state.registerCustomer);
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneWithoutPrefix, setPhoneWithoutPrefix] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phoneWithoutPrefix) return;

    setIsLoading(true);
    const fullPhone = `+880${phoneWithoutPrefix.trim().replace(/^0+/, "")}`;
    setTimeout(() => {
      registerCustomer(name, email, fullPhone);
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
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-8rem)]">
        {/* Left Column: Editorial Showcase (Hidden on mobile) */}
        <div className="hidden lg:flex relative lg:col-span-5 p-8 sm:p-10 lg:p-14 flex-col justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-border/80 bg-zinc-100/90 dark:bg-zinc-900/60 text-foreground">
          {/* Background Image as Atmospheric Ambient Overlay */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <Image
              src="/images/hero/smartwatch.png"
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
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 backdrop-blur-sm shadow-xs">
                <Gift className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Instant ৳100 Welcome Voucher</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
                Unlock Bangladesh&apos;s Smartest Tech Store.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Create your Telos ID to save multiple delivery addresses, track live courier dispatches, and get VIP pre-order access.
              </p>
            </div>

            {/* Hardware Stat Cards (Left aligned) */}
            <div className="w-full grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 backdrop-blur-md shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
                  Savings
                </span>
                <p className="text-xs font-bold text-foreground">Up to 15% OFF</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Member flash access</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 backdrop-blur-md shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
                  Checkout
                </span>
                <p className="text-xs font-bold text-foreground">1-Click Order</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Saved hub locations</p>
              </div>
            </div>

            {/* Trust Tag */}
            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-medium text-foreground">Official Warranty BD</span>
              <span>•</span>
              <span className="font-mono text-[11px]">256-Bit SSL</span>
            </div>
          </div>
        </div>

        {/* Right Column: Register Form (Col 7) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-between bg-white dark:bg-zinc-950 text-card-foreground">
          <div className="w-full max-w-lg mx-auto">
            {/* Header */}
            <div className="space-y-1.5 mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <User className="h-3.5 w-3.5" />
                <span>Quick Registration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get started in under 30 seconds.
              </p>
            </div>

            {/* 1-Tap Demo Alternative */}
            <div className="mb-6 p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Testing the UI?
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  Dhaka, Bangladesh
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Skip filling forms. Instantly load pre-configured customer profile with orders & saved addresses.
              </p>
              <button
                type="button"
                onClick={handleQuickDemo}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 py-2.5 text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <span>Instant Demo Login (Customer)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Hossain"
                  className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tanvir@example.com"
                    className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1.5">
                    <span>Mobile Number</span>
                    <span className="text-[10px] font-normal text-muted-foreground">(BD only)</span>
                  </label>
                  <div className="flex h-11 items-center rounded-xl border border-border/80 bg-background overflow-hidden focus-within:border-amber-500 transition-colors">
                    <div className="flex items-center gap-1.5 bg-muted/60 px-3 h-full border-r border-border/70 select-none">
                      <span className="text-base leading-none">🇧🇩</span>
                      <span className="text-xs font-bold text-foreground">+880</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneWithoutPrefix}
                      onChange={(e) => setPhoneWithoutPrefix(e.target.value.replace(/\D/g, ""))}
                      placeholder="1712345678"
                      maxLength={10}
                      className="h-full flex-1 bg-transparent px-3 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="h-11 w-full rounded-xl border border-border/80 bg-background pl-3.5 pr-11 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none transition-colors"
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

              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-border accent-amber-500 h-4 w-4"
                />
                <span className="text-[11px] text-muted-foreground leading-snug">
                  I agree to the{" "}
                  <Link href={ROUTES.TERMS} className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href={ROUTES.PRIVACY_POLICY} className="text-amber-600 dark:text-amber-400 font-medium hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Continue with Google (Just above Register) */}
              <button
                type="button"
                onClick={handleQuickDemo}
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
                disabled={isLoading || !agreeTerms}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 pt-0.5"
              >
                <span>{isLoading ? "Registering..." : "Register"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="w-full max-w-lg mx-auto mt-8 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground space-y-2">
            <p>
              Already have an account?{" "}
              <Link
                href={ROUTES.LOGIN}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Sign In
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Bangladesh Merchant Store</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
