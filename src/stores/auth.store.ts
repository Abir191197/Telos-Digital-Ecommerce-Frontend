// ── Customer Auth & Account Store (Zustand + Persist) ─────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BackendAuthUser, User } from "@/types/auth.types";
import type { Address, Order } from "@/types/order.types";
import { DEMO_USER, DEMO_ORDERS } from "@/data/mock-user";

export interface CustomerUser extends User {
  phone: string;
  addresses: Address[];
}

interface AuthState {
  user: CustomerUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  orders: Order[];
}

interface AuthActions {
  setAuth: (user: CustomerUser, accessToken: string) => void;
  loginAsDemo: () => void;
  loginWithCredentials: (emailOrPhone: string) => boolean;
  registerCustomer: (name: string, email: string, phone: string) => void;
  updateUser: (updates: Partial<CustomerUser>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, updates: Partial<Omit<Address, "id">>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
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
  role: backendUser.role === "SUPER_ADMIN" ? "admin" : "user",
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
      orders: DEMO_ORDERS,

      // Actions
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      loginAsDemo: () => {
        set({
          user: DEMO_USER,
          accessToken: "demo-jwt-telos-bd-token",
          isAuthenticated: true,
          orders: DEMO_ORDERS,
        });
      },

      loginWithCredentials: (emailOrPhone) => {
        // Mock authentication simulation
        const isPhone =
          emailOrPhone.startsWith("+88") || emailOrPhone.startsWith("01");
        const customUser: CustomerUser = {
          ...DEMO_USER,
          name: isPhone
            ? `Customer (${emailOrPhone.slice(-4)})`
            : emailOrPhone.split("@")[0],
          email: isPhone
            ? `${emailOrPhone.replace(/\D/g, "")}@teloscart.com`
            : emailOrPhone,
          phone: isPhone ? emailOrPhone : DEMO_USER.phone,
        };

        set({
          user: customUser,
          accessToken: "mock-jwt-session-token",
          isAuthenticated: true,
          orders: DEMO_ORDERS,
        });
        return true;
      },

      registerCustomer: (name, email, phone) => {
        const newUser: CustomerUser = {
          id: `usr-${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: "user",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          addresses: [
            {
              id: `addr-${Date.now()}`,
              name: name.trim(),
              phone: phone.trim(),
              street: "House 12, Road 4",
              area: "Gulshan 1",
              city: "Dhaka",
              zone: "inside-dhaka",
              postalCode: "1212",
              isDefault: true,
              label: "Home",
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          user: newUser,
          accessToken: `jwt-user-${Date.now()}`,
          isAuthenticated: true,
          orders: [], // New customer starts with empty order history
        });
      },

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

      addOrder: (newOrder) => {
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
      },

      cancelOrder: (orderId, _reason) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId || o.orderNumber === orderId
              ? { ...o, status: "cancelled" }
              : o,
          ),
        }));
      },

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "telos-auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        orders: state.orders,
      }),
    },
  ),
);
