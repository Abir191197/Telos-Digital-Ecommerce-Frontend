// ── Public Website Layout ──────────────────────────────
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { MobileBottomNav } from "@/components/layouts/MobileBottomNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
