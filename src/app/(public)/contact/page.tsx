import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Contact & Customer Support | Telos Cart Bangladesh",
  description:
    "Get in touch with Telos Cart BD. Hotline, email support, corporate office address, and customer help desk.",
};

const CONTACT_METHODS = [
  {
    icon: Phone,
    title: "Customer Care Hotline",
    value: "+880 1700-000000",
    desc: "Every day 9:00 AM – 10:00 PM (BST)",
    actionText: "Call Now",
    actionHref: "tel:+8801700000000",
  },
  {
    icon: Mail,
    title: "Email Support",
    value: "support@teloscart.com",
    desc: "For general queries, refunds & orders",
    actionText: "Send Email",
    actionHref: "mailto:support@teloscart.com",
  },
  {
    icon: MessageSquare,
    title: "Live Chat Support",
    value: "Instant Response",
    desc: "Connect directly with our BD support agents",
    actionText: "Chat on WhatsApp",
    actionHref: "https://wa.me/8801700000000",
  },
  {
    icon: MapPin,
    title: "Corporate HQ",
    value: "Gulshan-2, Dhaka 1212",
    desc: "Dhaka, Bangladesh",
    actionText: "Get Directions",
    actionHref: "https://maps.google.com",
  },
];

const FAQS = [
  {
    q: "How fast is delivery inside and outside Dhaka?",
    a: "Orders inside Dhaka metropolitan area are delivered within 24–48 hours. District-level nationwide deliveries take 48–72 hours via premium courier networks.",
  },
  {
    q: "How can I track my parcel live?",
    a: "You can track your package instantly by clicking 'Live Order Tracking' in the menu or visiting the Track Order page using your Order ID or phone number.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support Cash on Delivery (COD), bKash, Nagad, Rocket, and all major VISA / MasterCard / American Express credit and debit cards secured by SSLCOMMERZ.",
  },
  {
    q: "What is your return & replacement policy?",
    a: "We offer a 7-day hassle-free replacement or refund policy if an item arrives damaged, defective, or inconsistent with specifications.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/50 via-background to-background py-14 sm:py-20">
        <div className="container px-4 sm:px-6 text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
            <Clock className="h-3.5 w-3.5" />
            <span>9:00 AM – 10:00 PM Daily Support</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            We're Here to Help You
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Have questions about an order, warranty claims, or product specifications? Reach out to our dedicated Dhaka-based customer success team.
          </p>
        </div>
      </section>

      {/* ── Contact Cards Grid ── */}
      <section className="container px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACT_METHODS.map((method) => (
            <div
              key={method.title}
              className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-6 transition-all hover:border-amber-500/40 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <method.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{method.title}</h3>
                  <div className="text-base font-bold text-foreground mt-0.5">{method.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{method.desc}</p>
                </div>
              </div>
              <div className="pt-5">
                <a
                  href={method.actionHref}
                  target={method.actionHref.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                >
                  <span>{method.actionText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Frequently Asked Questions ── */}
      <section className="container px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Quick answers to common questions regarding orders, shipping, and warranty.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-border/70 bg-card p-5 space-y-2 transition-colors hover:border-border"
              >
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <h4 className="text-sm font-semibold text-foreground">{faq.q}</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Track Order Banner */}
          <div className="mt-8 rounded-xl border border-border/70 bg-muted/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-foreground">Need to check shipment milestone?</h4>
              <p className="text-xs text-muted-foreground">
                Enter your tracking code or phone number to see courier status in real-time.
              </p>
            </div>
            <Link
              href={ROUTES.TRACK_ORDER}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors"
            >
              <span>Track Order Live</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
