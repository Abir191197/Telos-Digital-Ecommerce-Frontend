"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "demo-reset-token";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength calculation
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = () => {
    if (!password) return "";
    if (strength <= 1) return "Weak";
    if (strength === 2) return "Moderate";
    if (strength === 3) return "Strong";
    return "Very Strong";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword || strength < 2) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="container flex min-h-[calc(100vh-14rem)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 text-card-foreground shadow-sm relative overflow-hidden">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  Password Reset Complete!
                </h2>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Your password has been successfully updated. You can now sign in with your new credentials.
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href={ROUTES.LOGIN}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2 text-center mb-6">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  <Lock className="h-6 w-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Set New Password
                </h1>
                <p className="text-xs text-muted-foreground">
                  Secure your Telos Cart account with a strong combination.
                </p>
                {token && (
                  <span className="inline-block mt-1 font-mono text-[10px] text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-md">
                    Token: {token.slice(0, 16)}...
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="text-xs font-bold text-foreground">
                    New Password:
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 pr-10 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-muted-foreground">Strength:</span>
                        <span
                          className={cn(
                            strength <= 1
                              ? "text-rose-500"
                              : strength === 2
                              ? "text-amber-500"
                              : "text-emerald-600"
                          )}
                        >
                          {getStrengthLabel()}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={cn(
                              "rounded-full transition-colors",
                              step <= strength
                                ? strength <= 1
                                  ? "bg-rose-500"
                                  : strength === 2
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                                : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-bold text-foreground">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      "mt-1 h-11 w-full rounded-xl border bg-background px-3 text-xs font-medium text-foreground focus:outline-none",
                      confirmPassword && confirmPassword !== password
                        ? "border-rose-500"
                        : "border-border/80 focus:border-amber-500"
                    )}
                  />
                  {confirmPassword && confirmPassword !== password && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-500">
                      Passwords do not match.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !password ||
                    password !== confirmPassword ||
                    strength < 2
                  }
                  className="w-full mt-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 active:scale-98 disabled:opacity-40 transition-all cursor-pointer"
                >
                  {isSubmitting ? "Resetting Password..." : "Update Password"}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
