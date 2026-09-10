"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CreditCard,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { Logo, PaymentMethodsGrid } from "@/components/common";

const TRUST_PILLARS = [
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    desc: "Within 24-48 hrs in Dhaka, 72 hrs nationwide",
  },
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    desc: "Direct from verified brands & authorized dealers",
  },
  {
    icon: RotateCcw,
    title: "7-Day Easy Return",
    desc: "No hassle replacement & instant refund process",
  },
  {
    icon: Headphones,
    title: "Dedicated BD Support",
    desc: "9 AM - 10 PM daily hotline & instant chat",
  },
];

const SHOP_LINKS = [
  { label: "All Products", href: ROUTES.PRODUCTS },
  { label: "Smartphones & Tablets", href: ROUTES.CATEGORY_DETAIL("smartphones-tablets") },
  { label: "Laptops & MacBooks", href: ROUTES.CATEGORY_DETAIL("laptops-macbooks") },
  { label: "Gaming Gear & Consoles", href: ROUTES.CATEGORY_DETAIL("gaming-gear-consoles") },
  { label: "Audio & Headphones", href: ROUTES.CATEGORY_DETAIL("audio-headphones") },
  { label: "Smartwatches & Wearables", href: ROUTES.CATEGORY_DETAIL("smartwatches-wearables") },
  { label: "Browse All Categories", href: ROUTES.CATEGORIES },
];

const CUSTOMER_CARE_LINKS = [
  { label: "Live Order Tracking", href: ROUTES.TRACK_ORDER },
  { label: "Help & FAQ Center", href: ROUTES.CONTACT },
  { label: "Returns & Refund Policy", href: ROUTES.TERMS },
  { label: "Shipping & Delivery Terms", href: ROUTES.TERMS },
  { label: "My Wishlist", href: ROUTES.WISHLIST },
  { label: "Account Overview", href: ROUTES.ACCOUNT },
];

const COMPANY_LINKS = [
  { label: "About Telos Cart", href: ROUTES.ABOUT },
  { label: "Contact & Support", href: ROUTES.CONTACT },
  { label: "Track Your Order", href: ROUTES.TRACK_ORDER },
  { label: "Privacy Policy", href: ROUTES.PRIVACY_POLICY },
  { label: "Terms & Conditions", href: ROUTES.TERMS },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-300 dark:bg-black dark:border-zinc-800 transition-colors">
      {/* ── Trust Pillars Section ── */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/60 py-8">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_PILLARS.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-4 transition-all duration-200 hover:border-amber-500/40 hover:bg-zinc-900/80"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-100">{item.title}</h4>
                  <p className="mt-0.5 text-xs text-zinc-400 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Extended Footer Content: Exactly 4 Balanced Columns ── */}
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand & About Us Blurb */}
          <div className="space-y-4">
            <Link href={ROUTES.HOME} className="inline-block">
              <Logo size={36} textColor="text-white" />
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Telos Cart is Bangladesh's next-generation digital & retail commerce platform, offering authentic tech gear, nationwide verified shipping, and guaranteed customer satisfaction.
            </p>

            <div className="space-y-2.5 text-sm text-zinc-300 pt-1">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="tel:+8801700000000" className="hover:text-amber-400 transition-colors">
                  +880 1700-000000 (Hotline 9 AM - 10 PM)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="mailto:support@teloscart.com" className="hover:text-amber-400 transition-colors">
                  support@teloscart.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
              Popular Categories
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
              Customer Care
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CUSTOMER_CARE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company & Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
              Company & Info
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Horizontal Payment Methods Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80">
          <PaymentMethodsGrid horizontal />
        </div>
      </div>

      {/* ── Bottom Bar: Copyright & Terms ── */}
      <div className="border-t border-zinc-800/80 bg-black/50 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row text-xs text-zinc-400">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Telos Cart. All rights reserved. A Telos Digital initiative.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400">
            <Link href={ROUTES.ABOUT} className="hover:text-amber-400 transition-colors">
              About Us
            </Link>
            <span className="h-3 w-px bg-zinc-800" />
            <Link href={ROUTES.CONTACT} className="hover:text-amber-400 transition-colors">
              Contact Us
            </Link>
            <span className="h-3 w-px bg-zinc-800" />
            <Link href={ROUTES.PRIVACY_POLICY} className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="h-3 w-px bg-zinc-800" />
            <Link href={ROUTES.TERMS} className="hover:text-amber-400 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
