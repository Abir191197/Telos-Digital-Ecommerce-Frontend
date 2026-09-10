import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, FileText, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | Telos Cart Bangladesh",
  description: "Learn how Telos Cart collects, secures, and handles customer data across our e-commerce platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="border-b border-border/60 bg-muted/20 py-12">
        <div className="container px-4 sm:px-6 max-w-4xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
            <Lock className="h-3.5 w-3.5" />
            <span>Data Security & Compliance</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: September 2026. Effective for all Telos Cart customers and visitors.
          </p>
        </div>
      </div>

      <div className="container px-4 sm:px-6 max-w-4xl mx-auto py-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Introduction & Overview</h2>
          <p>
            At Telos Cart (a venture of Telos Digital), we respect and protect customer privacy. This Privacy Policy outlines the types of personal information collected when you access our storefront, place orders, use our tracking services, or engage with our customer support in Bangladesh.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-foreground">Account & Contact Details:</strong> Full name, verified mobile phone number, delivery address, and email.</li>
            <li><strong className="text-foreground">Order & Transaction Logs:</strong> Items purchased, shipping address, invoice totals, and payment status. Sensitive payment data (such as card numbers or bKash PINs) are processed strictly via SSLCOMMERZ gateway and are never stored on our servers.</li>
            <li><strong className="text-foreground">Device & Usage Analytics:</strong> IP address, device model, browser type, and interaction patterns to diagnose storefront performance and optimize mobile user experience.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To fulfill, verify, and dispatch your retail or digital orders nationwide.</li>
            <li>To provide live courier SMS and real-time delivery notifications.</li>
            <li>To resolve warranty, replacement, and customer service inquiries.</li>
            <li>To detect and prevent fraudulent transactions, automated bots, and unauthorized access.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Data Sharing & Third-Party Disclosure</h2>
          <p>
            We never sell, rent, or trade your personal data. We only share essential shipping information with verified logistics partners (such as Pathao, Steadfast, RedX, or eCourier) exclusively for doorstep delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Your Data Rights & Contact</h2>
          <p>
            You can request access, updates, or deletion of your personal data at any time by reaching out to our privacy compliance officer at <a href="mailto:support@teloscart.com" className="text-amber-500 underline font-medium">support@teloscart.com</a> or via our <Link href={ROUTES.CONTACT} className="text-amber-500 underline font-medium">Contact Center</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
