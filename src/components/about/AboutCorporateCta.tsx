"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Mail, PhoneCall } from "lucide-react";
import { m } from "framer-motion";
import { ROUTES } from "@/constants";

export function AboutCorporateCta() {
  return (
    <section className="container px-4 sm:px-6 pt-12 sm:pt-16 pb-6">
      <m.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Corporate Headquarters & Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Partner With Telos Digital Commerce Ltd.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
              Whether you are an individual customer seeking verified authentic hardware, a corporate purchasing manager, or a global hardware manufacturer exploring retail distribution in Bangladesh.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-xs sm:text-sm font-semibold hover:opacity-90 active:scale-98 transition-all"
              >
                <span>Browse Verified Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={ROUTES.CONTACT}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/40 hover:bg-muted/70 px-6 py-3 text-xs sm:text-sm font-semibold text-foreground active:scale-98 transition-all"
              >
                <span>Direct Contact Desk</span>
              </Link>
            </div>
          </div>

          {/* Physical Address / Legal info card */}
          <div className="lg:col-span-5 rounded-2xl border border-border/70 bg-muted/30 p-5 sm:p-6 space-y-3.5 text-xs text-muted-foreground">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">Executive Office & Central Hub</span>
                <span>Level 7, Concord Tower, Gulshan-2, Dhaka-1212, Bangladesh</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">Corporate Inquiries</span>
                <span>enterprise@teloscart.com · support@teloscart.com</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <PhoneCall className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">Official Hotline & Desk</span>
                <span>+880 9610-000000 (Sat - Thu, 9:00 AM - 8:00 PM)</span>
              </div>
            </div>

            <div className="pt-2 mt-1 border-t border-border/60 text-[11px] text-muted-foreground">
              A digital commerce initiative created & engineered by{" "}
              <a
                href="https://www.telosdigital.agency/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-amber-500 hover:text-amber-400 underline underline-offset-2 transition-colors"
              >
                Telos Digital
              </a>
              .
            </div>
          </div>
        </div>
      </m.div>
    </section>
  );
}
