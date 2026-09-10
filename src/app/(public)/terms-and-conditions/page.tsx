import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldAlert, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions | Telos Cart Bangladesh",
  description: "Terms and conditions governing purchases, deliveries, returns, and warranties on Telos Cart.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="border-b border-border/60 bg-muted/20 py-12">
        <div className="container px-4 sm:px-6 max-w-4xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
            <FileText className="h-3.5 w-3.5" />
            <span>Storefront Guidelines</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground">
            Please read these terms carefully before placing an order on Telos Cart.
          </p>
        </div>
      </div>

      <div className="container px-4 sm:px-6 max-w-4xl mx-auto py-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Agreement to Terms</h2>
          <p>
            By accessing Telos Cart or completing a purchase via cash on delivery or digital payment, you agree to comply with these terms, our return policy, and all relevant trade regulations of the People’s Republic of Bangladesh.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Orders & Pricing Accuracy</h2>
          <p>
            All product prices are listed in Bangladeshi Taka (BDT) and include applicable taxes unless specified otherwise. We reserve the right to cancel or adjust orders in the event of genuine typographical errors or sudden stock unavailability from brand suppliers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Shipping & Delivery Timelines</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-foreground">Dhaka City:</strong> 24 to 48 working hours.</li>
            <li><strong className="text-foreground">Outside Dhaka (Nationwide):</strong> 48 to 72 working hours via verified logistics networks.</li>
            <li>Customers are encouraged to inspect outer packaging for damage before receiving and signing the delivery confirmation.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. 7-Day Return & Replacement Policy</h2>
          <p>
            You may initiate a return or replacement within 7 calendar days of receipt if:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The item is physically damaged upon unboxing (video proof recommended).</li>
            <li>The model, color, or technical specification differs from what was ordered.</li>
            <li>The device possesses a factory hardware defect covered under manufacturer warranty.</li>
          </ul>
          <p className="pt-1">
            Items must be returned with original brand packaging, warranty seals, and accessories intact.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Official Warranty & Servicing</h2>
          <p>
            Warranty claims for electronics and digital devices are serviced either directly through authorized brand service centers in Bangladesh or via Telos Cart customer concierge.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">6. Need Help?</h2>
          <p>
            For any clarifications regarding warranty claims, order status, or returns, please consult our{" "}
            <Link href={ROUTES.CONTACT} className="text-amber-500 underline font-medium">Customer Care team</Link> or check your{" "}
            <Link href={ROUTES.TRACK_ORDER} className="text-amber-500 underline font-medium">Live Order Tracking</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
