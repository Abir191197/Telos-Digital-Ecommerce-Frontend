import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { MobileBottomNav } from "@/components/layouts/MobileBottomNav";
import { CartDrawer } from "@/components/cart";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0 bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
    </div>
  );
}
