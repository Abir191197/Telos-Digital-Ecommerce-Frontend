# TELOS CART — Next-Gen Digital & Retail E-Commerce

<div align="center">

![Telos Cart Banner](https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80)

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand_%2B_RTK_Query-brown?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Turbopack](https://img.shields.io/badge/Engine-Turbopack_Ready-000?style=for-the-badge&logo=vercel)](https://turbo.build/pack)

### **The Gold Standard for Premium Consumer Tech & High-Conversion E-Commerce**

*Engineered for speed, built for brand prestige, and tailored for modern commerce.*

[Explore Storefront](http://localhost:3000) • [Live Dashboard](http://localhost:3000/dashboard) • [Architecture Playbook](file:///PROJECT_KNOWLEDGE.md)

</div>

---

## 🌟 Vision & Product Overview

**Telos Cart** is a flagship, enterprise-grade e-commerce application designed to deliver an unmatched digital retail experience. Designed under the design philosophy of **Telos Digital**, the platform blends architectural performance with refined luxury aesthetics—giving modern consumers frictionless buying journeys while arming operators with a command-center administrative suite.

Whether browsing high-end laptops, mobile devices, audio gear, or accessories, Telos Cart turns browsing into conversion through instant state synchronizations, zero layout shifts, and localized checkout mechanics tailored for the Bangladesh (BDT ৳) and global tech market.

---

## 💎 Core Product Capabilities

### 🛒 1. Ultra-Responsive Storefront
- **Instant Search & Discovery**: Centered, zero-friction catalog search with auto-suggest, brand matching, and real-time filtering.
- **Adaptive Single-Row Mobile Navigation**: Space-optimized mobile navbar preserving viewport real estate, backed by a native-app-style bottom navigation dock.
- **Dynamic Mega Menu**: Category browser featuring curated subcategories, brand aisles, and live featured product showcases.
- **Slide-Over Shopping Bag**: Interactive quick-cart with real-time free delivery thresholds (`৳5,000`), coupon application engine (`TELOS10`, `WELCOME500`), and one-tap checkout routes.
- **Rich Media Catalog & Showcase**: High-res product galleries, variant matrices (colors, storage, RAM), verified authenticity guarantees, and genuine warranty badges.

### 🛡️ 2. Enterprise Admin Command Center (`/dashboard`)
- **Executive Sales Analytics**: Real-time revenue analytics, order volume distributions, and gross margin reporting.
- **Inventory & Catalog Control**: Multi-variant SKU governance, real-time stock state monitors, and pricing managers.
- **Order Lifecycle Management**: End-to-end fulfillment tracking with status triggers (*Pending*, *Processing*, *Shipped*, *Delivered*, *Cancelled*).
- **Collapsible Ergonomic Sidebar**: Keyboard-accessible, compact liquid-shadow navigation keeping operator focus clean and uncluttered.

### ⚡ 3. Engineered for Real-World Speed
- **Sub-Second Transitions**: Built on React 19 concurrent features and Next.js 16 Turbopack compiler.
- **Edge Routing & Middleware**: Edge-computed session verification and role-based redirects.
- **Hybrid State Architecture**: Hybrid **Zustand** persistence for zero-flicker client carts alongside **RTK Query** for caching server data.

---

## 📐 Architecture & Tech Matrix

```
TELOS E-COMMERCE STACK
├── Frontend Engine      │ Next.js 16.3 (Turbopack, App Router, SSR + RSC)
├── Core Runtime         │ React 19.2 + TypeScript 6.0
├── Styling Architecture │ Tailwind CSS v4 (Pure PostCSS, CSS variables, dark/light)
├── Motion & Delight     │ Framer Motion 13 + Tailwind Animate
├── Client State         │ Zustand 5 (Persisted cart, wishlist, theme, sidebar)
├── Server API & Cache   │ Redux Toolkit + RTK Query (Modular endpoint injection)
├── Forms & Validation   │ React Hook Form + Zod 3
└── Iconography          │ Lucide React Icons
```

---

## 📂 Project Architecture

```
src/
├── app/                  # Next.js App Router (Public storefront & Admin Dashboard)
│   ├── (public)/         # Consumer storefront, category aisles, auth flows
│   ├── (protected)/      # Admin control center, analytics, order management
│   ├── globals.css       # Tailwind v4 theme tokens & color definitions
│   └── layout.tsx        # Top-level root layout with provider wrapping
│
├── components/           # Domain-driven Component Hierarchy
│   ├── common/           # Atomic UI primitives (Button, Input, Table, Logo, Badges)
│   ├── layouts/          # Header, Footer, AdminSidebar, MobileBottomNav
│   ├── home/             # Storefront sections (Hero, FlashDeals, Categories, Trust)
│   ├── admin/            # Dashboard operational views and KPI metric widgets
│   ├── cart/             # Slide-over cart drawer and line item calculations
│   └── shared/           # Cross-cutting widgets (Breadcrumbs, PageHeader)
│
├── stores/               # Zustand Persistent Client Stores
│   ├── cart.store.ts     # Real-time bag computations, discounts, shipping
│   ├── wishlist.store.ts # Saved customer selections
│   ├── auth.store.ts     # Customer & admin auth sessions
│   └── theme.store.ts    # Dark / light theme system
│
├── constants/            # Centralized Single Source of Truth
│   └── routes.ts         # Strictly-typed application route endpoints
└── lib/                  # Utilities, formatters, and base API clients
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` / `pnpm` / `yarn`

### 2. Clone & Install
```bash
git clone https://github.com/Abir191197/Telos-Digital-Ecommerce-Frontend.git
cd Telos-Digital-Ecommerce-Frontend
npm install
```

### 3. Environment Configuration
Create a `.env.local` file from template:
```bash
cp .env.example .env.local
```

### 4. Launch Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the administrative suite.

### 5. Production Build & Validation
```bash
npm run build
npm run start
```

---

## 🎨 Design Philosophy & Brand Identity

- **The Palette**: Slate/Zinc foundations complemented by warm **Telos Gold** accents (`#f59e0b` / `amber-500`), communicating reliability, technological sophistication, and premium trust.
- **Glassmorphism & Depth**: Multi-tiered backdrop filters (`backdrop-blur-md`) layered over dark/light responsive surfaces.
- **Mobile-First Luxury**: Zero compromise on smaller viewports; desktop parity with touch-optimized ergonomics and safe-area compatibility.

---

## 💼 Commercial & Enterprise Inquiries

Telos Cart is crafted and maintained under the technological umbrella of **Telos Digital**.

- **Organization**: Telos Digital
- **Product**: Telos Cart E-Commerce Suite
- **Lead Developer**: [Abir191197](https://github.com/Abir191197)

---

<div align="center">
  <sub>© 2026 Telos Digital. All rights reserved. Crafted for high-performance commerce.</sub>
</div>
