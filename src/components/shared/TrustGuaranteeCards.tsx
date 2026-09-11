import React from "react";
import { ShieldCheck, Sparkles, CheckCircle2, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustGuaranteeCardsProps {
  className?: string;
}

interface GuaranteeItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge: string;
  badgeClass: string;
  iconBgClass: string;
  gradient: string;
  hoverShadowClass: string;
  description: string;
  tags: string[];
}

const GUARANTEE_ITEMS: GuaranteeItem[] = [
  {
    icon: ShieldCheck,
    title: "100% Genuine BD Warranty",
    badge: "Official Importer",
    badgeClass: "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300",
    iconBgClass: "bg-emerald-500 text-white",
    gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.06) 50%, rgba(16, 185, 129, 0.02) 100%)",
    hoverShadowClass: "shadow-md hover:shadow-2xl hover:shadow-emerald-500/30",
    description:
      "Direct authorized regional inventory with verified IMEI/serial tracking, sealed factory packages, and official brand service coverage.",
    tags: ["Original Box & Seal", "Official Invoicing", "1-2 Yr Service"],
  },
  {
    icon: Sparkles,
    title: "Express 24-48h Dispatch",
    badge: "Dhaka Metro Fast",
    badgeClass: "bg-amber-500/20 text-amber-800 dark:text-amber-300",
    iconBgClass: "bg-amber-500 text-white",
    gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(245, 158, 11, 0.06) 50%, rgba(245, 158, 11, 0.02) 100%)",
    hoverShadowClass: "shadow-md hover:shadow-2xl hover:shadow-amber-500/30",
    description:
      "Same-day dispatch for orders placed before 2 PM. Real-time SMS tracking updates and safe tamper-evident transit packaging.",
    tags: ["Dhaka: 24h", "Nationwide: 48-72h", "Cash On Delivery"],
  },
  {
    icon: CheckCircle2,
    title: "7-Day Hassle-Free Return",
    badge: "Zero Risk",
    badgeClass: "bg-blue-500/20 text-blue-800 dark:text-blue-300",
    iconBgClass: "bg-blue-500 text-white",
    gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.16) 0%, rgba(59, 130, 246, 0.06) 50%, rgba(59, 130, 246, 0.02) 100%)",
    hoverShadowClass: "shadow-md hover:shadow-2xl hover:shadow-blue-500/30",
    description:
      "Found manufacturing defect or wrong item received? Doorstep reverse pickup arranged within 48 hours without friction.",
    tags: ["Doorstep Pickup", "Instant Replacement", "bKash/Bank Refund"],
  },
  {
    icon: Headphones,
    title: "Dedicated Tech Consultants",
    badge: "Dhaka Team",
    badgeClass: "bg-purple-500/20 text-purple-800 dark:text-purple-300",
    iconBgClass: "bg-purple-500 text-white",
    gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.16) 0%, rgba(168, 85, 247, 0.06) 50%, rgba(168, 85, 247, 0.02) 100%)",
    hoverShadowClass: "shadow-md hover:shadow-2xl hover:shadow-purple-500/30",
    description:
      "Direct phone and WhatsApp technical consultations. We help you choose the right model before purchasing and assist after setup.",
    tags: ["Real Humans", "WhatsApp Direct", "9 AM – 10 PM"],
  },
];

export function TrustGuaranteeCards({ className }: TrustGuaranteeCardsProps) {
  return (
    <section
      aria-label="Authenticity & Service Guarantees"
      className={cn("w-full", className)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {GUARANTEE_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              style={{ background: item.gradient }}
              className={cn(
                "group relative flex items-start gap-4 rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 dark:shadow-black/60",
                item.hoverShadowClass
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-105",
                  item.iconBgClass
                )}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
                      item.badgeClass
                    )}
                  >
                    {item.badge}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-background/80 dark:bg-background/60 px-2 py-0.5 text-[10px] font-medium text-foreground/85 shadow-2xs backdrop-blur-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
