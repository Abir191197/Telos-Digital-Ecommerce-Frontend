"use client";

import React, { useState } from "react";
import { X, BellRing, CheckCircle2, ShieldCheck, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common";

interface NotifyStockModalProps {
  productName: string;
  productSlug: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NotifyStockModal({
  productName,
  isOpen,
  onClose,
}: NotifyStockModalProps) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [prefChannel, setPrefChannel] = useState<"sms" | "email">("sms");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const handleClose = () => {
    setSubmitted(false);
    setEmailOrPhone("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-border/80 bg-background p-6 sm:p-7 shadow-2xl space-y-5 relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="text-center py-4 space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Notification Alert Saved!
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We will notify you immediately via{" "}
              <strong className="text-foreground uppercase">{prefChannel}</strong> at{" "}
              <strong className="font-mono text-foreground">{emailOrPhone}</strong> as soon
              as fresh official stock arrives at Telos Cart BD.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Notify Me When In Stock
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {productName}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              This product is currently out of stock. Leave your phone number or email to receive an instant SMS or alert the moment it is restocked.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 p-1 bg-muted/40 rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => setPrefChannel("sms")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    prefChannel === "sms"
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>SMS Alert (BD)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrefChannel("email")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    prefChannel === "email"
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email Alert</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">
                  {prefChannel === "sms" ? "Mobile Phone Number:" : "Email Address:"}
                </label>
                <input
                  type={prefChannel === "sms" ? "tel" : "email"}
                  required
                  placeholder={prefChannel === "sms" ? "+880 1700-000000" : "you@example.com"}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="amber"
                  size="sm"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Saving..." : "Notify Me"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
