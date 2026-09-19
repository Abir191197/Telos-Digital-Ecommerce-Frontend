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
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Gift,
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
        {/* Left Column: Editorial Showcase */}
        <div className="hidden lg:flex relative lg:col-span-5 p-8 sm:p-10 lg:p-14 flex-col justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-border/80 bg-zinc-100/90 dark:bg-zinc-900/60 text-foreground">
          <div className="absolute inset-0 pointer-events-none select-none">
            <Image
              src="/images/hero/smartwatch.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-center opacity-20 dark:opacity-25 mix-blend-multiply dark:mix-blend-luminosity scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-200/90 via-zinc-100/60 to-zinc-100/90 dark:from-zinc-950/90 dark:via-zinc-900/60 dark:to-zinc-950/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-100/70 via-transparent to-zinc-200/70 dark:from-zinc-950/70 dark:via-transparent dark:to-zinc-900/70" />
          </div>

          <div className="relative z-10 w-full max-w-sm mx-auto space-y-6">
            <Link href={ROUTES.HOME} className="inline-block group">
              <Logo size={40} />
            </Link>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 backdrop-blur-sm shadow-xs">
                <Gift className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Instant ৳100 Welcome Voucher</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
                Unlock Bangladesh&apos;s Smartest Tech Store.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Create your Telos ID to save multiple delivery addresses, track
                live courier dispatches, and get VIP pre-order access.
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 backdrop-blur-md shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
                  Savings
                </span>
                <p className="text-xs font-bold text-foreground">
                  Up to 15% OFF
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Member flash access
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 backdrop-blur-md shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
                  Checkout
                </span>
                <p className="text-xs font-bold text-foreground">
                  1-Click Order
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Saved hub locations
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-medium text-foreground">
                Official Warranty BD
              </span>
              <span>•</span>
              <span className="font-mono text-[11px]">256-Bit SSL</span>
            </div>
          </div>
        </div>

        {/* Right Column: Register Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-between bg-white dark:bg-zinc-950 text-card-foreground">
          <div className="w-full max-w-lg mx-auto">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {errorMessage}
                </div>
              )}

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
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Mobile Number</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter mobile number"
                    className="h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none transition-colors"
                  />
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                  <Link
                    href={ROUTES.TERMS}
                    className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href={ROUTES.PRIVACY_POLICY}
                    className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 pt-0.5"
              >
                <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
              <p>
                Already have an account?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}