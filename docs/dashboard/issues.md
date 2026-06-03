# Yika Dashboard — Implementation Work Plan

This is the master plan for delivering the Yika dashboard redesign (Shopper Mode + Merchant Mode) against the canonical Figma file. It contains **21 self-contained issues** across 4 phases. Each issue is structured so that a non-technical orchestrator can hand it directly to an AI agent and that agent can execute it with minimal back-and-forth.

---

## 📖 How to use this file

### For the orchestrator (non-technical)

1. **Hand issues out in dependency order.** Issues are numbered A1, A2, ... D2. Lower-numbered issues unblock higher-numbered ones.
2. **Default order:** ship Phase A fully (A1 → A8), then start Phase B and C in parallel if you want, then optionally Phase D.
3. **One issue per AI agent at a time.** Don't batch issues unless the issue explicitly says "can batch with X."
4. **After each issue completes:** verify the Manual Testing steps yourself before approving the PR.
5. **If an agent comes back confused or asking too many questions** — that's a signal the issue isn't ready. Don't try to clarify in chat; come back here, refine the issue, then re-dispatch.

### For the AI agent picking up an issue

**Required reading before you write any code, in this order:**

1. `docs/dashboard/spec.md` — the canonical spec (brand colors, fonts, component patterns, page mappings)
2. **This file**, the specific issue you're assigned
3. The **Required reading** section of your issue (Figma PNG attachments, related code files)

**Standing rules for every issue:**

- **UI only.** This work plan is UI-only. Where data fetching is needed, call a typed stub from the data layer (Issue A2). Never wire to a real backend.
- **No hard-coded colors or font families.** Always use Tailwind classes that resolve to the design tokens from A1. If a value is missing from tokens, add it to tokens first, then use it.
- **Test data everywhere.** Mock data lives in the data layer (A2). Every page must render reasonably with the mock data. No "TODO: add data" placeholders.
- **Reuse before building.** Check existing components in `src/components/dashboard/` and `src/components/ui/` before creating new ones. If a component is close but not quite right, refactor it in place.
- **Comment, don't hide.** Leave clear `// TODO(backend):` comments at the points where real backend integration will plug in.
- **Build must pass.** `npx next build` must succeed before reporting the issue done.
- **Manual smoke test required.** Run the dev server, click through the user flow described in the issue's Manual Testing section, and confirm it works before reporting done.

---

## 🗺️ Dependency graph

```
Phase A — Foundation (do these first, ideally in order)
  A1 Design tokens ────────────────────► blocks ALL others
  A2 Data layer + repos ───────────────► blocks ALL page issues
  A3 shadcn primitives ────────────────► blocks A5 (sheet), A6 (input dirty state via Account Settings)
  A4 StatusPill ───────────────────────► blocks A8, B-series
  A5 AppHeader + NotificationsDrawer ──► blocks B/C (shell)
  A6 ProfileHeader + Tabs + Shell ─────► blocks B/C (shell)
  A7 OrderRow + ListingRow ────────────► blocks B1, B2, B5, B6, B7
  A8 OrderStatusStepper ───────────────► blocks B1

Phase B — Restyle existing pages (independent of each other after A1-A8)
  B1 Shopper Order Detail
  B2 Shopper All Orders
  B3 Shopper Payment Methods
  B4 Shopper Account Settings
  B5 Merchant Active Listings
  B6 Merchant Active Rentals
  B7 Merchant Past Listings
  B8 Merchant Your Earnings
  B9 Merchant List an Item

Phase C — New pages
  C2 Shopper Wishlist (filter sidebar + grid)
  C3 Shopper mobile responsive layer

Phase D — Defer (do later)
  D1 Shopping bag + Cart confirmation
  D2 Payment Details modal
```

**Critical path:** A1 → A2 → A6 → any Phase B page.

If you parallelize, **A1 must finish first** (everything depends on tokens). A2-A4 can start in parallel after A1. A5-A8 can start in parallel after A1-A4.

---

## 🎨 Shared context (every issue inherits this)

- **Brand colors:** `brand-magenta` `#8C2D8B`, `brand-lavender` `#B361A6`, page bg `#FFFDF7`. Full palette in `docs/dashboard/spec.md`.
- **Fonts:** Satoshi (body), Newsreader italic (the "Tatiana" accent). All loaded in `src/app/layout.tsx`.
- **Stack:** Next.js 16 app router, React 19, Tailwind v4, shadcn/ui ("new-york" style with CSS vars), lucide-react icons.
- **Routes:** existing `/profile/shopper/*` and `/profile/merchant/*` route trees. Don't restructure unless an issue says to.
- **Backend:** none exists. All data comes from the data layer (A2).
- **No tests required** unless an issue specifically asks. Project rule #1 says tests are mandatory; for this UI-focused plan we waive component tests until backend lands. Visual smoke tests via the dev server are the bar.

---

## ⚠️ Open questions across the plan

These are flagged in the spec doc. Resolve before starting the relevant issue:

| # | Question | Affected issues |
|---|---|---|
| Q1 | Wishlist data — keep `localStorage` or move to backend? | C2 |
| Q2 | Notifications data — real backend or mock only? | A5, A2 |
| Q3 | "Active Rentals" vs "Your Earnings" tab ambiguity — `figma/4570-3922-earnings.png` shows the Earnings layout (summary cards + Earnings History) while `figma/4570-3591-active-rentals.png` shows the Active Rentals layout (list of rental orders). Two distinct designs, but the older "earnings" frame underlines the "Active Rentals" tab — almost certainly a designer artifact. Implementing both as listed below resolves the ambiguity; flagging here in case Product wants them merged. | B6, B8 |
| Q4 | Bell unread badge — yes/no, and where does count come from? | A5 |
| Q5 | @handles on order rows — link to user profiles, or display only? | A7, B2 |
| Q6 | Phase D in scope or deferred? | D1, D2 |

Default assumption if unanswered: `localStorage` for wishlist (Q1), mock notifications (Q2), treat as Earnings page (Q3), show unread badge with mock count (Q4), display @handles without links (Q5), defer Phase D (Q6).

---

# Phase A — Foundation

## A1 — Design tokens system

**Phase A · Complexity: small · ~2-3h · Blocks: everything**

### 🎯 Goal (plain English)
Make it so the brand colors and fonts can be changed in a single file and have those changes ripple through the entire dashboard automatically. No more hunting through 30 files when the brand updates their purple.

### 🔧 Technical description
Create a centralized design token module that exports brand colors, fonts, and radii as typed TS objects, exposes them as CSS variables in `globals.css`, and extends Tailwind's theme so utility classes like `bg-brand-magenta` and `font-newsreader` work everywhere. Then sweep the codebase to replace hard-coded hex strings (`#8C2D8B`, `#B361A6`, `#FFFDF7`, status pill hex values, etc.) with the new utility classes.

### 📚 Required reading
- `docs/dashboard/spec.md` § "Brand colors", § "Typography", § "Status pill palette"
- `src/app/globals.css` — current CSS variables and `@theme inline` block

### 🔗 Dependencies
- Blocked by: nothing — this is first
- Blocks: every other issue (they all consume tokens)

### 📁 Files to create / modify
- **Create:** `src/lib/design-tokens.ts` — typed exports
- **Modify:** `src/app/globals.css` — add CSS variables under `:root` and reference them in `@theme inline`
- **Modify:** `src/components/dashboard/StatusBadge.tsx` — replace hex literals with tokens
- **Modify:** `src/components/dashboard/OrderCard.tsx` — replace `#8C2D8B` (@handle color), `#E5E7EB` (border), `#6B7280` (muted text), `#9CA3AF` (faint), `#111827` (primary), `#F9FAFB` (thumbnail bg)
- **Modify:** `src/components/dashboard/listing-shared.tsx`, `src/components/dashboard/ListingCards.tsx`, `src/components/dashboard/RentalRequest.tsx` — same sweep
- **Modify:** `src/app/profile/layout.tsx` — replace `#b361a6` with `text-brand-lavender`
- **Modify:** `src/components/dashboard/modes.tsx`, `src/components/dashboard/tabs.tsx` — replace any hex
- **Modify:** `src/components/navbar.tsx` — replace `#FFFDF7` with `bg-page` token

### 📐 Token structure to implement

```ts
// src/lib/design-tokens.ts
export const colors = {
  brand: {
    magenta: '#8C2D8B',   // deep brand
    lavender: '#B361A6',  // light accent (the "Tatiana" color)
    footer: '#672862',    // existing footer bg
  },
  page: '#FFFDF7',         // warm-white body bg
  surface: '#FFFFFF',      // cards
  border: {
    default: '#E5E7EB',
    subtle: '#F3F4F6',
  },
  text: {
    primary: '#111827',
    muted: '#6B7280',
    faint: '#9CA3AF',
  },
  status: {
    green: { dot: '#15803D', border: '#15803D', bg: '#F0FDF4', text: '#15803D' },
    olive: { dot: '#414E32', border: '#414E32', bg: '#F8FAE8', text: '#414E32' },
    magenta: { dot: '#8C2D8B', border: '#8C2D8B', bg: '#F5DBEA', text: '#8C2D8B' },
    yellow: { dot: '#B45309', border: '#D97706', bg: '#FFFBEB', text: '#B45309' },
    orange: { dot: '#EA580C', border: '#EA580C', bg: '#FFF7ED', text: '#EA580C' },
    gray:   { dot: '#9CA3AF', border: '#E5E7EB', bg: '#F9FAFB', text: '#6B7280' },
  },
} as const;

export const fonts = {
  body: 'var(--font-satoshi, "Satoshi"), sans-serif',
  accent: 'var(--font-newsreader), serif',  // for the "Tatiana" italic
} as const;

export const radii = {
  pill: '9999px',
  card: '16px',     // rounded-2xl
  thumb: '12px',    // rounded-xl
  field: '8px',
} as const;
```

