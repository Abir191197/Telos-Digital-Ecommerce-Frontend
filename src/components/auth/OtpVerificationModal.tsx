"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Smartphone, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OtpVerificationModalProps {
  phone: string;
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  purpose?: string;
}

export function OtpVerificationModal({
  phone,
  isOpen,
  onClose,
  onVerified,
  purpose = "Verify your account and checkout securely",
}: OtpVerificationModalProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setDigits(["", "", "", "", "", ""]);
      setIsSuccess(false);
      setError(null);
      setCooldown(45);
      return;
    }
    inputRefs.current[0]?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (cooldown <= 0 || !isOpen) return;
    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown, isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    setError(null);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when all 6 filled
    if (cleaned && index === 5 && newDigits.every((d) => d !== "")) {
      triggerVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    if (pasted.length === 6) {
      triggerVerify(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const triggerVerify = (code: string) => {
    setIsVerifying(true);
    setError(null);
    setTimeout(() => {
      // Demo code: 123456 or any 6 digits accepted in demo mode
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        onVerified();
        onClose();
      }, 700);
    }, 600);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(45);
    setDigits(["", "", "", "", "", ""]);
    setError("New OTP sent via SMS to " + phone);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-border/80 bg-background p-6 sm:p-7 shadow-2xl space-y-5 text-center relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
          {isSuccess ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-600 animate-in zoom-in" />
          ) : (
            <Smartphone className="h-7 w-7" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-black text-foreground">
            {isSuccess ? "Verification Successful!" : "Enter 6-Digit SMS Code"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Sent to <strong className="font-mono text-foreground">{phone || "+880 1712-345678"}</strong>
          </p>
          <p className="text-[11px] text-muted-foreground">{purpose}</p>
        </div>

        {/* 6 Digit Inputs */}
        <div className="flex items-center justify-center gap-2 py-2" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={cn(
                "h-12 w-11 sm:w-12 rounded-xl border text-center text-lg font-black text-foreground focus:outline-none transition-all shadow-xs",
                digit
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-border/80 bg-background focus:border-amber-500"
              )}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            {error}
          </p>
        )}

        <div className="pt-1 flex flex-col items-center gap-3">
          <button
            type="button"
            disabled={digits.some((d) => !d) || isVerifying || isSuccess}
            onClick={() => triggerVerify(digits.join(""))}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 active:scale-98 disabled:opacity-40 transition-all cursor-pointer"
          >
            {isVerifying ? "Verifying..." : isSuccess ? "Verified ✓" : "Verify & Continue"}
          </button>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {cooldown > 0 ? (
              <span>Resend code in <strong className="text-foreground">{cooldown}s</strong></span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Resend OTP Code</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground/80">
          Demo tip: You can enter any 6 digits (e.g. 123456)
        </p>
      </div>
    </div>
  );
}
