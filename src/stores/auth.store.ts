import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BackendAuthUser, User } from "@/types/auth.types";
import type { Address } from "@/types/order.types";
import { useCartStore } from "./cart.store";
import { useWishlistStore } from "./wishlist.store";

export interface CustomerUser extends User {
  phone: string;
  addresses: Address[];
}

interface AuthState {
  user: CustomerUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: CustomerUser, accessToken: string) => void;
  updateUser: (updates: Partial<CustomerUser>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, updates: Partial<Omit<Address, "id">>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const mapBackendUserToCustomerUser = (
  backendUser: BackendAuthUser,
): CustomerUser => ({
  id: backendUser.id,
  name: backendUser.name,
  email: backendUser.email,
  phone: backendUser.phone ?? "",
  avatar: backendUser.avatar ?? undefined,
  role:
    backendUser.role === "SUPER_ADMIN" ||
    backendUser.role === "ADMIN" ||
    backendUser.role === "admin"
      ? "admin"
      : "user",
  createdAt: backendUser.createdAt,
  updatedAt: backendUser.updatedAt,
  addresses:
    backendUser.addresses?.map((address) => ({
      id: address.id,
      name: backendUser.name,
      phone: backendUser.phone ?? "",
      street: address.street,
      area: address.state ?? address.city,
      city: address.city,
      zone:
        address.city.trim().toLowerCase() === "dhaka"
          ? "inside-dhaka"
          : "outside-dhaka",
      postalCode: address.postalCode ?? "",
      isDefault: address.isDefault,
      label:
        address.title === "Office"
          ? "Office"
          : address.title === "Home" || !address.title
            ? "Home"
            : "Other",
    })) ?? [],
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      addAddress: (newAddr) => {
        const addrWithId: Address = {
          ...newAddr,
          id: `addr-${Date.now()}`,
        };

        set((state) => {
          if (!state.user) return state;
          let updatedAddresses = [...state.user.addresses];
          if (addrWithId.isDefault) {
            updatedAddresses = updatedAddresses.map((a) => ({
              ...a,
              isDefault: false,
            }));
          }
          return {
            user: {
              ...state.user,
              addresses: [addrWithId, ...updatedAddresses],
            },
          };
        });
      },

      updateAddress: (id, updates) => {
        set((state) => {
          if (!state.user) return state;
          let updatedAddresses = state.user.addresses.map((a) =>
            a.id === id ? { ...a, ...updates } : a,
          );
          if (updates.isDefault) {
            updatedAddresses = updatedAddresses.map((a) =>
              a.id === id
                ? { ...a, isDefault: true }
                : { ...a, isDefault: false },
            );
          }
          return {
            user: {
              ...state.user,
              addresses: updatedAddresses,
            },
          };
        });
      },

      deleteAddress: (id) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: state.user.addresses.filter((a) => a.id !== id),
            },
          };
        });
      },

      setDefaultAddress: (id) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: state.user.addresses.map((a) => ({
                ...a,
                isDefault: a.id === id,
              })),
            },
          };
        });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          try {
            // ── Clear ALL persisted Zustand store keys ────────────────────────
            // Add any new store keys here as the app grows.
            const STORAGE_KEYS = [
              "telos-auth-storage",       // auth.store.ts
              "telos-cart-storage",        // cart.store.ts
              "telos-wishlist-storage",    // wishlist.store.ts
              "telos-admin-storage",       // admin.store.ts
              "telos-recently-viewed-storage", // recently-viewed.store.ts
              "paytrack-sidebar",          // sidebar.store.ts
              "telos-theme",              // theme.store.ts
              "theme",                    // next-themes persisted value
            ];
            STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));

            // ── Clear auth cookies ────────────────────────────────────────────
            document.cookie = "accessToken=; path=/; max-age=0";
            document.cookie = "authRole=; path=/; max-age=0";
          } catch {
            // localStorage may be blocked in private/incognito — ignore silently
          }
        }
        useCartStore.getState().clearCart();
        useWishlistStore.getState().clearWishlist();
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "telos-auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);