### Tailwind mapping (in `globals.css` `@theme inline`)

```css
--color-brand-magenta: #8C2D8B;
--color-brand-lavender: #B361A6;
--color-page: #FFFDF7;
--color-surface: #FFFFFF;
--color-text-primary: #111827;
--color-text-muted: #6B7280;
--color-text-faint: #9CA3AF;
/* ...etc for status colors */
```

After this, Tailwind classes `bg-brand-magenta`, `text-brand-lavender`, `bg-page`, `text-text-primary` should all work.

### ✅ Acceptance criteria
- [ ] `src/lib/design-tokens.ts` exists and exports `colors`, `fonts`, `radii`
- [ ] CSS variables for all token values are defined in `globals.css`
- [ ] Tailwind classes `bg-brand-magenta`, `bg-brand-lavender`, `bg-page`, `text-brand-magenta`, `text-text-muted`, `text-text-primary`, `text-text-faint` all resolve correctly
- [ ] Grep verification: `grep -r "#8C2D8B\|#B361A6\|#FFFDF7\|#b361a6" src/` returns **no matches** inside dashboard-scoped files (existing `src/components/footer.tsx`, marketing pages can keep their hex if not on the dashboard path)
- [ ] `npx next build` passes
- [ ] Visual regression: open `/profile/shopper/orders` — page renders identically to before this change (same colors, same fonts)

### 🧪 Manual testing
1. `npm run dev`
2. Open `http://localhost:3000/profile/shopper/orders`
3. Verify the page looks identical to before (no visual changes — this is a refactor)
4. Open `src/lib/design-tokens.ts`, change `colors.brand.magenta` from `#8C2D8B` to `#FF0000`
5. Refresh — the @handle text "@reformation" should now be **red**
6. Revert the change and verify it returns to magenta

### ⚠️ Out of scope
- Do NOT touch landing pages, marketing components, or the footer's interior styling (only its background color reference)
- Do NOT add spacing tokens, animation tokens, or shadow tokens yet — just colors, fonts, radii
- Do NOT delete the existing hex values in CSS comments (leave them as `/* was #8C2D8B */` if helpful) — actually, per project rules, don't add backwards-compat comments; just clean replace

---

## A2 — Data layer + repository interfaces

**Phase A · Complexity: medium · ~4h · Blocks: all page issues · Can run in parallel with A3, A4 after A1**

### 🎯 Goal (plain English)
Build a clear, typed "fake backend" that every page in the dashboard reads from. When the real backend lands later, we replace one file and everything keeps working. Today, every page must already work end-to-end against this fake data.

### 🔧 Technical description
Create a repository-pattern abstraction in `src/lib/data/`. Define TS interfaces for each domain (orders, listings, notifications, user/profile, earnings). Implement each as a class or module that returns mock data via async functions, simulating eventual network latency (50-200ms `await sleep`). Each method has a `// TODO(backend):` comment describing the future real endpoint.

### 📚 Required reading
- `docs/dashboard/spec.md` § "Page → route mapping" and § "Codebase reference"
- `src/lib/data/sample-data.ts` — existing sample data to preserve and extend
- `src/components/dashboard/ListingCards.tsx` — existing type definitions for `OrderItem`, `ListingItem`, statuses

### 🔗 Dependencies
- Blocked by: A1 (only because every issue is; technically this could go first)
- Blocks: every page issue

### 📁 Files to create / modify
- **Create:** `src/lib/data/types.ts` — domain types (Order, OrderDetail, Listing, Notification, UserProfile, EarningsSummary, EarningsHistoryEntry)
- **Create:** `src/lib/data/mock-orders.ts` — mock data for orders
- **Create:** `src/lib/data/mock-listings.ts` — mock data for listings
- **Create:** `src/lib/data/mock-notifications.ts` — mock data for notifications
- **Create:** `src/lib/data/mock-user.ts` — Tatiana profile data
- **Create:** `src/lib/data/mock-earnings.ts` — earnings summary + history
- **Create:** `src/lib/data/repositories.ts` — exports `orders`, `listings`, `notifications`, `user`, `earnings` objects with async methods
- **Modify:** `src/lib/data/sample-data.ts` — keep for backward compat OR migrate consumers and delete

### 🧩 Interface contracts to define

```ts
// src/lib/data/types.ts
export type OrderStatus = 'OrderPlaced' | 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
export type ListingStatus = 'live' | 'pending' | 'ended';
export type RentalOrderStatus = 'live' | 'pending' | 'rented' | 'returned';

export type Order = {
  id: string;
  orderNumber: string;
  itemCount: number;
  sellerHandle: string;        // for shopper view
  buyerName?: string;          // for merchant view
  total: number;
  orderDate: string;           // ISO or display format — decide and document
  status: OrderStatus;
  thumbnailUrls: string[];
};

export type OrderDetail = Order & {
  shippingCarrier: string;
  trackingNumber: string;
  shippingAddress: { name: string; street: string; cityStateZip: string };
  lineItems: { product: string; sku: string; quantity: number; unitPrice: number }[];
  paymentMethodLast4: string;
};

export type Listing = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  durationDays: number;
  imageUrl: string;
  status: ListingStatus;
};

export type Notification = {
  id: string;
  title: string;       // usually "Yika"
  body: string;
  timestamp: string;   // "1m ago", "2h ago" — display string for now
  read: boolean;
  iconUrl?: string;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  shippingAddress: { street: string; city: string; state: string; zip: string };
};

export type EarningsSummary = {
  total: number;
  pending: number;
  pendingOrderRef?: string;
  sinceDate: string;
};

export type EarningsHistoryEntry = {
  orderRef: string;
  buyerName: string;
  total: number;
  dueDate: string;
  status: RentalOrderStatus;
  thumbnailUrls: string[];
};
```

### 🔁 Repository surface

```ts
// src/lib/data/repositories.ts
export const orders = {
  // TODO(backend): GET /api/orders?role=shopper
  listShopperOrders: async (): Promise<Order[]> => { ... },
  // TODO(backend): GET /api/orders/:id
  getOrderDetail: async (orderNumber: string): Promise<OrderDetail | null> => { ... },
};

export const listings = {
  // TODO(backend): GET /api/listings?merchant=me&status=active
  listActiveListings: async (): Promise<Listing[]> => { ... },
  listPastListings: async (): Promise<Listing[]> => { ... },
};

export const notifications = {
  // TODO(backend): GET /api/notifications
  list: async (): Promise<Notification[]> => { ... },
  // TODO(backend): POST /api/notifications/:id/read
  markRead: async (id: string): Promise<void> => { ... },
  // TODO(backend): GET /api/notifications/unread-count
  unreadCount: async (): Promise<number> => { ... },
};

export const user = {
  // TODO(backend): GET /api/me
  getProfile: async (): Promise<UserProfile> => { ... },
  // TODO(backend): PATCH /api/me
  updateProfile: async (patch: Partial<UserProfile>): Promise<UserProfile> => { ... },
};

export const earnings = {
  // TODO(backend): GET /api/merchant/earnings/summary
  getSummary: async (): Promise<EarningsSummary> => { ... },
  // TODO(backend): GET /api/merchant/earnings/history
  getHistory: async (): Promise<EarningsHistoryEntry[]> => { ... },
};
```

### 📊 Mock data requirements

Each mock file must include **at least 5 entries covering all status variants** so every UI state is visually testable:

- `mock-orders.ts`: at least one per OrderStatus value, plus a multi-item order (itemCount > 1), plus a single-item order
- `mock-listings.ts`: at least one Live, one Pending, one Ended
- `mock-notifications.ts`: at least 5 — mix of read/unread, different timestamps
- `mock-earnings.ts`: history with each RentalOrderStatus represented

