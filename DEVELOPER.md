# Yíká Frontend — Developer Documentation

> **Last updated:** June 2026
> Intended audience: engineers onboarding to this codebase.

---

## Table of Contents

1. [What is Yíká?](#1-what-is-yíká)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Directory Structure](#4-directory-structure)
5. [Routing Map](#5-routing-map)
6. [Authentication](#6-authentication)
7. [Architecture Patterns](#7-architecture-patterns)
8. [API Layer](#8-api-layer)
9. [Key Components](#9-key-components)
10. [State Management & Hooks](#10-state-management--hooks)
11. [Styling System](#11-styling-system)
12. [What Is Real vs. Hardcoded](#12-what-is-real-vs-hardcoded)
13. [Known Issues & Tech Debt](#13-known-issues--tech-debt)
14. [Future Integration Points](#14-future-integration-points)

---

## 1. What is Yíká?

Yíká is a **fashion rental marketplace** that connects:

- **Shoppers** — browse, filter, favorite, and rent clothing/accessories from brands and individuals.
- **Merchants** — list their clothing items for rent, manage active/past listings, view incoming rental requests, and track earnings.

The platform supports both P2P (peer-to-peer) and B2C (brand-to-consumer) rental models.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| React | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Auth.js v5 (next-auth@beta) |
| Icons | `lucide-react`, `react-icons` |
| Date UI | `react-day-picker` v9, `date-fns` |
| Backend | AWS API Gateway (REST) |
| Font | Satoshi (Fontshare CDN) + several Google Fonts |
| Compiler | React Compiler (experimental) |

---

## 3. Getting Started

### Prerequisites

- Node.js ≥ 20
- npm (or your preferred package manager)

### Install & Run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file in the project root with these values:

```bash
# ── Inventory API ──────────────────────────────────────────────────────────────
API_URL=https://g7qqps0db4.execute-api.us-east-1.amazonaws.com/Prod

# ── Auth API ───────────────────────────────────────────────────────────────────
AUTH_API_URL=https://62ytj3dj95.execute-api.us-east-1.amazonaws.com/Prod

# ── Auth.js ────────────────────────────────────────────────────────────────────
# Encrypts the session cookie. Must be at least 32 chars.
# Generate a new one with: openssl rand -base64 32
AUTH_SECRET=<generate-a-secret>

# ── Development only ───────────────────────────────────────────────────────────
# Set to true to bypass login requirements during local development.
# Must use NEXT_PUBLIC_ prefix — the proxy (middleware) runs on the Edge
# Runtime, which can only read NEXT_PUBLIC_* variables.
# REMOVE before deploying to production.
NEXT_PUBLIC_DEV_SKIP_AUTH=true
```

**Important notes on env vars:**
- `API_URL` and `AUTH_API_URL` are **server-side only** — never exposed to the browser.
- `AUTH_SECRET` is server-side only — never prefix it with `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_DEV_SKIP_AUTH` intentionally uses the `NEXT_PUBLIC_` prefix so it is readable in the Edge Runtime proxy. It is not a secret — it is a dev convenience toggle.
- After changing any env var, **restart the dev server** — `.env.local` is only read on startup.

---

## 4. Directory Structure

```
yika-frontend/
├── public/                       # Static assets (images, icons, logos, SVGs)
│   └── assets/
│       ├── icons/
│       ├── images/
│       ├── logos/
│       └── dashboard/
├── src/
│   ├── auth.ts                   # Auth.js v5 config (providers, callbacks, session shape)
│   ├── proxy.ts                  # Next.js 16 proxy (route protection, replaces middleware.ts)
│   ├── app/
│   │   ├── (shop)/               # Route group: shop landing (URL: /)
│   │   │   └── page.tsx
│   │   ├── about/page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts   # Auth.js catch-all handler
│   │   │   │   └── register/route.ts        # POST /api/auth/register proxy
│   │   │   └── inventory/
│   │   │       ├── route.ts                 # GET /api/inventory
│   │   │       ├── [id]/route.ts            # GET /api/inventory/:id
│   │   │       ├── brands/route.ts
│   │   │       ├── categories/route.ts
│   │   │       └── occasions/route.ts
│   │   ├── auth/
│   │   │   ├── error/page.tsx               # Auth error display
│   │   │   ├── login/page.tsx               # Login form
│   │   │   └── register/page.tsx            # Registration (two-step: role → details)
│   │   ├── cart/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── data-privacy/page.tsx
│   │   ├── favourites/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── product/[id]/page.tsx            # Product detail page
│   │   ├── profile/                         # User dashboard (protected)
│   │   │   ├── layout.tsx                   # Profile photo, name, mode switcher
│   │   │   ├── page.tsx                     # Redirects → /profile/shopper/orders
│   │   │   ├── merchant/
│   │   │   │   ├── layout.tsx               # Merchant tab bar
│   │   │   │   ├── active-listings/page.tsx
│   │   │   │   ├── add-listing/page.tsx
│   │   │   │   ├── earnings/page.tsx
│   │   │   │   ├── edit-listing/page.tsx
│   │   │   │   ├── past-listings/page.tsx
│   │   │   │   └── rentals/page.tsx
│   │   │   └── shopper/
│   │   │       ├── layout.tsx               # Shopper tab bar
│   │   │       ├── orders/
│   │   │       │   ├── page.tsx             # Orders list
│   │   │       │   └── [orderId]/page.tsx   # Order detail + tracking
│   │   │       ├── payment/page.tsx
│   │   │       └── settings/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx                       # Root layout (SessionProvider, Navbar, Footer)
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── ListingCards.tsx
│   │   │   ├── OrderCard.tsx
│   │   │   ├── RentalRequest.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── listing-shared.tsx
│   │   │   ├── modes.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── icons/
│   │   ├── filters/
│   │   │   ├── FilterSidebar.tsx
│   │   │   └── FilterButton.tsx
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ShopExpHeading.tsx
│   │   │   ├── ShopHeroBanner.tsx
│   │   │   └── ShopSection.tsx
│   │   ├── ui/                              # shadcn/ui base components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── popover.tsx
│   │   │   └── select.tsx
│   │   ├── dropdown-navbar.tsx
│   │   ├── footer.tsx
│   │   └── navbar.tsx
│   └── lib/
│       ├── api/
│       │   ├── inventory.tsx                # API client + normalizeItem()
│       │   └── types.ts                     # TypeScript types for all data models
│       ├── auth/
│       │   └── types.ts                     # Auth.js session/JWT type augmentation
│       ├── data/
│       │   └── sample-data.ts               # Hardcoded fixture data for dashboard UI
│       ├── hooks/
│       │   └── useLikedItems.ts             # localStorage-based favorites hook
│       └── utils.ts                         # cn() + filter/sort logic
```

---

## 5. Routing Map

### Public Routes

| URL | Page | Notes |
|---|---|---|
| `/` | Shop landing | Product grid with filters |
| `/about` | About | Static marketing page |
| `/how-it-works` | How It Works | Static marketing page |
| `/contact` | Contact | Placeholder |
| `/product/:id` | Product Detail | Rental date picker, image carousel, sizes |
| `/privacy-policy` | Privacy Policy | Stub page |
| `/data-privacy` | Data Privacy | Stub page |
| `/terms` | Terms | Stub page |

### Auth Routes (guest only — redirect to profile if logged in)

| URL | Page | Notes |
|---|---|---|
| `/auth/login` | Login | Username + password form |
| `/auth/register` | Register | Two-step: role selection → account details |
| `/auth/error` | Auth Error | Displays Auth.js error codes as human-readable messages |

### Protected Routes (require login — redirect to `/auth/login` if not)

| URL | Page | Notes |
|---|---|---|
| `/cart` | Cart | Placeholder |
| `/favourites` | Favorites | Fetches live inventory, filters by liked IDs |
| `/profile` | Profile root | Redirects to `/profile/shopper/orders` |
| `/profile/shopper/orders` | Orders list | Sample data |
| `/profile/shopper/orders/:orderId` | Order detail | Tracking progress bar |
| `/profile/shopper/payment` | Payment | Placeholder |
| `/profile/shopper/settings` | Account Settings | Placeholder |
| `/profile/merchant/active-listings` | Active Listings | Sample data |
| `/profile/merchant/add-listing` | Post a Listing | Form UI (no API call yet) |
| `/profile/merchant/edit-listing` | Edit Listing | Form UI (hardcoded data) |
| `/profile/merchant/rentals` | Active Rentals | Sample data |
| `/profile/merchant/earnings` | Earnings | Placeholder |
| `/profile/merchant/past-listings` | Past Listings | Sample data |

### Dashboard Layout Nesting

```
src/app/profile/layout.tsx              ← profile photo + name + Modes switcher
  src/app/profile/shopper/layout.tsx    ← Tabs (Orders / Payment / Settings)
    src/app/profile/shopper/orders/page.tsx
  src/app/profile/merchant/layout.tsx   ← Tabs (Listings / Rentals / Earnings)
    src/app/profile/merchant/active-listings/page.tsx
```

---

## 6. Authentication

### Overview

Auth is handled by **Auth.js v5** (`next-auth@beta`) using a custom **Credentials provider** that talks to the AWS auth API. The session lives in an **httpOnly encrypted cookie** — the raw AWS JWT never reaches the browser.

### Auth Flow

```
1. User submits /auth/login form
   └── signIn('credentials', { username, password })

2. src/auth.ts › authorize()
   ├── POST {AUTH_API_URL}/login → { token }  (raw AWS JWT)
   └── POST {AUTH_API_URL}/verify (Authorization: Bearer token)
       └── { claims: { sub, username, email, role, iat, exp } }

3. Auth.js encrypts claims into an httpOnly session cookie
   └── accessToken is stored only in the encrypted JWT, never in Session

4. On every request, jwt() callback checks claims.exp
   └── If expired → sets token.error = 'TokenExpired'
   └── Proxy (proxy.ts) reads this and redirects to /auth/login?reason=session_expired

5. Session exposed to the app via useSession() / auth():
   └── { user: { id, name, email, role }, error? }
```

### Key Files

| File | Purpose |
|---|---|
| `src/auth.ts` | Auth.js config — Credentials provider, `jwt()` and `session()` callbacks, expiry detection |
| `src/lib/auth/types.ts` | TypeScript module augmentation for `Session`, `JWT`, and `User` types |
| `src/proxy.ts` | Edge proxy — reads session via `getToken()`, enforces protected/guest-only routes |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js catch-all API handler |
| `src/app/api/auth/register/route.ts` | Server-side proxy for `POST {AUTH_API_URL}/create_user` |
| `src/app/auth/login/page.tsx` | Login form — username + password, session expired banner |
| `src/app/auth/register/page.tsx` | Registration — two-step: role selection then credentials |
| `src/app/auth/error/page.tsx` | Human-readable Auth.js error display |

### AWS Auth API Endpoints

| Method | Path | Body / Headers | Response |
|---|---|---|---|
| `GET` | `/status` | — | Health check |
| `POST` | `/create_user` | `{ username, password, email, role }` | `{ userId, username, ... }` |
| `POST` | `/login` | `{ username, password }` | `{ message, token }` |
| `POST` | `/verify` | `Authorization: Bearer <token>` | `{ message, claims }` |

### Route Protection

`src/proxy.ts` runs on every request (Next.js 16 Edge proxy, replaces the old `middleware.ts`). It uses `getToken()` from `next-auth/jwt` to read the session cookie directly, which ensures the dev bypass fires before any Auth.js processing:

```
PROTECTED_PREFIXES  → /profile, /cart, /checkout, /favourites
GUEST_ONLY_PREFIXES → /auth/login, /auth/register
```

**Behaviour:**
- Unauthenticated user hits a protected route → redirect to `/auth/login?callbackUrl=<path>`
- Authenticated user hits `/auth/login` or `/auth/register` → redirect to their profile
- Expired token → redirect to `/auth/login?reason=session_expired`
- `NEXT_PUBLIC_DEV_SKIP_AUTH=true` → bypass all checks (dev only)

### Using Session Data in Components

**Server component / layout:**
```ts
import { auth } from '@/auth';
const session = await auth();
// session.user.id, session.user.name, session.user.role
```

**Client component:**
```ts
import { useSession, signOut } from 'next-auth/react';
const { data: session, status } = useSession();
// status: 'loading' | 'authenticated' | 'unauthenticated'
```

**Sign out:**
```ts
await signOut({ callbackUrl: '/' });
```

### Dev Bypass

When working on dashboard UI without a real account, set in `.env.local`:

```
NEXT_PUBLIC_DEV_SKIP_AUTH=true
```

And in `src/app/profile/layout.tsx`, the auth redirect is temporarily commented out with a fallback to `'Dev User'`. Both of these must be reverted before production.

> **Why `NEXT_PUBLIC_`?** The proxy runs on the Edge Runtime, which can only access environment variables that are inlined at build time (i.e. `NEXT_PUBLIC_*`). Regular vars like `DEV_SKIP_AUTH` are silently `undefined` in Edge code.

---

## 7. Architecture Patterns

### Dual API Access (Server vs. Client)

AWS API calls are handled differently depending on where the code runs:

```
Server Component (e.g. (shop)/page.tsx)
  └── calls getInventory() from lib/api/inventory.tsx
        └── typeof window === 'undefined' → fetchFromAWS() directly
              └── API_URL (server-only env var, never exposed to browser)

Client Component (e.g. ShopSection.tsx, product/[id]/page.tsx)
  └── calls apiClient.getInventory() → fetch('/api/inventory')
        └── Next.js Route Handler (src/app/api/inventory/route.ts)
              └── reads API_URL server-side → proxies to AWS
```

**Why the proxy?** `API_URL` is server-only. Routing client-side requests through `/api/...` keeps it off the browser.

### Two-Step Filter Pattern

The filter sidebar uses a pending → applied commit model:

1. User changes a filter → stored in `pendingFilters` (sidebar reflects change immediately)
2. User clicks "Show Results" → `pendingFilters` promoted to `appliedFilters`
3. `appliedFilters` change triggers `applyFiltersAndSort()` in `lib/utils.ts`

This avoids re-filtering on every checkbox tick.

### Dual Dashboard Modes

Users can switch between shopper and merchant views. The routing enforces this:

- `/profile/shopper/*` — orders, payment, settings
- `/profile/merchant/*` — listings, rentals, earnings

The `Modes` component (`src/components/dashboard/modes.tsx`) reads the current pathname and renders a "Switch to X Mode" link. Any authenticated user can access both modes regardless of their registered role.

### Data Normalization

Raw AWS inventory responses use different field names than the frontend `InventoryItem` type:

| AWS field | Frontend field | Notes |
|---|---|---|
| `ItemID` | `id` | |
| `ItemName` | `name` | |
| `thumbnail` | `imageUrl` | May be null; separate `images` array is the primary source |
| `sizes` | `sizes` | AWS: `[{size:"S", in_stock:1}]` → Frontend: `["S"]` |
| `price` | `price` | AWS sends as string `"263.00"` → parsed to `number` |
| `occasion` | `occasion` | AWS: `["formal","party"]` → takes first element |

The canonical normalizer is `normalizeItem()` in `src/lib/api/inventory.tsx`. All client and server data paths run through it — there is no inline field mapping elsewhere.

**Product detail response shape** — the single-item endpoint returns a different shape to the list endpoint:

```json
{
  "item": { "ItemID": "...", "brand": "...", ... },
  "images": ["https://s3.amazonaws.com/..."]
}
```

The API route at `/api/inventory/[id]/route.ts` flattens this to `{ data: { ...item, images } }` before returning it to the client, so `normalizeItem()` receives a consistent flat object.

---

## 8. API Layer

### Types — `src/lib/api/types.ts`

| Type | Purpose |
|---|---|
| `InventoryItem` | A single rentable product |
| `FilterOptions` | All supported filter/sort parameters |
| `ApiResponse<T>` | Standard `{ data: T }` wrapper |
| `ListingStatus` | `'live' \| 'pending' \| 'ended'` |
| `OrderStatus` | `'live' \| 'pending' \| 'rented' \| 'returned'` |
| `ShopperOrderStatus` | `'Shipped' \| 'Delivered'` |

### Server Functions — `src/lib/api/inventory.tsx`

Safe to import in any component (server or client). They automatically pick the right data path:

```ts
getInventory(filters?: FilterOptions)  → InventoryItem[]
getProductById(id: string)             → InventoryItem
getCategories()                        → string[]
getBrands()                            → string[]
getOccasions()                         → string[]
```

The `ApiClient` class (exported as `apiClient`) is the client-side instance — prefer the standalone functions above unless you need the class directly.

### Next.js API Routes — `src/app/api/`

**Inventory proxies** (keep `API_URL` off the browser):

| Route | AWS endpoint |
|---|---|
| `GET /api/inventory` | `{API_URL}/inventory` |
| `GET /api/inventory/:id` | `{API_URL}/inventory/:id` — flattens `{ item, images }` to `{ data: {...item, images} }` |
| `GET /api/inventory/brands` | `{API_URL}/inventory/brands` |
| `GET /api/inventory/categories` | `{API_URL}/inventory/categories` |
| `GET /api/inventory/occasions` | `{API_URL}/inventory/occasions` |

**Auth proxies** (keep `AUTH_API_URL` off the browser):

| Route | Purpose |
|---|---|
| `GET/POST /api/auth/[...nextauth]` | Auth.js catch-all — handles sign-in, sign-out, session |
| `POST /api/auth/register` | Proxies to `{AUTH_API_URL}/create_user`, mirrors status codes (400, 409, 200) |

### Filter & Sort Logic — `src/lib/utils.ts`

```ts
filterInventory(items, filters)       // applies all filter options
sortInventory(items, sortBy)          // sorts by price, name, newest, popular, rating
applyFiltersAndSort(items, filters)   // convenience: filter then sort
cn(...inputs)                         // Tailwind class merge (clsx + tailwind-merge)
```

---

## 9. Key Components

### `ShopSection` — `src/components/shop/ShopSection.tsx`

Orchestrates the shop page:
- Receives server-fetched `products` as a prop (avoids double-fetch on SSR)
- Falls back to `apiClient.getInventory()` if no prop provided
- Manages `pendingFilters` / `appliedFilters` state
- Renders `FilterSidebar` + `ProductGrid`

### `ProductCard` — `src/components/shop/ProductCard.tsx`

Displays a single product: image, brand badge, name, price, heart button. Handles:
- Missing/broken images with a "Coming Soon" placeholder
- `isPlaceholder` prop for non-interactive "Coming Soon" cards
- Availability/out-of-stock badges

### `FilterSidebar` — `src/components/filters/FilterSidebar.tsx`

Accordion-style sidebar with: Gender, Category, Brand, Occasion, Color, Size, Availability, and a Sort By dropdown.

- Categories and brands are **derived from the live product list** (deduped from `allProducts` prop) — not separate API calls.
- "Clear all" resets all pending filters.

### `Navbar` — `src/components/navbar.tsx`

- **Logged out:** "Sign In" text link to `/auth/login`
- **Loading:** skeleton pulse to prevent layout shift
- **Logged in:** purple initials avatar chip with dropdown (My Profile, My Orders, Favourites, Sign Out)

Uses `useSession()` and `signOut` from `next-auth/react`.

### `listing-shared.tsx` — `src/components/dashboard/listing-shared.tsx`

Shared primitives for add/edit listing pages:

| Export | Purpose |
|---|---|
| `usePhotoSlots()` | Hook managing 6 photo upload slots |
| `useRentalPricing()` | Recommended price: `0.115 × RRP × duration^0.402` |
| `FormShell` | White card wrapper with header + footer |
| `SharedFormFields` | All form fields (photos, name, tags, pricing, calendar) |
| `AvailabilityCalendar` | Two-month `react-day-picker` for blocking dates |
| `RentalPriceAndDuration` | Duration radio pills + price input |

### `useLikedItems` — `src/lib/hooks/useLikedItems.ts`

localStorage-backed favorites hook. Returns:
- `likedItems: string[]` — liked product IDs
- `likedCount: number` — for navbar badge
- `toggleLike(id)` — add/remove
- `isLiked(id): boolean`
- `clearAllLikes()`

Backend sync on login is planned but not yet implemented.

### `StatusBadge` — `src/components/dashboard/StatusBadge.tsx`

Polymorphic colored badge:

```tsx
<StatusBadge type="listing" status="live" />     // green "Live"
<StatusBadge type="order"   status="pending" />  // amber "Pending"
<StatusBadge type="shopper" status="Shipped" />  // purple "Shipped"
```

---

## 10. State Management & Hooks

There is **no global state manager**. All state is local React state or purpose-built hooks.

| State | Lives in | How it flows |
|---|---|---|
| Auth session | Auth.js cookie → `SessionProvider` → `useSession()` | Available everywhere via hook |
| Product list | `ShopSection` | Passed as props to `FilterSidebar`, `ProductGrid` |
| Filter state | `ShopSection` (pending + applied) | Passed down to `FilterSidebar` |
| Liked items | `useLikedItems` + `localStorage` | `Navbar`, `ShopSection`, `ProductDetail`, `Favorites` |
| Rental dates | `product/[id]/page.tsx` local state | Local only |
| Photo slots | `usePhotoSlots()` in listing pages | Local only |

---

## 11. Styling System

### Fonts

Five fonts loaded globally in `layout.tsx`:

| CSS variable | Font | Used for |
|---|---|---|
| `--font-satoshi` | Satoshi (Fontshare) | Primary body text |
| `--font-geist-sans` | Geist Sans | Default sans-serif |
| `--font-geist-mono` | Geist Mono | Monospace |
| `--font-averia` | Averia Serif Libre | Some nav items |
| `--font-newsreader` | Newsreader | About page headings |
| `--font-inter` | Inter | Prices |

Body default is `font-satoshi`.

### Colors (Brand)

| Color | Hex | Usage |
|---|---|---|
| Purple (primary) | `#8C2D8B` | CTAs, badges, accents |
| Purple (light) | `#9B5DE5` | Hover states |
| Warm cream | `#FFFDF7` | Navbar background |
| Deep purple | `#672862` | Footer background |
| Light purple | `#B361A6` | Footer CTA button, profile greeting |
| Dark navy | `#1A1530` | Form text, primary buttons |

### Tailwind v4

Custom theme tokens are defined in `globals.css` with `@theme inline { ... }` — not `tailwind.config.js`. shadcn's Tailwind integration is imported at the top of `globals.css`.

---

## 12. What Is Real vs. Hardcoded

### Real (connected to AWS API)

| Feature | Notes |
|---|---|
| Shop product listing | Server-fetched via `getInventory()` |
| Product detail page | `apiClient.getProductById()` — fetches item + signed S3 image URLs |
| Favorites page | Fetches live inventory, filters by locally-stored IDs |
| Filter options | Categories/brands derived from real product data |
| Login / logout | Full Auth.js credentials flow against AWS auth API |
| Registration | POSTs to AWS `create_user`, then auto-signs in |
| Navbar user info | Reads from live `useSession()` |
| Profile greeting | Reads from live session (falls back to "Dev User" when bypass is on) |

### Hardcoded / Placeholder

| Page / Component | What's hardcoded |
|---|---|
| `src/lib/data/sample-data.ts` | All merchant listings, all shopper orders |
| `profile/merchant/active-listings` | Uses `SAMPLE_LISTINGS` |
| `profile/merchant/rentals` | Uses `SAMPLE_ORDERS` |
| `profile/shopper/orders` | Uses `SAMPLE_ORDERS` |
| `profile/shopper/orders/:id` | `orderItems`, carrier info, address are hardcoded |
| `RentalRequest.tsx` | Renter, listing, and request details are hardcoded |
| `add-listing/page.tsx` | `handlePublish()` is a TODO stub |
| `edit-listing/page.tsx` | `handleSave()` is a TODO stub; listing data is hardcoded |
| Cart, Contact, How It Works, Payment, Settings, Earnings | Placeholder / minimal content |

---

## 13. Known Issues & Tech Debt

### Active

**1. `NEXT_PUBLIC_DEV_SKIP_AUTH` and profile layout bypass must be removed before production**
Two dev bypasses are currently active:
- `.env.local`: `NEXT_PUBLIC_DEV_SKIP_AUTH=true`
- `src/app/profile/layout.tsx`: auth redirect is commented out with a `'Dev User'` fallback

Both must be reverted once the team has real accounts set up.

**2. Dashboard data is all hardcoded sample data**
Every dashboard page (`orders`, `active-listings`, `rentals`, etc.) reads from `src/lib/data/sample-data.ts`. These need real API endpoints from the backend.

**3. `useLikedItems` is localStorage only — no backend sync**
Favorites are saved to `localStorage` and lost on sign-out or new device. The hook already has a comment noting planned backend sync on login.

**4. `add-listing` and `edit-listing` form submissions are stubs**
`handlePublish()` and `handleSave()` in the listing pages are TODO stubs — the form UI is complete but nothing is sent to the backend.

**5. Cart is not implemented**
`/cart` page is a placeholder. "Add to Bag" and "Rent Now" on the product detail page show a login prompt modal but take no further action after login.

**6. `sidebar.tsx` is unused**
`src/components/sidebar.tsx` is not imported anywhere. Appears to be an abandoned admin sidebar — safe to delete.

### Resolved (for reference)

The following issues from the initial review have been fixed:

| Issue | Fix applied |
|---|---|
| Duplicate AWS field mapping in 3 places | All client components now use `apiClient`; `normalizeItem()` is the single source of truth |
| Product detail fetched full inventory list to find one item | Now calls `apiClient.getProductById()` against the dedicated `/api/inventory/:id` endpoint |
| `alert()` for rental date validation | Replaced with inline `<p role="alert">` error message |
| Console logs in production code | Removed from `navbar.tsx`, `ShopSection.tsx`, `inventory.tsx`, API routes |
| Footer links pointing to `/public` | Now point to `/privacy-policy`, `/data-privacy`, `/terms` |
| `next.config.ts` allowing all image domains (`**`) | Now scoped to `*.amazonaws.com` and `images.unsplash.com` |
| Hardcoded "Tatiana" in profile layout | Now reads from live Auth.js session |
| Default "Generated by create next app" metadata | Updated with real title template and OpenGraph tags |
| Debug path logger in navbar | Removed |
| `middleware.ts` deprecated in Next.js 16 | Migrated to `proxy.ts` |

---

## 14. Future Integration Points

When wiring up real backend data, here is where each integration belongs:

| Feature | File to update | Notes |
|---|---|---|
| Real orders (shopper) | `src/app/profile/shopper/orders/page.tsx` | Replace `SAMPLE_ORDERS` |
| Order detail | `src/app/profile/shopper/orders/[orderId]/page.tsx` | Replace hardcoded items/carrier/address |
| Real listings (merchant) | `src/app/profile/merchant/active-listings/page.tsx` | Replace `SAMPLE_LISTINGS` |
| Real rental requests | `src/components/dashboard/RentalRequest.tsx` | Replace `SAMPLE_REQUEST` |
| Create listing API call | `src/app/profile/merchant/add-listing/page.tsx` | Wire `handlePublish()` |
| Update listing API call | `src/app/profile/merchant/edit-listing/page.tsx` | Wire `handleSave()`, load real listing by ID |
| Add to cart | `src/app/product/[id]/page.tsx` | `handleAddToCart()` — currently shows login modal then stops |
| Rent now / checkout | `src/app/product/[id]/page.tsx` | `handleRentNow()` same |
| Favorites backend sync | `src/lib/hooks/useLikedItems.ts` | Merge localStorage on login, persist on toggle |
| Confirm/decline rental | `src/components/dashboard/RentalRequest.tsx` | Buttons have no handlers |
| Payment page | `src/app/profile/shopper/payment/page.tsx` | Placeholder — integrate payment provider |
| Earnings page | `src/app/profile/merchant/earnings/page.tsx` | Placeholder |
| Settings page | `src/app/profile/shopper/settings/page.tsx` | Placeholder |
| Restore auth proxy | `src/proxy.ts` | Restore full protection logic once dev bypass is removed |
| Restore profile layout guard | `src/app/profile/layout.tsx` | Uncomment `if (!session?.user) redirect(...)` |
