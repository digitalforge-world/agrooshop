# Implementation Plan - Agroshop Nuxt 4 Frontend V2

Build a state-of-the-art, high-converting, green-themed e-commerce web application for **Agroshop** in `c:\composer\agroshop\front-end`. The frontend seamlessly connects to the Laravel API backend (`c:\composer\agroshop\api`) and supports the dual universe concept (**AgroDop / Produits Agricoles** & **Quincaillerie / Outillage**).

## User Review Required

> [!IMPORTANT]
> **Key Architectural Choices**:
> 1. **Styling & UI**: Tailwind CSS v3/v4 with custom Agroshop tokens (Emerald `#059669`, Forest `#064E3B`, Lime Accent `#84CC16`, Golden Amber `#F59E0B`).
> 2. **State Management**: Pinia with `pinia-plugin-persistedstate` to persist cart items and user preferences locally.
> 3. **Dual Universe UX**: Top toggle allowing instant switching between **AgroDop (Agriculture)** and **Quincaillerie (Hardware)** views.
> 4. **Zero-Friction Checkout**: Direct WhatsApp 1-click ordering + Quick checkout (No complex registration required).

---

## Proposed Changes

### 1. Configuration & Dependencies

#### [MODIFY] [package.json](file:///c:/composer/agroshop/front-end/package.json)
- Add Tailwind CSS, Pinia, Lucide / Heroicons, and VueUse dependencies.

#### [MODIFY] [nuxt.config.ts](file:///c:/composer/agroshop/front-end/nuxt.config.ts)
- Configure Tailwind CSS module, Pinia, VueUse, runtime API URL, and Google Fonts (Inter + Plus Jakarta Sans).

---

### 2. Design System & Assets

#### [NEW] [main.css](file:///c:/composer/agroshop/front-end/app/assets/css/main.css)
- Define custom CSS variables, Tailwind directives, glassmorphism utilities, smooth transitions, and custom scrollbars.

---

### 3. State Management (Pinia Stores)

#### [NEW] [cart.ts](file:///c:/composer/agroshop/front-end/app/stores/cart.ts)
- Manage cart items, quantities, totals, shipping calculations, and persistent localStorage sync.

#### [NEW] [catalog.ts](file:///c:/composer/agroshop/front-end/app/stores/catalog.ts)
- Manage active category filters, active universe (`agrodop` vs `quincaillerie`), search query, and sorting state.

---

### 4. Reusable UI Components

#### [NEW] [AppNavbar.vue](file:///c:/composer/agroshop/front-end/app/components/AppNavbar.vue)
- Sticky top navigation with Dual Universe toggle (`🌾 AgroDop` / `🛠️ Quincaillerie`), live search, category menu, and animated cart trigger.

#### [NEW] [CartSidebar.vue](file:///c:/composer/agroshop/front-end/app/components/CartSidebar.vue)
- Slide-in cart panel with item quantity controls, price breakdown, and checkout CTA.

#### [NEW] [ProductCard.vue](file:///c:/composer/agroshop/front-end/app/components/ProductCard.vue)
- Card component with stock badge, hover lift effect, 1-click add to cart, and 1-click WhatsApp order.

#### [NEW] [FertilizerCalculator.vue](file:///c:/composer/agroshop/front-end/app/components/FertilizerCalculator.vue)
- Interactive dosage calculator (Crop + Surface area -> Recommended bags of Urea & NPK -> 1-click add to cart).

#### [NEW] [AppFooter.vue](file:///c:/composer/agroshop/front-end/app/components/AppFooter.vue)
- 4-column footer with contact info, WhatsApp direct button, category links, and payment badges.

---

### 5. Layouts & Pages

#### [NEW] [default.vue](file:///c:/composer/agroshop/front-end/app/layouts/default.vue)
- Global layout embedding `AppNavbar`, `CartSidebar`, Toast notifications, Floating WhatsApp button, and `AppFooter`.

#### [MODIFY] [index.vue](file:///c:/composer/agroshop/front-end/app/pages/index.vue)
- High-converting Homepage containing Hero Banner, Trust Strip, Category Grid, Featured Products, Quincaillerie Spotlight, Fertilizer Calculator, Blog Preview, Testimonials, and Lead Capture.

#### [NEW] [index.vue (produits)](file:///c:/composer/agroshop/front-end/app/pages/produits/index.vue)
- Product catalogue page with side filters (categories, price range, stock), search, sorting, and grid/list view.

#### [NEW] [[slug].vue (produits)](file:///c:/composer/agroshop/front-end/app/pages/produits/[slug].vue)
- Comprehensive product details page with image gallery, technical specs, PDF datasheets download, usage instructions, dosage recommendations, and related products.

#### [NEW] [agrodop.vue](file:///c:/composer/agroshop/front-end/app/pages/agrodop.vue)
- Dedicated hub page for Agricultural products (Intrants, Phytosanitaires, Semences, Irrigation).

#### [NEW] [quincaillerie.vue](file:///c:/composer/agroshop/front-end/app/pages/quincaillerie.vue)
- Dedicated hub page for Hardware & Construction products (Outillage, Brouettes, Matériel).

#### [NEW] [checkout.vue](file:///c:/composer/agroshop/front-end/app/pages/checkout.vue)
- Streamlined 2-step checkout page (Customer Details & Delivery -> Payment mode selection: Mobile Money T-Money/Flooz or Cash on Delivery).

#### [NEW] [suivi.vue](file:///c:/composer/agroshop/front-end/app/pages/commande/suivi.vue)
- Order tracking page by reference code (calls GET `/api/commandes/suivi/{reference}`).

---

## Verification Plan

### Automated / Build Tests
- Install dependencies and verify compilation:
  `npm install`
  `npm run build`
- Run local dev server:
  `npm run dev`

### Manual Verification
- Test Dual Universe toggle between AgroDop and Quincaillerie.
- Test adding items to cart and verifying Pinia persistence across page reloads.
- Test live product filtering and search against local Laravel API (`http://localhost:8000/api`).
- Test interactive Fertilizer Calculator calculations.
- Test order tracking with reference code `CMD-2026-0001`.
