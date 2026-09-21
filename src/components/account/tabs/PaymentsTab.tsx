"use client";

import React, { useState } from "react";
import { AppImage } from "@/components/shared";
import { Plus, Check, Trash2, X, CreditCard, ShieldCheck } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "bkash" | "nagad" | "rocket" | "card" | "cod";
  title: string;
  identifier: string;
  isDefault: boolean;
  logoUrl?: string;
  desc: string;
}

const INITIAL_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "bkash",
    title: "bKash MFS Wallet",
    identifier: "017***-**678",
    isDefault: true,
    logoUrl: "/images/payment-partners/bkash.png",
    desc: "Used for instant 1-tap checkout and automatic promo codes across Bangladesh.",
  },
  {
    id: "pm-2",
    type: "cod",
    title: "Cash on Delivery",
    identifier: "Standard BD Parcel Option",
    isDefault: false,
    desc: "Pay upon parcel inspection with Steadfast or Pathao courier rider.",
  },
];

export function PaymentsTab() {
  const [methods, setMethods] = useState<PaymentMethod[]>(INITIAL_METHODS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<"bkash" | "nagad" | "rocket" | "card">("bkash");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [makeDefault, setMakeDefault] = useState(false);

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) return;

    let logo = "";
    let title = "";
    let masked = "";

    if (selectedType === "bkash") {
      logo = "/images/payment-partners/bkash.png";
      title = "bKash MFS Wallet";
      masked = accountNumber.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    } else if (selectedType === "nagad") {
      logo = "/images/payment-partners/nagad.png";
      title = "Nagad Digital Payment";
      masked = accountNumber.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    } else if (selectedType === "rocket") {
      logo = "/images/payment-partners/rocket.webp";
      title = "DBBL Rocket Wallet";
      masked = accountNumber.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    } else {
      logo = "/images/payment-partners/visa.png";
      title = "Debit / Credit Card";
      masked = `•••• •••• •••• ${accountNumber.slice(-4) || "1234"}`;
    }

    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: selectedType,
      title,
      identifier: masked,
      isDefault: makeDefault || methods.length === 0,
      logoUrl: logo,
      desc: selectedType === "card"
        ? `Expires ${cardExpiry || "12/28"} • 256-bit Encrypted`
        : "Direct OTP authorization with Bangladesh MFS gateway.",
    };

    setMethods((prev) => {
      const updated = makeDefault ? prev.map((m) => ({ ...m, isDefault: false })) : [...prev];
      return [newMethod, ...updated];
    });

    setAccountNumber("");
    setAccountHolder("");
    setCardExpiry("");
    setMakeDefault(false);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Clean Header Bar with Add Method Action */}
      <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Saved Payment Methods
          </h3>
          <p className="text-xs text-muted-foreground">
            Convenient 1-tap checkout with mobile financial services & local cards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-4 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add New Method</span>
        </button>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`rounded-3xl border p-5 space-y-3.5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06),0_2px_8px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-8px_rgba(245,158,11,0.18),0_8px_20px_-4px_rgba(245,158,11,0.1)] transition-shadow duration-300 ${
              method.isDefault
                ? "bg-gradient-to-br from-amber-500/[0.08] via-card to-card dark:from-amber-500/[0.12] dark:via-zinc-900/90 dark:to-zinc-900/70 border-amber-500/40 ring-1 ring-amber-500/20"
                : "bg-gradient-to-br from-card via-card to-card/95 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-900/60 border-border/40 dark:border-white/10"
            }`}
          >
            {/* Top row: Logo/Pill + Status Badge */}
            <div className="flex items-center justify-between">
              {method.logoUrl ? (
                <div className="relative h-8 w-14 rounded-xl bg-white dark:bg-white/95 p-1 border border-border/40 overflow-hidden shadow-2xs">
                  <AppImage
                    src={method.logoUrl}
                    alt={method.title}
                    fill
                    className="object-contain p-0.5"
                    fallbackIconSize={14}
                  />
                </div>
              ) : (
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/20 px-2.5 py-1 rounded-xl shadow-2xs">
                  {method.title}
                </span>
              )}

              {method.isDefault ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/20 dark:bg-amber-500/30 px-2.5 py-1 rounded-full">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                  <span>Default</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetDefault(method.id)}
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer py-1 px-1.5 rounded-md hover:bg-amber-500/10 transition-colors"
                >
                  Set as Default
                </button>
              )}
            </div>

            {/* Middle identifier */}
            <div>
              <p className="text-base font-mono font-black text-foreground tracking-tight">
                {method.identifier}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {method.desc}
              </p>
            </div>

            {/* Bottom actions */}
            {method.type !== "cod" && (
              <div className="pt-2 border-t border-border/40 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete(method.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Add Payment Method
                </h3>
                <p className="text-xs text-muted-foreground">
                  Link a mobile wallet or card for fast checkout in BD.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Method Type Selector */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: "bkash" as const, label: "bKash", logo: "/images/payment-partners/bkash.png" },
                { type: "nagad" as const, label: "Nagad", logo: "/images/payment-partners/nagad.png" },
                { type: "rocket" as const, label: "Rocket", logo: "/images/payment-partners/rocket.webp" },
                { type: "card" as const, label: "Card", icon: CreditCard },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSelectedType(item.type)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedType === item.type
                      ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20"
                      : "border-border/60 bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  {item.logo ? (
                    <div className="relative h-6 w-10">
                      <AppImage src={item.logo} alt={item.label} fill className="object-contain" fallbackIconSize={12} />
                    </div>
                  ) : (
                    <CreditCard className="h-6 w-6 text-foreground" />
                  )}
                  <span className="text-[11px] font-bold text-foreground">{item.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {selectedType !== "card" ? (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Wallet Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="h-10 sm:h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    A verification OTP will be sent to confirm authorization.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444"
                      className="h-10 sm:h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="Name on card"
                        className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Set as default checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={makeDefault}
                  onChange={(e) => setMakeDefault(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-foreground">
                  Set as default payment method
                </span>
              </label>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 text-muted-foreground text-[11px]">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>SSL encrypted & PCI-DSS compliant. Card details are never stored raw.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-border/80 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-5 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Save Method</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
