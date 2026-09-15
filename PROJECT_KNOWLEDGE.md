# Project Knowledge & AI Architecture Playbook

> **ROLE & MINDSET:**
> Act as a **Staff / Senior Frontend Software Engineer with 10+ years of experience**.
> When writing, extending, or refactoring code in this project, use this document as your primary architectural guide. Build clean, modular, scalable, and production-ready code aligned with the established structure below. Be practical, flexible, and maintain high code quality.

---

## 1. Project Tech Stack

- **Framework**: Next.js 16+ (App Router, Turbopack)
- **Language**: TypeScript (clean, strongly typed)
- **Server State & APIs**: **RTK Query** with `baseApi.injectEndpoints()`
- **Client / UI State**: **Zustand** (lightweight stores for UI toggles, modals, sidebar)
- **Styling**: **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **UI Primitives**: Native React + Tailwind CSS in `components/common/`
- **Forms & Validation**: **React Hook Form** + **Zod**
- **Icons**: **Lucide React** (`lucide-react`)

---

## 2. Directory Architecture & Responsibilities

```
src/
├── app/                  # Route URLs & Layouts ONLY (Keep page.tsx thin & clean)
│   ├── (public)/         # Public marketing pages & auth flows
│   │   ├── (auth)/       # Nested auth: /login, /register, /forgot-password, /reset-password
│   │   ├── layout.tsx    # Shared Public shell (Header + Footer)
│   │   └── page.tsx      # Public landing page (/)
│   ├── (protected)/      # Authenticated app: /dashboard, /payments, /clients, /tracking, etc.
│   │   └── layout.tsx    # Protected shell (Collapsible Sidebar + Header)
│   ├── globals.css       # Tailwind v4 import & theme variables
│   └── layout.tsx        # Root HTML layout with providers
│
├── components/           # UI Components Organized by Domain & Lifetime
│   ├── common/           # Atomic UI primitives (Button, Input, Table, ProductCard, Logo)
│   ├── layouts/          # Shell layout components (Header, Footer, Sidebar, MobileBottomNav)
│   ├── shared/           # True multi-page reusable widgets ONLY (PageHeader, SectionTitle, Breadcrumbs)
│   ├── home/             # Dedicated home page sections (HeroBanner, QuickCategoryBar, FlashDealsSection, etc.)
│   └── <page-or-domain>/ # ANY dedicated page components MUST live in their own dedicated folder (e.g., categories/, product-detail/)
│
├── features/             # Feature-Driven Business Modules (THE REAL UI & LOGIC)
│   ├── auth/             # Auth forms, cards, and session hooks
│   ├── clients/          # Client tables, client cards, client modals
│   ├── payments/         # Payment tables, invoice forms, calculation hooks
│   ├── reports/          # Analytics tables, chart widgets, filter bars
│   └── tracking/         # Booking/time tracking cards and widgets
│
├── services/             # Server State & API Layer (RTK QUERY)
│   └── api/              # Domain-scoped endpoint definitions
│       ├── auth/         # authEndpoints.ts
│       ├── clients/      # clientEndpoints.ts
│       └── payments/     # paymentEndpoints.ts
│
├── stores/               # Client UI State (ZUSTAND)
│   ├── auth.store.ts     # Current user, access token storage
│   ├── modal.store.ts    # Global modal open/close states
│   └── sidebar.store.ts  # Sidebar collapsed/expanded state
│
├── validations/          # Zod Validation Schemas
│   ├── auth.schema.ts    # Login, registration, password validation
│   └── payment.schema.ts # Payment & invoice creation validation
│
├── constants/            # Central Constants (Single Source of Truth)
│   ├── routes.ts         # ROUTES object (URL paths)
│   └── app.ts            # App metadata, default pagination, storage keys
│
├── lib/                  # Utilities & Base Setup
│   ├── rtk-query/        # baseApi.ts (RTK Query root)
│   ├── store.ts          # Redux Toolkit store (hosts RTK Query reducer/middleware)
│   └── utils.ts          # Tailwind merge helper (`cn`)
│
├── providers/            # Top-level Application Providers
│   ├── QueryProvider.tsx # Wraps Redux store for RTK Query
│   └── ThemeProvider.tsx # Dark/light theme provider
│
└── middleware.ts         # Edge Route Protection & Auth Redirects
```

---

## 3. "Where Do I Put Code?" — Action Guide

Use this quick-reference table whenever adding new functionality:

| Task                      | Where to Put It                                      | Implementation Guidelines                                                                                                                       |
| ------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Add a Table**           | `src/features/<domain>/components/<Domain>Table.tsx` | Import `<Table>`, `<TableHeader>`, `<TableRow>`, etc. from `@/components/common`. Style rows cleanly with Tailwind.                             |
| **New API Endpoint**      | `src/services/api/<domain>/<domain>Endpoints.ts`     | Inject into `baseApi` using `baseApi.injectEndpoints({ ... })`. Export generated hooks (e.g. `useGet...Query`).                                 |
| **New Page / Route**      | `src/app/(public)/...` or `src/app/(protected)/...`  | Create `page.tsx`. Keep it concise: set metadata, import `<PageHeader>`, and render the feature components.                                     |
| **New Popup / Modal**     | `src/features/<domain>/components/<Domain>Modal.tsx` | Control open/close state via `src/stores/modal.store.ts` or local state if single-use.                                                          |
| **New Form**              | `src/features/<domain>/components/<Domain>Form.tsx`  | Use `react-hook-form` connected with a Zod schema from `src/validations/`.                                                                      |
| **Client UI State**       | `src/stores/<name>.store.ts`                         | Use Zustand `create()`. Good for sidebars, active filters, open dialogs, and theme state.                                                       |
| **New Atomic UI Element** | `src/components/common/`                             | Build reusable elements (e.g., Badge, Modal shell, Dropdown) using pure React + Tailwind (no Radix UI). Export in `components/common/index.ts`. |
| **Dedicated Page Component** | `src/components/<page-name>/` (e.g. `components/home/`, `components/categories/`) | **NEVER dump dedicated page sections into `components/shared/`**. Create a dedicated subfolder matching the page name with its own `index.ts`. Only place elements in `components/shared/` if used on 2+ independent pages. |
| **Route Links & URLs**    | `src/constants/routes.ts`                            | Always use `ROUTES.<PATH>` instead of hardcoding raw strings.                                                                                   |
| **Global Styles**         | `src/app/globals.css`                                | Update CSS variables or theme tokens.                                                                                                           |

