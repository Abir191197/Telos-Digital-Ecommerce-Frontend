"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="container flex min-h-[calc(100vh-14rem)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 text-card-foreground shadow-sm relative overflow-hidden">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  Reset Link Dispatched!
                </h2>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  We sent instructions to{" "}
                  <strong className="text-foreground">{email}</strong>. Check your inbox and spam folder.
                </p>
              </div>

              <div className="pt-3 space-y-2">
                <Link
                  href={`${ROUTES.RESET_PASSWORD}?token=demo_security_token_bd_${Date.now()}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all"
                >
                  <span>Open Reset Link (Simulate)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 cursor-pointer"
                >
                  Try another email
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2 text-center mb-6">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  <Mail className="h-6 w-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Forgot your password?
                </h1>
                <p className="text-xs text-muted-foreground">
                  Enter your email address and we will send you a password reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground">
                    Registered Email:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. customer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 active:scale-98 disabled:opacity-40 transition-all cursor-pointer"
                >
                  {isSubmitting ? "Sending Link..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
