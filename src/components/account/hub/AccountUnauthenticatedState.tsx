import React from "react";
import Link from "next/link";
import { User, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants";

export function AccountUnauthenticatedState() {
  return (
    <div className="container max-w-lg mx-auto py-16 text-center space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 mx-auto">
        <User className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-foreground">
        Sign In to View Your Account
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
        Please sign in to track live Bangladesh courier shipments, review your
        purchase history, and manage addresses.
      </p>
      <div className="pt-2">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 px-6 py-3 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <span>Sign In to Your Account</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