### ✅ Acceptance criteria
- [ ] All types defined in `src/lib/data/types.ts`
- [ ] All five repositories (`orders`, `listings`, `notifications`, `user`, `earnings`) exported from `src/lib/data/repositories.ts`
- [ ] Every method has a `// TODO(backend):` comment describing the future endpoint
- [ ] Every method simulates latency with `await sleep(50-200ms)`
- [ ] Mock data covers all status variants (see Mock data requirements above)
- [ ] Existing pages still build and render (consumers haven't migrated yet; old `sample-data.ts` can stay temporarily)
- [ ] `npx next build` passes

### 🧪 Manual testing
1. `npm run dev`
2. Add a temporary test page at `src/app/_test-data/page.tsx`:
   ```tsx
   import { orders, notifications } from '@/lib/data/repositories';
   export default async function Page() {
     const o = await orders.listShopperOrders();
     const n = await notifications.list();
     return <pre>{JSON.stringify({ orders: o, notifications: n }, null, 2)}</pre>;
   }
   ```
3. Visit `http://localhost:3000/_test-data` — confirm orders + notifications JSON renders
4. Delete the test page before merging

### ⚠️ Out of scope
- Do NOT implement any real fetch / HTTP calls. Stubs only.
- Do NOT migrate existing pages to use the new repositories — page issues (B/C series) will do that.
- Do NOT delete `src/lib/data/sample-data.ts` yet; it'll be cleaned up as pages migrate.

---

## A3 — Add shadcn primitives (table, dialog, sheet, input)

**Phase A · Complexity: small · ~1h · Can run in parallel with A1, A2, A4**

### 🎯 Goal (plain English)
Install the shadcn UI building blocks we need for tables, modals, slide-out drawers, and text inputs. These don't exist yet in the repo.

### 🔧 Technical description
Run the shadcn CLI to add four primitives. Verify they're added under `src/components/ui/` with consistent styling and that they import cleanly.

### 📚 Required reading
- `components.json` (in repo root) — confirms shadcn config
- shadcn docs for each primitive (https://ui.shadcn.com/docs/components)

### 🔗 Dependencies
- Blocked by: nothing (technically blocked by A1 only because tokens may want to wire into shadcn theme — but if A1 is in-flight, A3 can start)
- Blocks: A5 (uses sheet), B4 (uses input), B8 (uses table), B9 (uses input + dialog)

### 📁 Files to create / modify
- **Create:** `src/components/ui/table.tsx`
- **Create:** `src/components/ui/dialog.tsx`
- **Create:** `src/components/ui/sheet.tsx`
- **Create:** `src/components/ui/input.tsx`

### 🛠️ How to do it
```bash
npx shadcn@latest add table dialog sheet input
```

If the CLI errors, install dependencies manually per the shadcn docs. The CLI may pick up the existing `components.json` and place files correctly.

After install, open each generated file and:
- Replace any hard-coded shadcn theme colors with the design token equivalents from A1 (if A1 is done)
- Confirm they import `@/lib/utils` cn helper (already in repo)

### ✅ Acceptance criteria
- [ ] All four files exist under `src/components/ui/`
- [ ] Each is importable: `import { Table } from '@/components/ui/table'`, etc.
- [ ] `npx next build` passes

### 🧪 Manual testing
1. Add a temporary test page that renders one of each primitive (e.g. a Table with 2 rows, a Dialog with a trigger button, a Sheet with a trigger button, an Input).
2. `npm run dev`
3. Verify each renders and is interactive (open Dialog, open Sheet, type into Input).
4. Delete the test page before merging.

### ⚠️ Out of scope
- Do NOT add other shadcn primitives unless they're explicitly needed by a later issue
- Do NOT customize the primitive internals — just install and verify they work

---

## A4 — `<StatusPill>` unified component

**Phase A · Complexity: small · ~2h · Blocked by: A1 · Blocks: A7, B-series**

### 🎯 Goal (plain English)
A single pill-shaped status indicator that handles every status the dashboard shows — Live, Delivered, Shipped, Pending, Rented, Returned, Listing Ended. One component, many flavors.

### 🔧 Technical description
Refactor the existing `src/components/dashboard/StatusBadge.tsx` into a single `<StatusPill>` component with a typed `variant` prop. Use design tokens for colors. Replace all current usages (`OrderCard`, listing cards, etc.) with the new component.

### 📚 Required reading
- `docs/dashboard/figma/4577-3661-listing-row.png` (listing rows — Live + Listing ended states)
- `docs/dashboard/figma/4577-3608-order-row.png` (order rows — Returned state)
- `docs/dashboard/figma/4449-1650-all-orders.png` (orders list — Delivered + Shipped)
- `docs/dashboard/figma/4570-2528-active-listings.png` (active listings — Live + Pending)
- `docs/dashboard/spec.md` § "Status pill palette"
- `src/components/dashboard/StatusBadge.tsx` — existing impl to refactor

### 🔗 Dependencies
- Blocked by: A1 (tokens)
- Blocks: A7 (rows use pills), every list/table page

### 📁 Files to create / modify
- **Create:** `src/components/dashboard/StatusPill.tsx` — new unified component
- **Delete:** `src/components/dashboard/StatusBadge.tsx` — replaced by StatusPill
- **Modify:** `src/components/dashboard/OrderCard.tsx`, `src/components/dashboard/listing-shared.tsx`, `src/components/dashboard/ListingCards.tsx`, anything else importing `StatusBadge` — switch to StatusPill

### 🧩 Component API

```tsx
type StatusPillVariant =
  | 'live'         // green
  | 'pending'      // yellow
  | 'shipped'      // brand magenta
  | 'delivered'    // olive green
  | 'rented'       // orange
  | 'returned'    // gray
  | 'ended';       // gray, label "Listing ended"

type StatusPillProps = {
  variant: StatusPillVariant;
  label?: string;  // optional override; default comes from variant
};

export function StatusPill({ variant, label }: StatusPillProps): JSX.Element;
```

Variant → label defaults:
- `live` → "Live"
- `pending` → "Pending"
- `shipped` → "Shipped"
- `delivered` → "Delivered"
- `rented` → "Rented"
- `returned` → "Returned"
- `ended` → "Listing ended"

Colors come from `colors.status` in design tokens. Use Tailwind classes that resolve to those tokens.

### ✅ Acceptance criteria
- [ ] `StatusPill` exists and renders all 7 variants
- [ ] All previous `StatusBadge` usages migrated; `StatusBadge.tsx` deleted
- [ ] No hex literals in StatusPill; only token-backed classes
- [ ] `npx next build` passes
- [ ] Existing pages (`/profile/shopper/orders`, `/profile/merchant/active-listings`) render correctly

### 🧪 Manual testing
1. `npm run dev`
2. Open `/profile/shopper/orders` — Shipped (magenta) and Delivered (olive) pills should render
3. Open `/profile/merchant/active-listings` — Live (green) and Pending (yellow) pills
4. Open `/profile/merchant/past-listings` — Listing ended (gray) pills
5. Compare each pill against the corresponding Figma PNG side-by-side

### ⚠️ Out of scope
- Do NOT change the pill animation behavior (none exists; don't add)
- Do NOT add a "with icon" or "with prefix" variant — keep it dot + label only
- Do NOT introduce a `size` prop — single size for now

---

## A5 — `<AppHeader>` global navbar + `<NotificationsDrawer>`

**Phase A · Complexity: medium · ~5h · Blocked by: A1, A2 (notifications data), A3 (sheet)**

### 🎯 Goal (plain English)
Replace the current site-wide top navigation bar with the Figma version that includes a bell icon. Clicking the bell slides a notifications panel in from the right edge of the screen, showing the latest notifications for the signed-in user.

### 🔧 Technical description
Build `<AppHeader>` matching the Figma frame `4449:1927`. It has logo + 4 nav links + 4 right-side icons (heart, bell, avatar, cart). The bell shows an unread count badge driven by `notifications.unreadCount()` from the data layer. Clicking bell opens `<NotificationsDrawer>`, a slide-out shadcn Sheet from the right edge. The drawer renders a list of notifications from `notifications.list()`. Unread items show a brand-magenta dot. The drawer has a close button.

Replace the current `src/components/navbar.tsx` with `<AppHeader>` everywhere the navbar renders.

### 📚 Required reading
- `docs/dashboard/figma/4449-1927-navbar.png` — navbar (3 states stacked)
- `docs/dashboard/figma/4449-1786-notifications-drawer.png` — notifications drawer (overlay on product page)
- `docs/dashboard/spec.md` § "NavBar" and § "NotificationsDrawer"
- `src/components/navbar.tsx` — existing implementation

### 🔗 Dependencies
- Blocked by: A1 (tokens), A2 (notifications data), A3 (sheet primitive)
- Blocks: nothing technical (but B/C pages will look incomplete without it)

### 📁 Files to create / modify
- **Create:** `src/components/app-header.tsx` — new global navbar
- **Create:** `src/components/notifications/NotificationsDrawer.tsx` — the sheet
- **Create:** `src/components/notifications/NotificationItem.tsx` — single notification row
- **Modify:** `src/app/layout.tsx` — replace `<Navbar />` with `<AppHeader />`
- **Delete:** `src/components/navbar.tsx` (after migration)

### 🧩 Component APIs

```tsx
// AppHeader
export function AppHeader(): JSX.Element;
// - Fixed top-0, 76px tall, bg-page, z-[9999]
// - Renders logo + nav links + 4 right-side icon buttons
// - Bell icon shows unread badge if count > 0
// - Bell triggers <NotificationsDrawer>

// NotificationsDrawer
type NotificationsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function NotificationsDrawer(props: NotificationsDrawerProps): JSX.Element;
// - Wraps shadcn Sheet from right side
// - Loads notifications on open via notifications.list()
// - Shows header "Notifications", X close
// - Lists NotificationItem rows
// - On item click: marks as read via notifications.markRead(id)
```

### 🔄 State management
Use plain React state for drawer open/close. Use plain `useEffect` + `useState` for notification list (no React Query yet — keep it simple). When the drawer opens, fetch fresh notifications.

### 🪧 Unread badge
A small magenta circle (or pill with number) at the top-right of the bell icon when `unreadCount > 0`. The existing favorites count badge in `navbar.tsx` shows this pattern — match its style.

### ✅ Acceptance criteria
- [ ] `<AppHeader>` exists and renders matching `figma/4449-1927-navbar.png`
- [ ] Bell icon visible between heart and avatar
- [ ] Bell shows unread badge when `notifications.unreadCount()` > 0
- [ ] Clicking bell opens `<NotificationsDrawer>` from the right
- [ ] Drawer renders notification items from `notifications.list()`
- [ ] Closing the drawer works (X button + clicking backdrop)
- [ ] All routes still work (`/`, `/profile/...`, `/about`, etc.)
- [ ] `src/components/navbar.tsx` is deleted
- [ ] `src/app/layout.tsx` uses `<AppHeader />`
- [ ] `npx next build` passes

### 🧪 Manual testing
1. `npm run dev`
2. Open `http://localhost:3000` — confirm new navbar with bell renders
3. Click the bell — drawer slides in from the right
4. Verify notifications list shows ≥5 items with timestamps, titles, bodies
5. Verify unread items show a magenta dot indicator
6. Click an unread item — confirm dot disappears (marks as read in state)
7. Close drawer via X — drawer slides out
8. Close drawer via backdrop click — drawer slides out
9. Open `/profile/shopper/orders` — navbar still there, bell still works
10. Compare navbar against `figma/4449-1927-navbar.png` and drawer against `figma/4449-1786-notifications-drawer.png` side-by-side

### ⚠️ Out of scope
- Real backend integration (mock only)
- "Mark all as read" bulk action
- Push notifications, websockets, polling — drawer fetches once on open
- Filter/search inside drawer
- Mobile-specific behavior — the existing mobile hamburger menu pattern can be preserved as-is

---

## A6 — `<ProfileHeader>` + `<DashboardTabs>` + `<DashboardShell>`

**Phase A · Complexity: medium · ~4h · Blocked by: A1, A2 (user profile data)**

### 🎯 Goal (plain English)
Build the reusable layout pieces that every Shopper and Merchant dashboard page sits inside: the greeting strip ("Hey there, Tatiana!") with the mode-switch link, the tab navigation row, and the outer page wrapper that composes them. These are the bones of every dashboard page.

### 🔧 Technical description
Three components that replace the current ad-hoc patterns in `/profile/layout.tsx` and `/profile/{shopper,merchant}/layout.tsx`.

1. `<ProfileHeader>` — avatar + greeting + mode-switch text link (replaces existing `<Modes>` pattern)
2. `<DashboardTabs mode="shopper" | "merchant">` — the three-tab row
3. `<DashboardShell mode="shopper" | "merchant">` — composes ProfileHeader + DashboardTabs + content area

Update the three existing layout files to use the new components.

### 📚 Required reading
- `docs/dashboard/figma/4573-4672-profile-header.png` — Profile Header (Shopper + Merchant variants)
- `docs/dashboard/figma/4449-1994-shopper-tabs.png` — Dashboard Nav shopper tabs
- `docs/dashboard/figma/4573-4652-merchant-tabs.png` — Merchant Nav
- `docs/dashboard/spec.md` § "Profile Header", § "DashboardTabs"
- `src/app/profile/layout.tsx`, `src/app/profile/shopper/layout.tsx`, `src/app/profile/merchant/layout.tsx`
- `src/components/dashboard/modes.tsx`, `src/components/dashboard/tabs.tsx`

### 🔗 Dependencies
- Blocked by: A1, A2
- Blocks: all B-series and C-series page issues

### 📁 Files to create / modify
- **Create:** `src/components/dashboard/ProfileHeader.tsx`
- **Create:** `src/components/dashboard/DashboardTabs.tsx` (replaces existing `tabs.tsx`)
- **Create:** `src/components/dashboard/DashboardShell.tsx`
- **Modify:** `src/app/profile/layout.tsx` — use `<DashboardShell>`
- **Modify:** `src/app/profile/shopper/layout.tsx` — simplify since DashboardShell handles it
- **Modify:** `src/app/profile/merchant/layout.tsx` — simplify
- **Delete:** `src/components/dashboard/modes.tsx` (replaced by ProfileHeader)
- **Delete:** `src/components/dashboard/tabs.tsx` (replaced by DashboardTabs)

### 🧩 Component APIs

```tsx
// ProfileHeader
type ProfileHeaderProps = {
  mode: 'shopper' | 'merchant';
};
export function ProfileHeader({ mode }: ProfileHeaderProps): JSX.Element;
// Reads user profile via user.getProfile() (A2)
// Renders avatar (72px), greeting "Hey there, <Newsreader italic Tatiana!>"
// Mode-switch line: "You're in X Mode. Switch to Y Mode" where "Switch to Y Mode" is a Link to /profile/<other>

// DashboardTabs
type DashboardTabsProps = {
  mode: 'shopper' | 'merchant';
};
export function DashboardTabs({ mode }: DashboardTabsProps): JSX.Element;
// Renders 3 tab links per mode (see spec)
// Active tab determined by usePathname()
// Active state: bold, color text-primary, short black underline directly under label
// Inactive: text-text-faint, no underline
// Full-row border-b border-default

// DashboardShell
type DashboardShellProps = {
  mode: 'shopper' | 'merchant';
  children: React.ReactNode;
};
export function DashboardShell({ mode, children }: DashboardShellProps): JSX.Element;
// Outer container, max-w-5xl, mx-auto, px-8 py-12
// Composes <ProfileHeader mode={mode} /> + <DashboardTabs mode={mode} /> + content area for children
```

### 🎨 Critical visual specs

- Greeting font size: 40px desktop, 24px mobile; semibold
- "Tatiana": uses `font-newsreader italic font-medium text-brand-lavender`
- Mode-switch text size: 14px, `text-text-muted`
- "Switch to X Mode" link: underlined (`underline underline-offset-4 decoration-1`), `text-text-primary`, font-medium
- Tab labels: 15px
- Active tab underline: `border-b-2 border-text-primary`, no underline-offset
- Container: `max-w-5xl mx-auto px-8 py-12`

### ✅ Acceptance criteria
- [ ] All three components exist and work
- [ ] Old `<Modes>` and `<Tabs>` deleted; new components used everywhere
- [ ] `/profile/shopper/orders` renders correctly (header + shopper tabs visible)
- [ ] `/profile/merchant/active-listings` renders correctly (header + merchant tabs visible)
- [ ] Clicking "Switch to Merchant Mode" on a shopper page navigates to `/profile/merchant` (its index will redirect to `/active-listings`)
- [ ] Clicking "Switch to Shopper Mode" on a merchant page navigates to `/profile/shopper` (→ `/orders`)
- [ ] Active tab visually matches the underline spec
- [ ] `npx next build` passes

### 🧪 Manual testing
1. `npm run dev`
2. Open `/profile/shopper/orders`
3. Compare ProfileHeader to `figma/4573-4672-profile-header.png` — avatar, greeting, mode text, font for "Tatiana"
4. Compare tabs to `figma/4449-1994-shopper-tabs.png` — "Your Orders" should be the active one (bold + short underline)
5. Click "Switch to Merchant Mode" — should navigate to `/profile/merchant/active-listings`
6. Compare header now to the bottom variant of `figma/4573-4672-profile-header.png` — should say "Merchant Mode"
7. Click each merchant tab — active state updates correctly
8. Click "Switch to Shopper Mode" — returns to shopper
9. Resize browser to mobile width — greeting size shrinks, layout still works

### ⚠️ Out of scope
- Sidebar version of nav (not in current Figma; spec previously mentioned a sidebar variant that was deprecated)
- Notification triggering from ProfileHeader (lives on AppHeader bell)
- Settings cog in ProfileHeader (not in this Figma frame)

---

## A7 — `<OrderRow>` + `<ListingRow>` reusable rows

**Phase A · Complexity: small-medium · ~3h · Blocked by: A1, A4 (pill)**

### 🎯 Goal (plain English)
Two reusable row components for the table-like lists across the dashboard. One for orders, one for listings. Both used by multiple pages.

### 🔧 Technical description
Polish/refactor the existing `OrderCard` and listing components into clean reusable components. Both consume design tokens, use `<StatusPill>` from A4, and accept typed props matching the data layer types from A2.

### 📚 Required reading
- `docs/dashboard/figma/4577-3608-order-row.png` — Order/Rental row (single + multi-item)
- `docs/dashboard/figma/4577-3661-listing-row.png` — Listing row (Live + Ended)
- `docs/dashboard/figma/4449-1650-all-orders.png` — Shopper All Orders in context
- `docs/dashboard/figma/4570-2528-active-listings.png` — Merchant Active Listings in context
- `src/components/dashboard/OrderCard.tsx`, `src/components/dashboard/listing-shared.tsx`, `src/components/dashboard/ListingCards.tsx`

### 🔗 Dependencies
- Blocked by: A1, A4
- Blocks: B1, B2, B5, B6, B7

### 📁 Files to create / modify
- **Create:** `src/components/dashboard/OrderRow.tsx`
- **Create:** `src/components/dashboard/ListingRow.tsx`
- **Modify or delete:** `src/components/dashboard/OrderCard.tsx`, `listing-shared.tsx`, `ListingCards.tsx` — migrate consumers to new components, then delete the old ones if fully unused

### 🧩 Component APIs

```tsx
// OrderRow (for both shopper view and merchant rental view)
type OrderRowProps = {
  order: Order;
  hrefBase: string;            // e.g. "/profile/shopper/orders/" — chevron links to ${hrefBase}${order.orderNumber}
  showHandle?: boolean;        // true for shopper (shows @sellerHandle), false for merchant rental list
  showBuyerName?: boolean;     // true for merchant rental list
};

// ListingRow
type ListingRowProps = {
  listing: Listing;
  actions?: 'live' | 'ended' | 'none';  // controls pencil+trash vs. no actions
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};
```

### 🎨 Visual specs
- Container: white card, `border border-default`, `rounded-card`, padding `p-4`
- Thumbnail: 64-72px square, `rounded-thumb`, light bg
- Multi-item order thumbnail: render up to 2 images stacked side-by-side with slight offset
- Order ID: 17-18px semibold, `text-text-primary`
- Subtitle: 14px, `text-text-muted`, with `@handle` colored `text-brand-magenta`
- Total: 15px, centered in its column
- Date: 15px, `text-text-muted`, centered
- Status pill: from A4
- Chevron right: 20px, `text-text-faint`

### ✅ Acceptance criteria
- [ ] Both components exist with the API above
- [ ] Existing `/profile/shopper/orders` and `/profile/merchant/active-listings` use the new components and render correctly
- [ ] Old `OrderCard`, `ListingCards`, `listing-shared` exports either replaced or deleted if unused
- [ ] Pencil + trash icons visible on Live listings, not on Ended listings
- [ ] `npx next build` passes

### 🧪 Manual testing
1. `npm run dev`
2. Open `/profile/shopper/orders` — rows render with thumbnails, IDs, @handles, totals, dates, pills, chevrons
3. Click chevron — navigates to the order detail route
4. Open `/profile/merchant/active-listings` — listing rows render with pencil + trash actions
5. Click pencil — should fire a console.log (stub) or open edit (if B-series done)
6. Open `/profile/merchant/past-listings` — listing rows render WITHOUT pencil + trash, with "Listing ended" pill
7. Compare each row against the Figma PNGs

### ⚠️ Out of scope
- Drag-and-drop reordering
- Hover overlays / quick-actions menu
- Multi-select / checkboxes
- Skeleton loading state (will come with C3 or a later issue)

---

## A8 — `<OrderStatusStepper>`

**Phase A · Complexity: small · ~2h · Blocked by: A1**

### 🎯 Goal (plain English)
A horizontal 4-step progress indicator showing where a shopper order is in its lifecycle: Order Placed → Processing → Shipped → Delivered. Used on the order detail page.

### 🔧 Technical description
Build a stepper with 4 circular icons connected by lines. Active/completed steps are filled (green for Placed, brand magenta for Processing/Shipped); upcoming step is gray-outlined. Each step has a label and sublabel below.

### 📚 Required reading
- `docs/dashboard/figma/4449-1514-order-detail.png` — order detail page with stepper
- `docs/dashboard/spec.md` § "OrderStatusStepper"
- `src/components/dashboard/icons/OrderPlacedIcon.tsx`, `ProcessingIcon.tsx`, `ShippedIcon.tsx`, `DeliveredIcon.tsx` — reuse these glyphs

### 🔗 Dependencies
- Blocked by: A1
- Blocks: B1 (order detail)

### 📁 Files to create / modify
- **Create:** `src/components/dashboard/OrderStatusStepper.tsx`

### 🧩 Component API

```tsx
type StepKey = 'OrderPlaced' | 'Processing' | 'Shipped' | 'Delivered';

type OrderStatusStepperProps = {
  currentStep: StepKey;
};

export function OrderStatusStepper({ currentStep }: OrderStatusStepperProps): JSX.Element;
```

### 🎨 Visual specs
- 4 columns, equal width, gap between
- Each column: icon (48px circle) on top, then label (semibold 14px), then sublabel (12px `text-text-muted`)
- Connector: thin line, 2px, between adjacent circles' horizontal centers
- Step states:
  - **Completed** (current and all before): filled background, white glyph, connector line in token color
  - **Current**: same as completed but with slightly larger circle or subtle border emphasis
  - **Upcoming**: gray outlined circle, gray glyph, gray connector
- Step labels: Order Placed, Processing, Shipped, Delivered
- Sublabels:
  - Order Placed: "Order has been placed"
  - Processing: "Your order is being prepared"
  - Shipped: "Package is with the carrier"
  - Delivered: "Package has been delivered"

### ✅ Acceptance criteria
- [ ] Component exists, accepts `currentStep` prop
- [ ] All 4 steps render
- [ ] Steps at and before `currentStep` show filled state
- [ ] Steps after `currentStep` show outlined gray state
- [ ] Existing 4 icon components reused (don't recreate icons)
- [ ] `npx next build` passes

### 🧪 Manual testing
1. Add temporary test page with `<OrderStatusStepper currentStep="Shipped" />`
2. `npm run dev`, open the test page
3. Verify Order Placed (green), Processing (purple), Shipped (purple, current), Delivered (gray)
4. Change to `currentStep="Delivered"` — all 4 should be filled
5. Change to `currentStep="OrderPlaced"` — only first filled
6. Compare against `figma/4449-1514-order-detail.png` (Shipped state)
7. Delete the test page

### ⚠️ Out of scope
- Animation between states
- Estimated time/date per step
- Click-to-navigate-to-tracking interaction
- Vertical / mobile layout — desktop horizontal only for now

---

# Phase B — Restyle existing pages

All Phase B issues share the same shape: take an existing page, restyle it to match the Figma frame, wire it to the data layer, use the shell components. Common "out of scope" for all: any new flows, modals, or non-visual behavior changes — restyle only unless the issue specifically calls them out.

## B1 — Shopper Order Detail page

**Phase B · Complexity: medium · ~4h · Blocked by: A1-A8 (especially A8 stepper, A7 row, A6 shell)**

### 🎯 Goal (plain English)
The page a shopper sees when they click into a specific order from their orders list. Shows where the package is, shipping details, what they ordered, total, and payment method.

### 🔧 Technical description
Build `/profile/shopper/orders/[orderId]/page.tsx` matching Figma node `5192:4647` (`figma/5192-4647-order-detail-v2.png`) — the canonical v2 refresh. The original `4449:1514` (`figma/4449-1514-order-detail.png`) shows the same layout in v1 and is included for reference. Three card sections: order header + stepper, shipment details, order info table.

### 📚 Required reading
- `docs/dashboard/figma/5192-4647-order-detail-v2.png` — canonical v2 target
- `docs/dashboard/figma/4449-1514-order-detail.png` — v1 reference (same layout, earlier styling)
- `docs/dashboard/spec.md` § "OrderStatusStepper", page mappings
- `src/lib/data/repositories.ts` § `orders.getOrderDetail(orderNumber)`

### 🔗 Dependencies
- Blocked by: A1, A2, A6, A8
- Blocks: nothing

### 📁 Files to create / modify
- **Modify:** `src/app/profile/shopper/orders/[orderId]/page.tsx` — restyle entirely

### 🧩 Page structure

```tsx
export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const order = await orders.getOrderDetail(params.orderId);
  if (!order) return <NotFound />;
  return (
    <>
      <Breadcrumb> {/* "Your Orders > Order #X" */} </Breadcrumb>
      <Card> {/* Order # + StatusPill + OrderStatusStepper */} </Card>
      <Card> {/* Shipment Details: Carrier, Tracking, Shipping Address */} </Card>
      <Card> {/* Order Information table: Product | SKU | Qty | Unit | Total + Total Amount + Date + Payment */} </Card>
    </>
  );
}
```

### ✅ Acceptance criteria
- [ ] Page renders all 3 cards matching Figma
- [ ] Stepper shows correct state based on `order.status`
- [ ] Breadcrumb "Your Orders > Order #X" present
- [ ] Order Information table uses shadcn `<Table>` primitive (A3)
- [ ] Empty/missing data state: if `getOrderDetail` returns null, show "Order not found" message
- [ ] `npx next build` passes

### 🧪 Manual testing
1. `npm run dev`
2. Open `/profile/shopper/orders/ADM-2024-001007` (use a mock order ID from A2)
3. Verify breadcrumb shows correct order number
4. Verify stepper state matches the mock order's status
5. Verify Shipment Details card has carrier, tracking number, address
6. Verify Order Information table renders all line items with SKU, qty, unit, total
7. Verify Total Amount, Order Date, Payment Method ending in last4
8. Open `/profile/shopper/orders/NONEXISTENT` — should show "not found" gracefully
9. Compare against `figma/4449-1514-order-detail.png`

### ⚠️ Out of scope
- Cancel order action
- Reorder action
- Print invoice
- Live tracking updates

---

## B2 — Shopper All Orders page

**Phase B · Complexity: small · ~2h · Blocked by: A1-A7**

### 🎯 Goal
The shopper's "Your Orders" tab — list of all their past + current orders with thumbnail, ID, total, date, and status.

### 🔧 Technical description
Restyle `/profile/shopper/orders/page.tsx`. Replace existing markup with a list of `<OrderRow>` (A7) instances pulling from `orders.listShopperOrders()` (A2).

### 📚 Required reading
- `docs/dashboard/figma/4449-1650-all-orders.png`
- `src/app/profile/shopper/orders/page.tsx` — current implementation

### 🔗 Dependencies
- Blocked by: A1, A2, A6, A7
- Blocks: nothing

### 📁 Files to create / modify
- **Modify:** `src/app/profile/shopper/orders/page.tsx`

### ✅ Acceptance criteria
- [ ] Page renders a list of `<OrderRow>` from mock data
- [ ] Column headers (Total, Order date, Status) above the list, styled per spec (11px semibold uppercase tracking-wider `text-text-faint`)
- [ ] Empty state: if no orders, show "You haven't placed any orders yet" centered
- [ ] All rows have working chevron links to `/profile/shopper/orders/[orderNumber]`
- [ ] `npx next build` passes

### 🧪 Manual testing
1. Open `/profile/shopper/orders`
2. Verify ≥3 orders render, matching `figma/4449-1650-all-orders.png` visually
3. Click chevron on an order — navigates to that order's detail page
4. Temporarily empty the mock array in `mock-orders.ts` → page shows empty state. Revert.
5. Compare against Figma

### ⚠️ Out of scope
- Search, filter, sort
- Pagination
- Bulk actions

---

## B3 — Shopper Payment Methods page

**Phase B · Complexity: small · ~2h · Blocked by: A1, A2, A6 · ⚠️ Halt-gate before starting**

### 🎯 Goal
The "Your Payment" tab — shows the shopper's saved payment methods with an option to add a new one.

### 🔧 Technical description
Restyle `/profile/shopper/payment/page.tsx`. **Critical:** the Figma frame `4449:1668` (`figma/4449-1668-payment.png`) is currently a **stub** — header + tab nav present but the content area is empty. This means the design is undefined. The implementing agent **must halt** and ask the orchestrator what should populate the content area before writing code. Two reasonable defaults are listed under "Out of scope vs. allowed defaults" below.

### 📚 Required reading
- `docs/dashboard/figma/4449-1668-payment.png` — note: stub frame, content area is empty in the design
- `docs/dashboard/spec.md` § "Form patterns"
- `src/app/profile/shopper/payment/page.tsx` — current implementation (has a card form + billing address)

### 🔗 Dependencies
- Blocked by: A1, A2, A3 (input), A6, **product clarification on content area**
- Blocks: nothing

### 📁 Files to create / modify
- **Modify:** `src/app/profile/shopper/payment/page.tsx`

### 🚧 Halt gate (before starting)
The agent must ask the orchestrator: "The Figma frame for B3 is a stub. Which of these do you want me to build in the content area?
- (a) Keep the existing card form + billing address from `/profile/shopper/payment/page.tsx` (today's implementation), restyled to match the new shell
- (b) List of saved payment methods + 'Add payment method' CTA (requires defining a PaymentMethod type in the data layer)
- (c) Something else (specify)"

### ✅ Acceptance criteria
- [ ] Halt gate above resolved before starting
- [ ] Page renders the shell (header + tabs) matching the Figma frame
- [ ] Content area implements whichever option was approved
- [ ] Uses shadcn `<Input>` (A3) for any text fields
- [ ] "Save" / "Add" button is brand-magenta filled
- [ ] Any form follows the dirty-state pattern from B4
- [ ] `npx next build` passes

### 🧪 Manual testing
1. Open `/profile/shopper/payment`
2. Confirm header + tabs match `figma/4449-1668-payment.png`
3. Confirm content area matches the option approved by the orchestrator
4. If a form is present, verify dirty-state behavior

### ⚠️ Out of scope
- Real payment processor integration (Stripe, etc.)
- Card validation logic — visual only
- Address autocomplete
- A new PaymentMethod data shape, unless option (b) is approved

---

## B4 — Shopper Account Settings page

**Phase B · Complexity: small-medium · ~3h · Blocked by: A1, A2, A3 (input), A6**

### 🎯 Goal
The "Account Settings" tab — form for Name, Email, Password, Shipping Address. Save button stays disabled until the shopper actually edits a field.

### 🔧 Technical description
Restyle `/profile/shopper/settings/page.tsx`. Form fields wired to `user.getProfile()` for initial values. `user.updateProfile(patch)` called on submit (stubbed). **Critical:** the Save Changes button is disabled until the form is dirty (per designer Thanh Nguyen's sticky note).

### 📚 Required reading
- `docs/dashboard/figma/4449-1734-settings.png` — settings page with yellow sticky note about dirty-state
- `docs/dashboard/spec.md` § "Form patterns"
- `src/app/profile/shopper/settings/page.tsx`

### 🔗 Dependencies
- Blocked by: A1, A2, A3, A6
- Blocks: nothing

### 📁 Files to create / modify
- **Modify:** `src/app/profile/shopper/settings/page.tsx`

### 🧩 Implementation hints
- Use plain controlled inputs with `useState`. Initial values from `user.getProfile()`.
- Track an `initialValues` snapshot. `isDirty` = `JSON.stringify(currentValues) !== JSON.stringify(initialValues)`.
- Button: `disabled={!isDirty}`. Style: when disabled, `opacity-50 cursor-not-allowed`.
- On submit: `await user.updateProfile(diff)`. After success, snapshot becomes the new initialValues (so dirty resets).

### ✅ Acceptance criteria
- [ ] Page renders form matching `figma/4449-1734-settings.png`
- [ ] Initial values populated from `user.getProfile()`
- [ ] Save Changes button is disabled when no fields have been edited
- [ ] Save Changes button enables as soon as any field is edited
- [ ] Clicking Save calls `user.updateProfile(patch)` and resets the dirty state
- [ ] City/State/Zip rendered in a 3-column grid
- [ ] Password field uses `type="password"`
- [ ] `npx next build` passes

### 🧪 Manual testing
1. Open `/profile/shopper/settings`
2. Verify all fields pre-populated with Tatiana's mock data
3. Verify Save Changes button is **disabled** initially
4. Change the Name field — button **enables**
5. Click Save — button disables again (form no longer dirty)
6. Change Name back to original — button stays disabled (because submitted value is now the baseline)
7. Compare against `figma/4449-1734-settings.png`

### ⚠️ Out of scope
- Password change flow (current vs. new password fields, validation)
- Email verification
- Address autocomplete

---

## B5 — Merchant Active Listings page

**Phase B · Complexity: small-medium · ~3h · Blocked by: A1, A2, A4, A6, A7**

### 🎯 Goal
The merchant's main "Active Listings" tab — shows their currently-listed items with status pills, an edit/delete action per item, a "Post a Listing" button, and a banner if any listings are pending approval.

### 🔧 Technical description
Restyle `/profile/merchant/active-listings/page.tsx`. Use `<ListingRow>` (A7) with `actions="live"`. Show a yellow info banner if any listings have `status === 'pending'`. Show "Post a Listing" CTA at top-right.

### 📚 Required reading
- `docs/dashboard/figma/4570-2528-active-listings.png`
- `src/app/profile/merchant/active-listings/page.tsx`

### 🔗 Dependencies
- Blocked by: A1, A2, A4, A6, A7
- Blocks: nothing

### 📁 Files to create / modify
- **Modify:** `src/app/profile/merchant/active-listings/page.tsx`
- **Possibly create:** `src/components/dashboard/ListingsHeader.tsx` (Card with title + count + CTA button)

### ✅ Acceptance criteria
- [ ] Renders matching `figma/4570-2528-active-listings.png`
- [ ] Pending banner shown when any listing's status is pending
- [ ] "Post a Listing" button (brand-magenta filled) navigates to `/profile/merchant/add-listing`
- [ ] Each row uses `<ListingRow actions="live">` from A7
- [ ] Edit pencil navigates to `/profile/merchant/edit-listing?id=X` (or similar)
- [ ] Delete trash shows a confirmation Dialog (A3) and stub-deletes via `listings.delete(id)` — add the stub method to A2 if missing
- [ ] Empty state: "No active listings yet" + Post a Listing CTA
- [ ] `npx next build` passes

### 🧪 Manual testing
1. Open `/profile/merchant/active-listings`
2. Verify ≥5 listings render with status pills
3. Verify pending banner is visible (since mock data has a pending listing)
4. Click "Post a Listing" — navigates to add-listing page
5. Click pencil on a row — navigates to edit page (or fires console.log if edit page not built yet)
6. Click trash — confirmation dialog opens; cancel and confirm both work
7. Compare against Figma

### ⚠️ Out of scope
- Real deletion (stub only)
- Sorting, filtering, bulk actions
- Drag-and-drop reorder

---

## B6 — Merchant Active Rentals page

**Phase B · Complexity: small · ~2h · Blocked by: A1, A2, A4, A6, A7**

### 🎯 Goal
The "Active Rentals" tab — shows the merchant's currently-rented-out items, who rented them, and rental status.

### 🔧 Technical description
Restyle `/profile/merchant/rentals/page.tsx` matching `figma/4570-3591-active-rentals.png`. The frame shows a Card with header "Active Rentals" + "4 orders" subtitle, then a table with column headers ORDER / TOTAL / DUE DATE / STATUS, then 4 rows each showing thumbnail(s) + Order #YK-XXXX + buyer name + total + due date + StatusPill (Live / Pending / Rented / Returned) + chevron. Reuse `<OrderRow showBuyerName>` (A7) wired to a new repository method `rentals.listActive()` (add to A2 if not already there).

### 📚 Required reading
- `docs/dashboard/figma/4570-3591-active-rentals.png` — canonical target
- `src/app/profile/merchant/rentals/page.tsx`

### 🔗 Dependencies
- Blocked by: A1, A2, A4, A6, A7
- Blocks: nothing

### 📁 Files to create / modify
- **Modify:** `src/app/profile/merchant/rentals/page.tsx`
- **Modify:** `src/lib/data/repositories.ts` — add `rentals.listActive()` if needed

### ✅ Acceptance criteria
- [ ] Renders Card with title "Active Rentals" + total count subtitle ("N orders")
- [ ] Table column headers: ORDER / TOTAL / DUE DATE / STATUS (uppercase, tracking-wider, `text-text-faint`, 11px semibold)
- [ ] Each row uses `<OrderRow showBuyerName>` from A7
- [ ] All 4 rental statuses represented in mock data: Live, Pending, Rented, Returned
- [ ] Empty state: "No active rentals"
- [ ] `npx next build` passes

### 🧪 Manual testing
1. Open `/profile/merchant/rentals`
2. Verify ≥4 active rental rows visible
3. Each status pill variant present
4. Compare against `figma/4570-3591-active-rentals.png`

### ⚠️ Out of scope
- Accept/reject rental requests (handled by `<RentalRequest>` elsewhere — see existing `src/components/dashboard/RentalRequest.tsx`)
- Messaging with renter

---

## B7 — Merchant Past Listings page

**Phase B · Complexity: small · ~2h · Blocked by: A1, A2, A4, A6, A7**

### 🎯 Goal
The merchant's archive — listings that have ended (rental period over or merchant delisted them). Read-only.

### 🔧 Technical description
Restyle `/profile/merchant/past-listings/page.tsx` matching `figma/4570-3870-past-listings.png`. The frame shows a Card with header "Past Listings" + "2 listings" subtitle and a list of ended `<ListingRow>` instances. **Note:** in the canonical PNG the underlined tab label is "Active Rentals" — this is almost certainly a designer artifact (the page IS Past Listings as titled in the card). Implementing agent should ignore the highlighted-tab quirk in the Figma frame and use the correct "Past Listings" active-tab state (no merchant tab is named "Past Listings" — see DashboardTabs from A6; this page does not appear in the merchant tab nav, so it should NOT highlight any tab).

### 📚 Required reading
- `docs/dashboard/figma/4570-3870-past-listings.png` — canonical target (ignore the mis-highlighted tab)
- `docs/dashboard/figma/4577-3661-listing-row.png` — listing row Ended variant
- `src/app/profile/merchant/past-listings/page.tsx`

### 🔗 Dependencies
- Blocked by: A1, A2, A4, A6, A7
- Blocks: nothing

### 📁 Files to create / modify
- **Modify:** `src/app/profile/merchant/past-listings/page.tsx`

### ✅ Acceptance criteria
- [ ] Renders Card with title "Past Listings" + count subtitle ("N listings")
- [ ] Renders past listings (status === 'ended') as rows
- [ ] All rows show "Listing ended" pill, NO action icons
- [ ] Empty state: "No past listings"
- [ ] None of the merchant tabs (Active Listings / Active Rentals / Your Earnings) shows as active when on this page
- [ ] `npx next build` passes

### 🧪 Manual testing
1. Open `/profile/merchant/past-listings`
2. Confirm only ended listings shown
3. Confirm no pencil/trash icons
4. Confirm no tab in the merchant tab row appears active
5. Compare against `figma/4570-3870-past-listings.png` (ignoring its tab-highlight quirk)

### ⚠️ Out of scope
- Restore listing action
- Export to CSV

---

## B8 — Merchant Your Earnings page

**Phase B · Complexity: medium · ~4h · Blocked by: A1, A2, A3 (table), A4, A6**

### 🎯 Goal
The "Your Earnings" tab — shows the merchant their total earnings, what's pending, and a history table of every order they've earned from.

### 🔧 Technical description
Restyle `/profile/merchant/earnings/page.tsx` matching `figma/4570-3922-earnings.png`. Two summary cards (Total Earnings, Pending Earnings) above a "Earnings History" table.

### 📚 Required reading
- `docs/dashboard/figma/4570-3922-earnings.png`
- `docs/dashboard/spec.md` § Page mappings (note Q3 ambiguity)
- `src/app/profile/merchant/earnings/page.tsx`

### 🔗 Dependencies
- Blocked by: A1, A2, A3, A4, A6, and Q3 resolved
- Blocks: nothing

### 📁 Files to create / modify
- **Modify:** `src/app/profile/merchant/earnings/page.tsx`
- **Possibly create:** `src/components/dashboard/EarningsSummaryCard.tsx` (reusable for Total + Pending)

### 🧩 Page structure

```tsx
export default async function EarningsPage() {
  const summary = await earnings.getSummary();
  const history = await earnings.getHistory();
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <EarningsSummaryCard title="Total Earnings" value={summary.total} sub={`Since ${summary.sinceDate}`} />
        <EarningsSummaryCard title="Pending Earnings" value={summary.pending} sub={`From Order #${summary.pendingOrderRef}`} />
      </div>
      <Card>
        <h2>Earnings History</h2>
        <p>{history.length} orders</p>
        <Table>...</Table>
      </Card>
    </>
  );
}
```

### ✅ Acceptance criteria
- [ ] Total Earnings card shows formatted currency
- [ ] Pending Earnings card shows formatted currency + pending order ref
- [ ] Earnings History table renders matching Figma: columns Order | Total | Due Date | Status
- [ ] Status column uses `<StatusPill>` (A4) with `live/pending/rented/returned` variants
- [ ] Empty state: "No earnings history yet"
- [ ] `npx next build` passes

### 🧪 Manual testing
1. Open `/profile/merchant/earnings`
2. Verify two summary cards with correct values
3. Verify history table with ≥4 rows
4. Verify status pills per row
5. Compare to `figma/4570-3922-earnings.png`

### ⚠️ Out of scope
- Date range filter
- CSV export
- Withdraw/payout action
- Charts/graphs

---

## B9 — Merchant List an Item page

**Phase B · Complexity: medium-large · ~6h · Blocked by: A1, A2, A3 (input)**

### 🎯 Goal
The merchant's "Post a Listing" form — multi-photo upload, item details (name, category, size, brand), pricing, rental duration radio buttons, and a date-range availability calendar. Submission stays disabled until the form is dirty.

### 🔧 Technical description
Restyle `/profile/merchant/add-listing/page.tsx` (and `/edit-listing/page.tsx` if it uses the same form). Match `figma/4694-3750-list-an-item.png`. **Critical sticky notes from Thanh Nguyen:**
- Default state: no radio options selected
- Selected-date text auto-updates as user selects calendar dates ("Selected date: Mar 6 - Mar 13, Apr 6 - Apr 20")

### 📚 Required reading
- `docs/dashboard/figma/4694-3750-list-an-item.png`
- `docs/dashboard/spec.md` § "List an Item form"
- `src/app/profile/merchant/add-listing/page.tsx`
- `src/components/ui/calendar.tsx` — existing react-day-picker setup; check if it supports range mode

### 🔗 Dependencies
- Blocked by: A1, A2, A3
- Blocks: nothing

### 📁 Files to create / modify
- **Modify:** `src/app/profile/merchant/add-listing/page.tsx`
- **Possibly create:** `src/components/dashboard/PhotoUploadSlot.tsx` — single upload square
- **Possibly create:** `src/components/dashboard/RentalDurationRadioGroup.tsx`
- **Modify:** `src/components/ui/calendar.tsx` if needed to support range selection (`react-day-picker` supports `mode="range"`)

### 🧩 Form sections to implement

1. **Photos:** 5 (or 6) square upload slots labeled Cover / Front / Back / Side / Detail. Each renders a placeholder camera icon + label until clicked, then opens a file picker (the file is stored in component state for now; no upload). Min 1 photo required (validation later).
2. **Item Name:** plain text input
3. **Tags:** Category dropdown, Size (US) dropdown, Brand dropdown (use existing shadcn `<Select>` if available, or create stubbed dropdowns)
4. **Pricing:** Retail Price ($) input, "How much you paid for the item" input (optional)
5. **Rental Price and Duration:** 4 radio options — 4 days, 7 days, 14 days, 30 days. **Default state: none selected** (do NOT pre-select the first option).
6. **Availability calendar:** 2-month calendar (react-day-picker `mode="range" numberOfMonths={2}`). User can select a range. Below the calendar, a "Selected date: X - Y" line auto-updates.
7. **Footer:** "Back to Listings" outlined button (navigates to `/profile/merchant/active-listings`) + "Publish Listing" brand-magenta filled button (calls `listings.create(formData)` stub).

### Dirty state behavior
The Publish Listing button is enabled only when:
- At least 1 photo uploaded
- Item Name is non-empty
- Category, Size, Brand all selected
- Retail Price > 0
- A rental duration radio is selected
- At least one calendar date is selected

(Same pattern as B4; track form state, compute `isValid`, button disabled when `!isValid`.)

### ✅ Acceptance criteria
- [ ] Photo slots render with Cover / Front / Back / Side / Detail labels
- [ ] Clicking a slot opens file picker, selected file shows as preview thumbnail
- [ ] All form fields work
- [ ] Default: no radio selected
- [ ] Calendar supports range selection
- [ ] "Selected date: X - Y" line below calendar updates as user selects
- [ ] Publish Listing button disabled until form is valid
- [ ] Clicking Publish Listing calls `listings.create(formData)` stub and shows a console.log/toast confirming
- [ ] Back to Listings navigates correctly
- [ ] `npx next build` passes

### 🧪 Manual testing
1. Open `/profile/merchant/add-listing`
2. Verify all sections render matching `figma/4694-3750-list-an-item.png`
3. Verify no radio is pre-selected
4. Try to click Publish — button should be disabled
5. Fill in Name, click a category (and size, brand) — button still disabled
6. Click a rental duration — button now requires photos + dates
7. Select 2 dates on the calendar — "Selected date: ..." line updates
8. Select multiple ranges (Mar 6-13, Apr 6-20) — line shows both
9. Click a photo slot, pick any image — appears as preview
10. Verify Publish button finally enables when all conditions met
11. Click Publish — console.log shows form data
12. Click Back to Listings — navigates correctly

### ⚠️ Out of scope
- Real image upload (S3, etc.) — files just held in state
- Auto-pricing suggestion ("Our recommended price is based on your item's retail value...") — show the static text but don't compute
- Edit-listing flow that loads existing data — separate issue if needed
- Form validation error messages — just disable the button for now

---

# Phase C — New pages

## ~~C1 — Shopper Order Entry / dashboard index page~~ — FOLDED INTO B1

**Status: deleted (folded into B1).**

This issue was originally scoped as a separate "shopper dashboard index" page, on the assumption that Figma frame `5192:4647` ("Order entry") was a summary view distinct from the Order Detail page. On review of the exported PNG (`figma/5192-4647-order-detail-v2.png`), `5192:4647` is the **v2 refresh of the Order Detail page** — same content and layout as `4449:1514` with refined styling. There is no separate shopper dashboard index in the canonical design; `/profile/shopper` continues to redirect to `/orders` like today.

`figma/5192-4647-order-detail-v2.png` is now listed under B1's Required Reading as the canonical v2 target.

**Action:** skip this issue. Continue to C2.

---

## C2 — Shopper Wishlist page

**Phase C · Complexity: medium · ~5h · Blocked by: A1, A6, Q1 resolved**

### 🎯 Goal
A full "Wishlist" page where the shopper sees every item they've hearted, with the same filter sidebar as the shop browse experience. Items render as a product grid with brand tag overlays on the thumbnails.

### 🔧 Technical description
Build `/profile/shopper/wishlist/page.tsx` matching `figma/4449-1696-wishlist.png`. The page has:
- A **left sidebar with filters**: Sort by dropdown, "RENT BY" header with "Clear all" link, and collapsible filter groups for Gender (Men / Women), Category, Brand, Occasion, Colour, Size, Availability. A black "SHOW RESULTS" button at the bottom of the sidebar.
- A **right-side grid of liked items** with the header "Wishlist 28 items" — 3 columns (responsive). Each item card has the thumbnail (with brand tag overlaid top-left, e.g. "ADIDAS", "VUORI", "UNDER ARMOR"), a heart icon top-right (filled = liked), item name below, and "From CAD$ XX.XX" price.

This is closer to the **product catalog** page than a simple liked-items list. Reuse existing `src/components/filters/FilterSidebar.tsx` and `src/components/shop/ProductCard.tsx` / `ProductGrid.tsx` if they fit; otherwise extend them.

⚠️ See Q1 — confirm with orchestrator whether `useLikedItems` localStorage stays or migrates to backend. The agent should also confirm with the orchestrator: are the filter sidebar's filters supposed to actually filter the wishlist (client-side), or just be present visually for parity with the shop browse page?

### 📚 Required reading
- `docs/dashboard/figma/4449-1696-wishlist.png` — canonical target (note: brand tags on thumbnails, filter sidebar layout)
- `src/lib/hooks/useLikedItems.ts` — current localStorage hook
- `src/components/filters/FilterSidebar.tsx`, `src/components/filters/FilterButton.tsx` — existing filter UI to reuse
- `src/components/shop/ProductCard.tsx`, `src/components/shop/ProductGrid.tsx` — existing product card to reuse/extend
- `src/lib/data/types.ts` (from A2) — may need extending with `brandTag: string` on Listing/Product

### 🔗 Dependencies
- Blocked by: A1, A6, Q1 resolved, filter-sidebar reuse confirmed
- Blocks: nothing

### 📁 Files to create / modify
- **Create:** `src/app/profile/shopper/wishlist/page.tsx`
- **Modify (likely):** `src/components/shop/ProductCard.tsx` — add brand-tag overlay variant if not present
- **Modify (possibly):** `src/components/filters/FilterSidebar.tsx` — make reusable across shop + wishlist contexts
- **Note:** based on `figma/4449-1994-shopper-tabs.png`, the canonical shopper tab nav has 3 tabs (Your Orders / Your Payment / Account Settings) — **Wishlist is NOT a dashboard tab**. The page is reached via the heart icon in `<AppHeader>` (A5). Confirm with orchestrator before adding a Wishlist tab to `<DashboardTabs>`.

### ✅ Acceptance criteria
- [ ] `/profile/shopper/wishlist` route exists
- [ ] Page header: "Wishlist N items" matching the Figma
- [ ] Filter sidebar renders on the left with Sort by, RENT BY header, and the 7 filter groups (Gender, Category, Brand, Occasion, Colour, Size, Availability)
- [ ] "Clear all" link clears all filter selections
- [ ] Right side renders a 3-column grid (responsive — collapses to 2 / 1 columns at smaller widths)
- [ ] Each card shows thumbnail + brand tag overlay (top-left, all-caps, e.g. "ADIDAS") + filled heart top-right + name + price
- [ ] Clicking the heart removes the item from the wishlist (and from the grid)
- [ ] Empty state: "Your wishlist is empty. Browse items to add some." — only shown when `useLikedItems` returns 0 items
- [ ] "SHOW RESULTS" button at bottom of sidebar (function: if filters are decided client-side, apply them; otherwise just a visual element matching Figma)
- [ ] No new tab added to `<DashboardTabs>` unless orchestrator approves
- [ ] `npx next build` passes

### 🧪 Manual testing
1. From the homepage or product pages, heart at least 8 items
2. Open `/profile/shopper/wishlist`
3. Verify all 8+ items show in the grid
4. Verify brand tags overlay correctly on thumbnails
5. Verify filter sidebar renders all 7 filter groups
6. Click a filter group to expand it — verify checkboxes render (Men / Women under Gender)
7. Click "Clear all" — filter selections clear
8. Click the heart on a card — item is removed
9. Refresh — removed item stays gone (localStorage persistence)
10. Empty all hearts — empty state appears
11. Resize browser — grid columns collapse responsively
12. Compare against `figma/4449-1696-wishlist.png`

### ⚠️ Out of scope
- Add-to-cart from wishlist
- Wishlist sharing / public wishlist
- Saved-search subscriptions
- Real backend (unless Q1 resolved otherwise)

---

## C3 — Shopper mobile responsive layer

**Phase C · Complexity: medium · ~5h · Blocked by: A6, A7, B1, B2 (need pages to make responsive)**

### 🎯 Goal
Make the shopper dashboard usable on mobile screens. Today everything is desktop-first.

### 🔧 Technical description
Add Tailwind responsive classes across dashboard components and pages so layouts collapse cleanly at `sm`, `md`, `lg` breakpoints. The canonical reference for mobile is `figma/5193-5040-mobile-order-detail.png` — the mobile rendering of the Order Detail page (with a hamburger menu navbar, condensed Profile Header, vertical stepper, stacked cards). Apply the same responsive principles to the other shopper pages.

### 📚 Required reading
- `docs/dashboard/figma/5193-5040-mobile-order-detail.png` — canonical mobile reference (Order Detail at 375px width)
- All shopper dashboard pages (`B1`, `B2`, `B3`, `B4`, `C2`)
- `docs/dashboard/figma/4449-1927-navbar.png` — desktop navbar (mobile uses hamburger replacement; see existing `src/components/dropdown-navbar.tsx`)

### 🔗 Dependencies
- Blocked by: A6, A7, B-series (need pages to make responsive)
- Blocks: nothing

### 📁 Files to modify
- Existing shopper page files (B1, B2, B3, B4, C2)
- `src/components/dashboard/{DashboardShell,ProfileHeader,DashboardTabs,OrderRow,ListingRow}.tsx`
- Possibly `src/components/app-header.tsx` (A5) — mobile hamburger behavior

### ✅ Acceptance criteria
- [ ] All shopper pages render without horizontal scroll at 375px width (iPhone)
- [ ] Greeting size shrinks on mobile (40px → 24px) and mode-switch text drops to its own line
- [ ] Tabs become horizontally scrollable or stack on mobile
- [ ] Order rows stack content vertically on mobile (thumbnail above text, status pill below, etc.)
- [ ] Order Detail stepper switches to vertical orientation on mobile (per `figma/5193-5040-mobile-order-detail.png`)
- [ ] Order Information table on Order Detail becomes a per-row stacked layout on mobile (label + value pairs, not tabular columns)
- [ ] Wishlist grid collapses to 2 columns then 1 column at smaller widths
- [ ] Navbar shows hamburger menu instead of full link list at mobile widths (existing pattern via `dropdown-navbar.tsx`)
- [ ] `npx next build` passes

### 🧪 Manual testing
1. `npm run dev`
2. Open each shopper page in Chrome devtools, resize to 375px width
3. Confirm no horizontal scroll
4. Confirm all content readable
5. On Order Detail at 375px, verify stepper is vertical and order info is stacked
6. On Wishlist at 375px, verify grid is 1 column and filter sidebar collapses (either to top or behind a "Filter" button — confirm with orchestrator)
7. Test at 768px (tablet) and 1440px (desktop) for regressions
8. Compare mobile views to `figma/5193-5040-mobile-order-detail.png`

### ⚠️ Out of scope
- Merchant mobile (separate issue if needed)
- Mobile-only features (camera capture, biometric login)
- Native-app-style transitions

---

# Phase D — Deferred (decide whether to do)

## D1 — Shopping bag + Cart confirmation flow

**Phase D · Complexity: large · ~8h · Blocked by: A1-A7, Q6 resolved**

### 🎯 Goal
A full-page shopping bag (cart) view and a post-checkout confirmation page.

### 🔧 Technical description
Build `/cart` (or `/profile/shopper/bag` — decide which) and a `/checkout/confirmation` view. Match Figma frames `4449:1671` (shopping bag full view) and `4449:1762` (cart confirmation).

These touch checkout flow which isn't strictly "dashboard." Whether to build now depends on Q6.

### ⚠️ Out of scope by default
- Payment processing
- Tax calculation
- Shipping calculation

(Detail spec deferred until Q6 decision.)

---

## D2 — Payment Details modal

**Phase D · Complexity: small · ~2h · Blocked by: A3 (dialog), B3**

### 🎯 Goal
A modal for entering / editing a payment method, opened from the Payment Methods page.

### 🔧 Technical description
Build a `<PaymentDetailsDialog>` component matching Figma frame `4449:1813`. Wire to a trigger on the Payment Methods page (B3).

### ⚠️ Out of scope
- Real payment processing
- Tokenization
- CVV validation logic

(Detail spec deferred until Q6 decision.)

---

# Appendix: Standing rules recap

Per repository `.claude/CLAUDE.md`:

- **Tests are mandatory** for production work — we're explicitly waiving component tests for this UI plan while the data layer is mocked. As soon as a real backend lands, the corresponding tests should be added.
- **Build and lint must pass** for every PR. Run `npx next build` and `npm run lint` (after installing eslint if missing — `npm install` in repo root brings it).
- **One issue → one PR** by default. Issues may batch only if they share root cause, are all small, and the combined diff stays under ~1000 lines.
- **PRs target `main`.** Always `gh pr create --base main`.
- **Halt gates apply.** If an issue's requirements are ambiguous (especially the open Q1-Q6 above), the AI agent should NOT guess — halt and ask the orchestrator.

---

**File version:** v1, 2026-06-02
**Source spec:** `docs/dashboard/spec.md`
**Maintainer:** add your name here when you edit this file
