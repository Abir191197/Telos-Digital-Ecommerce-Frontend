import Link from "next/link";
import { ROUTES } from "@/constants";
import { Home, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[78vh] flex items-center justify-center px-4 py-16 overflow-hidden selection:bg-amber-500 selection:text-zinc-950">
      {/* Subtle Minimal Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-500/10 dark:bg-amber-500/15 blur-[120px] rounded-full -z-10"
      />

      <div className="w-full max-w-lg mx-auto text-center space-y-6">
        {/* Highlighted Bold 404 Visual Stamp */}
        <div className="relative flex items-center justify-center select-none">
          <span className="font-black text-8xl sm:text-[140px] tracking-tighter leading-none bg-gradient-to-b from-foreground via-foreground/75 to-foreground/20 bg-clip-text text-transparent drop-shadow-xs">
            404
          </span>
          <span className="absolute -bottom-1 sm:bottom-0 rounded-full bg-amber-500 text-zinc-950 px-3.5 py-1 text-[11px] sm:text-xs font-black uppercase tracking-widest shadow-md shadow-amber-500/30">
            Page Not Found
          </span>
        </div>

        {/* Crisp Minimal Text */}
        <div className="space-y-2 pt-2">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Lost in digital space?
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            The page or product you are looking for has been moved, removed, or never existed in our catalog.
          </p>
        </div>

        {/* Clean Balanced Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Browse Products</span>
          </Link>
        </div>

        {/* Minimal Sub-Help Link */}
        <div className="pt-4 text-xs text-muted-foreground">
          Need quick assistance?{" "}
          <Link
            href={ROUTES.CONTACT}
            className="font-bold text-foreground hover:text-amber-500 underline underline-offset-4 transition-colors"
          >
            Contact Support Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
