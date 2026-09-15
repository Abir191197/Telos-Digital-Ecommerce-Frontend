"use client";

import React from "react";
import { Phone, Mail, MapPin, MessageSquare, ArrowUpRight } from "lucide-react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { containerVariants, itemVariants } from "./contactAnimations";

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    title: "Customer Hotline",
    badge: "Official Support",
    value: "+880 1700-000000",
    desc: "Speak directly with verified Bangladeshi hardware specialists.",
    timing: "Daily: 9:00 AM – 10:00 PM BST",
    accent: "text-amber-500",
    iconBg: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-zinc-950",
    glow: "group-hover:border-amber-500/40 group-hover:shadow-[0_16px_36px_-8px_rgba(245,158,11,0.2)]",
    actionText: "Call Hotline",
    actionHref: "tel:+8801700000000",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Live Desk",
    badge: "Instant ~5m",
    value: "WhatsApp Chat",
    desc: "Send invoice photos, product verification queries, or delivery inquiries.",
    timing: "Available 7 Days a Week",
    accent: "text-emerald-500",
    iconBg: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white",
    glow: "group-hover:border-emerald-500/40 group-hover:shadow-[0_16px_36px_-8px_rgba(16,185,129,0.2)]",
    actionText: "Open WhatsApp",
    actionHref: "https://wa.me/8801700000000",
  },
  {
    icon: Mail,
    title: "Official Email",
    badge: "24h SLA",
    value: "support@teloscart.com",
    desc: "For corporate inquiries, warranty claim escalations, and bulk tenders.",
    timing: "support@teloscart.com",
    accent: "text-blue-500",
    iconBg: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white",
    glow: "group-hover:border-blue-500/40 group-hover:shadow-[0_16px_36px_-8px_rgba(59,130,246,0.2)]",
    actionText: "Send Mail",
    actionHref: "mailto:support@teloscart.com",
  },
  {
    icon: MapPin,
    title: "Corporate Experience Center",
    badge: "Gulshan-2, Dhaka",
    value: "Dhaka Flagship Hub",
    desc: "Level 6, Navana Tower, Gulshan Circle 2, Dhaka 1212, Bangladesh.",
    timing: "Open Sat – Thu: 10 AM – 8 PM",
    accent: "text-purple-500",
    iconBg: "bg-purple-500/10 text-purple-500 group-hover:bg-purple-600 group-hover:text-white",
    glow: "group-hover:border-purple-500/40 group-hover:shadow-[0_16px_36px_-8px_rgba(168,85,247,0.2)]",
    actionText: "Google Maps View",
    actionHref: "https://maps.google.com/?q=Gulshan-2+Dhaka",
  },
];

export function ContactChannelsGrid() {
  return (
    <section className="container px-4 sm:px-6 py-10 sm:py-14">
      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {CONTACT_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <m.div
              key={channel.title}
              variants={itemVariants}
              className={cn(
                "group relative flex flex-col justify-between p-6 rounded-3xl bg-card border border-border/70 shadow-[0_6px_25px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.45)] hover:-translate-y-1 transition-all duration-300",
                channel.glow
              )}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-110",
                      channel.iconBg
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {channel.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-sm font-bold text-muted-foreground">
                    {channel.title}
                  </h2>
                  <div className="text-base sm:text-lg font-black text-foreground tracking-tight">
                    {channel.value}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {channel.desc}
                  </p>
                  <div className="text-[11px] font-medium text-amber-500 pt-1">
                    {channel.timing}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 mt-4">
                <a
                  href={channel.actionHref}
                  target={channel.actionHref.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-2xl bg-secondary/80 hover:bg-amber-500 hover:text-zinc-950 px-4 py-2.5 text-xs font-bold text-foreground transition-all duration-200 active:scale-95 shadow-2xs group/btn"
                >
                  <span>{channel.actionText}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              </div>
            </m.div>
          );
        })}
      </m.div>
    </section>
  );
}
