"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { m } from "framer-motion";
import { ROUTES } from "@/constants";

export function ContactFormHub() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Status & Tracking",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Order Status & Tracking",
        message: "",
      });
    }, 1500);
  };

  return (
    <section className="border-y border-border/60 bg-muted/20 py-14 sm:py-20">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-3xl bg-card border border-border/80 p-6 sm:p-10 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.6)] space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Direct Inquiry Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Fill out the form below. Our response team will review your inquiry and respond within 2 to 4 business hours.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">Message Dispatched Successfully!</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Thank you for contacting Telos Cart. A representative has received your ticket and will follow up shortly via email or phone.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-amber-500 focus:outline-hidden transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 01700-000000"
                      className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-amber-500 focus:outline-hidden transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. tanvir@example.com"
                      className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-amber-500 focus:outline-hidden transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Inquiry Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground focus:border-amber-500 focus:outline-hidden transition-colors"
                    >
                      <option value="Order Status & Tracking">Order Status & Tracking</option>
                      <option value="Warranty & Technical Claim">Warranty & Technical Claim</option>
                      <option value="Product Pre-Purchase Advice">Product Pre-Purchase Advice</option>
                      <option value="Corporate & Bulk B2B Order">Corporate & Bulk B2B Order</option>
                      <option value="Return / Refund Request">Return / Refund Request</option>
                      <option value="Other Query">Other Query</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your query, including Order ID if applicable..."
                    className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-amber-500 focus:outline-hidden transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-7 py-3 text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </m.div>

          {/* Right Column: Experience Hub Info */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Gulshan Flagship Card */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)] space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Dhaka Experience Center</h3>
                  <p className="text-[11px] text-muted-foreground">In-Person Demos & Pickups</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Test flagship devices hands-on, consult with our hardware engineers, or pick up reserved online orders at our Gulshan hub.
              </p>

              <div className="space-y-2 pt-1 border-t border-border/50 text-xs">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Level 6, Navana Tower, Gulshan Circle 2, Dhaka 1212</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Saturday – Thursday: 10:00 AM – 8:00 PM</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Gulshan-2+Dhaka"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors pt-2"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Instant Order Tracking Direct Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-card to-card border border-amber-500/30 shadow-md space-y-3">
              <div className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-zinc-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                Quick Service
              </div>
              <h3 className="text-base font-bold text-foreground">Looking for a Courier Update?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track the exact GPS milestone of your parcel across Dhaka and all 64 districts in real-time.
              </p>
              <Link
                href={ROUTES.TRACK_ORDER}
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <span>Open Live Order Tracker</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