---

## 4. Key Implementation Patterns

### A. Reusable Table (`components/common/Table.tsx`)

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/common";

export function PaymentsTable({ data }: { data: PaymentItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.invoiceNo}</TableCell>
            <TableCell>{item.clientName}</TableCell>
            <TableCell>${item.amount.toLocaleString()}</TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### B. Clean Route Page (`app/.../page.tsx`)

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { PaymentsTable } from "@/features/payments/components/PaymentsTable";

export const metadata: Metadata = {
  title: "Payments",
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Payments"
        description="Track all incoming invoices and payment milestones."
      />
      <PaymentsTable data={[]} />
    </div>
  );
}
```

### C. RTK Query API Injection (`services/api/`)

```typescript
import { baseApi } from "@/lib/rtk-query/baseApi";
import type { Payment } from "./payment.types";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<Payment[], void>({
      query: () => "/payments",
      providesTags: ["Payments"],
    }),
    createPayment: builder.mutation<Payment, Partial<Payment>>({
      query: (body) => ({
        url: "/payments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

export const { useGetPaymentsQuery, useCreatePaymentMutation } = paymentApi;
```

### D. Zustand Client Store (`stores/`)

```typescript
import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (isCollapsed) => set({ isCollapsed }),
}));
```

---

---

## 6. Admin Catalog & Responsive Mobile/Desktop Design Patterns

When building or extending Admin interfaces (such as `/dashboard/products`):

### A. Responsive Viewport Strategy (Desktop vs. Mobile)
- **Desktop (≥ 1024px / `lg:`)**:
  - Sticky control dock (`sticky top-16 z-20`) combining Search, custom thematic dropdown cards, bulk actions, and view switchers (`Table` vs `Cards`).
  - Table view displays detailed columnar data; Stock column is strictly numerical badge indicators (`in stock`, `Low`, `Out`), avoiding noisy steppers.
  - Action column utilizes a desktop 3-dot dropdown menu (`MoreVertical`).
  - KPI cards follow standard metrics layout: Title & Icon on top, hero count in middle, change badge and timeframe at bottom.
- **Mobile (< 768px / `md:hidden`)**:
  - **Sticky Search Layer**: Pinned directly beneath the top navigation (`sticky top-16 z-25`) immediately available upon landing without initial scrolling.
  - **Single View Mode**: Mobile is strictly ergonomic cards; view mode switchers are hidden.
  - **Number-First KPI Cards**: 2x2 grid displaying large hero values and change chips on top, with full un-truncated titles and watermark icons in the bottom-right corner.
  - **Horizontal Ergonomic Cards**: Square thumbnail (`80x80`) with stock ribbon overlay, uppercase brand & SKU row, clamped title, price with discount strikethrough, and **stock health badge stacked directly beneath the price**.
  - **Manage Product Button**: Direct full-width button opening a dedicated `z-[9999]` mobile manager bottom sheet/modal.

### B. Thematic Luxury Dropdown Cards (Never OS `<select>`)
- Avoid raw browser OS `<select>` elements which render inconsistent native blue pickers.
- Use custom popover trigger cards (`data-thematic-dropdown`) with active state amber borders, rotating chevron indicators, and glassmorphic popover menus (`bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl`).
- Maintain global outside-click listener to dismiss menus cleanly.

### C. Modal Stacking & Full-Screen Takeovers (`z-[9999]`)
- Mobile filters and mobile product management modals must overlay with `z-[9999]` (above both the `z-50` bottom navigation and `z-30` admin header) to completely obscure navigation bars and avoid modal content being cut off.

### D. Mobile Floating Action Pills
- Bulk actions on mobile are triggered via product checkboxes and render as a borderless, floating glassy pill (`fixed bottom-20 inset-x-3.5 z-40 bg-zinc-950/75 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-full shadow-2xl border-none`).
- Floating pill docks safely above the bottom nav (`bottom-20`) containing selected item count, `Cancel` action, and destructive confirmation trigger.

---

## 7. Guidelines for AI Sessions

1. **Check Existing Components First**: Before building new primitives, check `src/components/common/` to reuse existing components (`Button`, `Input`, `Table`, `Loader`, `EmptyState`).
2. **Keep UI Primitives Clean**: Build UI components using native React + Tailwind CSS.
3. **Keep `page.tsx` Focused**: Place business logic, state handling, and detailed layouts inside `features/<domain>/` or domain components, and keep route `page.tsx` as lightweight containers.
4. **Centralize Routes**: Always reference `ROUTES` from `@/constants`.
5. **Always Verify**: Ensure all TypeScript types and builds pass (`npx tsc --noEmit` or `npm run build`) without errors.
6. **Maintain this Document**: If you create a new root folder, feature module, or architectural pattern, update this file so future AI sessions stay synchronized.
