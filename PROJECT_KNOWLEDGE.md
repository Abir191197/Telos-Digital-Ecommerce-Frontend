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
- **Mobile KPI Cards Horizontal Swipe Carousel**:
  - Instead of multi-column grid squeezing cards or 1-column consuming ~500px vertical space, mobile renders KPI cards in a sleek horizontal swipe carousel (`flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4`).
  - Card width on mobile: `shrink-0 w-[68vw] max-w-[260px] snap-start sm:w-auto sm:max-w-none`. Second card peeks in by ~25%, signaling swipeability.
  - Zero text wrapping or badge clipping; saves over 400px of vertical space so products and orders stay visible above the fold.
  - Applied uniformly across [AdminProductsView.tsx](file:///d:/2026-%20PROJECTS/TELOS%20ECOMMERCE/src/components/admin/AdminProductsView.tsx), [AdminOrdersView.tsx](file:///d:/2026-%20PROJECTS/TELOS%20ECOMMERCE/src/components/admin/AdminOrdersView.tsx), and [AdminPendingDispatchView.tsx](file:///d:/2026-%20PROJECTS/TELOS%20ECOMMERCE/src/components/admin/AdminPendingDispatchView.tsx).

- **Mobile Viewport Full-Bleed Search & Sticky Dock**:
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

### E. Universal Reusable Confirmation & Creation Modal Pattern
- **Component Location**: [`src/components/common/ConfirmationModal.tsx`](file:///c:/Telos%20Digital/Telos%20Digital%20Ecommerce%20Frontend/src/components/common/ConfirmationModal.tsx) (also exported via `@/components/common` and backward-compatible alias `ProductConfirmDialog` in `@/components/admin/products/ProductConfirmDialog`).
- **Core Purpose**: Standardize all confirmation, deletion, and post-creation success dialogues with uniform high-end glassmorphic styling, avoiding fragmented custom modal designs.
- **Design Specifications**:
  - **Backdrop**: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200`.
  - **Card Container**: `w-full max-w-md rounded-2xl sm:rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200`.
  - **Variants**:
    - `danger`: Destructive actions (Delete Category, Delete Product, Delete Brand). Displays `AlertOctagon` in `bg-rose-500/15 text-rose-600 border-rose-500/20` with a solid rose confirm button.
    - `success`: Creation / Update success announcements (Category Created, Product Saved). Displays `CheckCircle2` in `bg-emerald-500/15 text-emerald-600 border-emerald-500/20` with a solid emerald primary button.
    - `warning`: Cautionary triggers. Displays `AlertTriangle` in amber.
    - `primary`: Standard informational confirmations with amber/zinc buttons.
  - **Actions & Navigation**:
    - Configurable `confirmLabel` and `cancelLabel`.
    - Optional `hideCancel` for purely informative confirmation modals.
    - Custom `onConfirm` and `onCancel` callbacks.
- **Form Reset Rule on Creation**:
  - Whenever an entity is successfully published/created (e.g. `CreateCategoryView`), all form inputs, subcategory arrays, banner states, and file buffers **must be reset/deleted** immediately upon mutation resolution (`unwrap()`), ensuring a clean slate before presenting the success modal with "Create Another" and "View List" actions.

### F. Universal Reusable Centered Loading Pattern (`PageLoader` & `Loader`)
- **Component Location**: [`src/components/common/Loader.tsx`](file:///c:/Telos%20Digital/Telos%20Digital%20Ecommerce%20Frontend/src/components/common/Loader.tsx) (exported as `Loader`, `PageLoader`, and `type LoaderProps` from `@/components/common`).
- **Core Rule**: **Never use unstyled or plain text loading indicators** (e.g., `<div className="p-10">Loading...</div>`). All page and view loading states must occupy the **vertical and horizontal center** of the viewport with a high-end luxury animated spinner.
- **Design Specifications**:
  - **Centered Viewport (`variant="page"` / `PageLoader`)**: Takes `min-h-[60vh]` with vertical and horizontal centering.
  - **Ambient Glow Ring**: Pulsating outer halo (`bg-amber-500/20 blur-xl animate-pulse`) behind a rotating dual-color gradient border spinner.
  - **Centered Icon**: Inner brand badge with rotating `Loader2` indicator.
  - **Structured Hierarchy**: Optional pill badge (`badgeText`), bold title (`title`), and helpful status subtitle (`description`).
  - **Card Container (`variant="card"`)**: Takes `min-h-[360px]` with `rounded-3xl border border-border/70 bg-card/60 backdrop-blur-md` for sub-sections or tables.
  - **Inline (`variant="inline"`)**: Ultra-compact spinner for buttons and interactive badges.
- **How to Use**:
  ```tsx
  import { PageLoader } from "@/components/common";

  // In page views (e.g., AdminCategoriesListView, CreateCategoryView):
  if (isLoading) {
    return (
      <PageLoader
        title="Loading Categories..."
        description="Fetching the latest category taxonomies, icons, and hierarchy settings."
        badgeText="Admin Catalog"
      />
    );
  }
  ```
- **Next.js Route Loaders (`loading.tsx`)**:
  - Place `loading.tsx` in route folders (e.g., `src/app/(protected)/dashboard/categories/loading.tsx`) returning `<PageLoader ... />` for instant streaming transitions.

### G. Universal Category Icon Contract & Normalization System
- **Core Utility Location**: [`src/components/categories/categoryConfig.ts`](file:///c:/Telos%20Digital/Telos%20Digital%20Ecommerce%20Frontend/src/components/categories/categoryConfig.ts) (exported as `CATEGORY_ICON_MAP`, `getCategoryIcon`, `normalizeCategoryIconName`).
- **Core Problem Solved**: The backend stores category icons as string identifiers (e.g., `"Smartphone"`, `"Laptop"`, `"Gamepad2"`), but responses may contain varied casing (`"smartphone"`), kebab-case (`"gamepad-2"`, `"shield-check"`), or category slugs (`"smartphones-tablets"`). In the past, fragmented dictionaries and direct dictionary lookups (`CATEGORY_ICON_MAP[category.icon]`) failed on casing differences or unrecognized keys, causing icons to disappear or fallback unpredictably.
- **Architectural Rules**:
  1. **Canonical Key Registry (`CATEGORY_ICON_MAP`)**: Central registry in `categoryConfig.ts` mapped to official Lucide React components, including `LayoutGrid` as safe fallback.
  2. **Alias & Slug Normalization (`normalizeCategoryIconName`)**:
     - Strips hyphens, underscores, spaces, and normalizes casing.
     - Resolves semantic aliases (e.g., `"audio"` -> `"Headphones"`, `"gaming"` -> `"Gamepad2"`, `"shoes"` -> `"Footprints"`, `"jewelry"` -> `"Gem"`, `"smartphones-tablets"` -> `"Smartphone"`).
     - Returns verified canonical key string, with `"LayoutGrid"` fallback.
  3. **Safe Component Resolution (`getCategoryIcon`)**:
     - Always returns a valid React component: `getCategoryIcon(category.icon)`.
     - Guaranteed never to return `undefined` or crash during render.
  4. **API Boundary Ingestion (`categoryApi.ts`)**:
     - Incoming backend data in `normalizeCategory` passes `category.icon` through `normalizeCategoryIconName` so all queries receive clean canonical keys.
     - Outgoing creation and update mutations normalize the icon before appending to `FormData`.
  5. **Admin Form & Edit Modal**:
     - In `CategoryPropertiesFormCard.tsx` and `CategoryEditModal.tsx`, active icon detection uses `normalizeCategoryIconName(values.icon) === normalizeCategoryIconName(name)`.
     - Shows a live badge preview with the selected icon next to the picker.
  6. **Re-export Compatibility**:
     - `megaMenuConfig.ts` re-exports `CATEGORY_ICON_MAP`, `getCategoryIcon`, and `normalizeCategoryIconName` from `categoryConfig.ts` to maintain single-source-of-truth without breaking external imports.

---

## 7. Guidelines for AI Sessions

1. **Check Existing Components First**: Before building new primitives, check `src/components/common/` to reuse existing components (`Button`, `Input`, `Table`, `Loader`, `EmptyState`).
2. **Keep UI Primitives Clean**: Build UI components using native React + Tailwind CSS.
3. **Keep `page.tsx` Focused**: Place business logic, state handling, and detailed layouts inside `features/<domain>/` or domain components, and keep route `page.tsx` as lightweight containers.
4. **Centralize Routes**: Always reference `ROUTES` from `@/constants`.
5. **Always Verify**: Ensure all TypeScript types and builds pass (`npx tsc --noEmit` or `npm run build`) without errors.
6. **Maintain this Document**: If you create a new root folder, feature module, or architectural pattern, update this file so future AI sessions stay synchronized.
