"use client";

// ── RTK Query Provider ─────────────────────────────────
import { Provider } from "react-redux";
import { store } from "@/lib/rtk-query/store";
import { CartWishlistSync } from "@/components/common/CartWishlistSync";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <Provider store={store}>
      <CartWishlistSync />
      {children}
    </Provider>
  );
}
