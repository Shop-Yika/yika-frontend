# Yika Dashboard — Design Spec

This is a handoff document for Claude Code sessions implementing the dashboard against the canonical Figma file. The goal is **pixel-faithful** implementation — brand colors, fonts, spacing, and component states must match exactly.

## Sources of truth

- **Figma file:** `xLH0hldYvBKAbbGBwqHKh6` — "Yika Product Designs"
- **Canonical dashboard frame:** `4575:3593` (root, 19674×16011 px) — contains 7 sections covering Shopper Mode, Merchant Mode, Components, and revision iterations
- **Frame URL pattern:** `https://www.figma.com/design/xLH0hldYvBKAbbGBwqHKh6/Yika-Product-Designs?node-id=<id-with-dash>` (replace `:` with `-`)
- **Local exports of key frames:** `docs/dashboard/figma/*.png` — these were exported manually (the Figma MCP Starter plan caps at 6 reads/month and we exhausted it during initial planning)

### Figma node → local PNG mapping

| Figma node | Local PNG | What it is |
|---|---|---|
| `4449:1927` | `figma/4449-1927-navbar.png` | Global Nav Bar — 3 states stacked (default, hover, active) |
| `4573:4672` | `figma/4573-4672-profile-header.png` | Profile Header — Shopper Mode + Merchant Mode variants |
| `4449:1994` | `figma/4449-1994-shopper-tabs.png` | Dashboard Nav (shopper tabs) — Your Orders / Your Payment / Account Settings, 3 active states |
| `4573:4652` | `figma/4573-4652-merchant-tabs.png` | Merchant Nav — Active Listings / Active Rentals / Your Earnings, 4 states |
| `4577:3661` | `figma/4577-3661-listing-row.png` | Listing row component — Live + Listing-ended variants |
| `4577:3608` | `figma/4577-3608-order-row.png` | Order/Rental row — single-item + multi-item, Returned status |
| `4449:1514` | `figma/4449-1514-order-detail.png` | Shopper Order Detail — stepper + shipment details + order info table |
| `4449:1650` | `figma/4449-1650-all-orders.png` | Shopper All Orders list |
| `4449:1734` | `figma/4449-1734-settings.png` | Shopper Settings — name/email/password/address form |
| `4449:1786` | `figma/4449-1786-notifications-drawer.png` | Notifications drawer (overlay on a product page) |
| `4570:2528` | `figma/4570-2528-active-listings.png` | Merchant Active Listings |
| `4570:3922` | `figma/4570-3922-earnings.png` | Merchant Earnings (tab label may say "Active Rentals" — ambiguity flagged below) |
| `4694:3750` | `figma/4694-3750-list-an-item.png` | Merchant "List an item" — photo upload + form + calendar |
| `4449:1668` | `figma/4449-1668-payment.png` | Shopper "Your Payment" tab — stub frame, content area is empty in design |
| `4570:3591` | `figma/4570-3591-active-rentals.png` | Merchant Active Rentals — list of rentals with Live/Pending/Rented/Returned status |
| `4570:3870` | `figma/4570-3870-past-listings.png` | Merchant Past Listings — ended items (active tab label in frame is mis-highlighted as "Active Rentals" — content is Past Listings) |
| `5192:4647` | `figma/5192-4647-order-detail-v2.png` | Shopper Order Detail v2 refresh — same content/layout as `4449:1514`, refined styling |
| `4449:1696` | `figma/4449-1696-wishlist.png` | Shopper Wishlist — filter sidebar (Gender / Category / Brand / Occasion / Colour / Size / Availability) + grid of liked items with brand tags overlaid |
| `5193:5040` | `figma/5193-5040-mobile-order-detail.png` | Mobile Order Detail — responsive variant of the order detail page (Figma name "MobileOrderEntry") |

**Note:** PNG paths are relative to this file (`docs/dashboard/`). From repo root they are `docs/dashboard/figma/<name>.png`.

## Brand colors

These are already in the codebase via hard-coded hex; the spec preserves them rather than retokenizing.

| Token | Hex | Used for |
|---|---|---|
| **Brand magenta (deep)** | `#8C2D8B` | Primary CTAs, @handles, Shipped status text/border |
| **Brand lavender (light)** | `#B361A6` | "Tatiana" italic serif accent |
| Page background | `#FFFDF7` | Warm-white body bg (set in `globals.css` body) |
| Card background | `#FFFFFF` | All cards/rows |
| Border | `#E5E7EB` | Standard border |
| Border subtle | `#F3F4F6` | Table row dividers |
| Text primary | `#111827` | Headings, body |
| Text muted | `#6B7280` | Subtitles, secondary info |
| Text faint | `#9CA3AF` | Table column headers, meta |

### Status pill palette

| Variant | Dot | Border | Background | Text |
|---|---|---|---|---|
| Live / Delivered (green) | `#15803D` | `#15803D` | `#F0FDF4` | `#15803D` |
| Delivered (olive variant on shopper orders) | `#414E32` | `#414E32` | `#F8FAE8` | `#414E32` |
| Shipped (brand magenta) | `#8C2D8B` | `#8C2D8B` | `#F5DBEA` | `#8C2D8B` |
| Pending (yellow) | `#B45309` | `#D97706` | `#FFFBEB` | `#B45309` |
| Rented (orange) | `#EA580C` | `#EA580C` | `#FFF7ED` | `#EA580C` |
| Returned / Ended (gray) | `#9CA3AF` | `#E5E7EB` | `#F9FAFB` | `#6B7280` |

(The existing `src/components/dashboard/StatusBadge.tsx` already encodes these. Reuse it — don't reimplement.)

## Typography

All five fonts are already loaded in `src/app/layout.tsx` via `next/font/google`, plus Satoshi via CDN in `<head>`:

| Family | Source | CSS var | Used for |
|---|---|---|---|
| **Satoshi** | Fontshare CDN | `font-family: 'Satoshi'` (set on `body`) | All UI body text (default) |
| **Newsreader** | next/font/google | `--font-newsreader` → `font-newsreader` Tailwind class | "Tatiana" italic accent in Profile Header |
| Geist Sans | next/font/google | `--font-geist-sans` | Available but unused on dashboard |
| Geist Mono | next/font/google | `--font-geist-mono` | Available but unused |
| Averia Serif Libre | next/font/google | `--font-averia` | Used for marketing pages, not dashboard |
| Inter | next/font/google | `--font-inter` | Available but unused on dashboard |

### Type scale (from Figma observation)

| Use | Size | Weight | Notes |
|---|---|---|---|
| "Hey there, Tatiana!" greeting | ~40px desktop / 24px mobile | semibold | "Tatiana" is **Newsreader italic** + `#B361A6` |
| Page section headings ("Active Listings", "Order Information") | ~20-24px | semibold | Satoshi |
| Card titles ("Order #YK-...", item names) | ~18-20px | semibold | Satoshi |
| Body / meta | ~14-16px | 400-500 | Satoshi |
| Column headers in tables | 11px | semibold | uppercase, tracking-wider, `#9CA3AF` |
| Status pill labels | 12px | medium | |
| Mode-switch text ("You're in Shopper Mode") | 14px | regular | Switch link is underlined |

## Components — design patterns

### NavBar (`figma/4449-1927-navbar.png` / Figma `4449:1927`)

**Status: existing global navbar `src/components/navbar.tsx` is ~80% there. Needs one addition.**

- Fixed top-0, full-width, 76px tall, `bg-[#FFFDF7]`, z-index high
- Left: logo + 4 nav links (HOME / ABOUT / HOW IT WORKS / CONTACT US)
- Right: 4 icons — **heart, bell, person/avatar, cart**
- **Gap vs current code:** current navbar has 3 right-side icons (heart, person, cart). **The bell needs to be added** between heart and person. The bell triggers the Notifications drawer (see below).
- Heart icon has 3 visual states (outlined, outlined-hover, filled-active) — already supported via `text-primary` toggle in the existing code.

### Profile Header (`figma/4573-4672-profile-header.png` / Figma `4573:4672`)

**Status: existing `src/app/profile/layout.tsx` has a version; needs minor adjustments + replace `<Modes>` with the text-link pattern.**

- Layout: avatar (circular, ~80px) + greeting text + mode-switch text — all in one row, wraps on mobile
- Greeting: `Hey there, <span>Tatiana!</span>`
  - Main: Satoshi semibold, ~40px desktop / 24px mobile, `text-[#111827]`
  - "Tatiana": **Newsreader italic**, same size, `text-[#B361A6]`
- Mode-switch line: small text (~14px) `text-[#6B7280]`:
  - When shopper: "You're in Shopper Mode. **Switch to Merchant Mode**"
  - When merchant: "You're in Merchant Mode. **Switch to Shopper Mode**"
  - The "Switch to X" portion is a `<Link>`, underlined, `text-[#111827]` (or brand depending on hover) — NOT bold-and-also-underlined like current implementation; it's just an underlined text link.
- The current `<Modes>` component (`src/components/dashboard/modes.tsx`) renders two separate items and bolds the inactive one — should be **replaced** with a single text+link pattern.

### DashboardTabs (`figma/4449-1994-shopper-tabs.png` shopper / `figma/4573-4652-merchant-tabs.png` merchant)

**Status: existing `src/components/dashboard/tabs.tsx` works structurally. Need to verify visuals.**

- Horizontal nav of 3 links, left-aligned on desktop
- Thin gray underline runs full row (`border-b border-[#E5E7EB]`)
- Active tab: bold text + a **short black underline directly under the active label** (decoration-2 or 3, underline-offset ~6-10px), `text-[#111827]`
- Inactive: regular weight, `text-[#6B7280]`, no underline
- 4th state in merchant nav PNG `figma/4573-4652-merchant-tabs.png` shows none active (all gray) — represents a loading/no-selection state but probably not used in production

Shopper tabs: Your Orders → `/profile/shopper/orders`, Your Payment → `/profile/shopper/payment`, Account Settings → `/profile/shopper/settings`
Merchant tabs: Active Listings → `/profile/merchant/active-listings`, Active Rentals → `/profile/merchant/rentals`, Your Earnings → `/profile/merchant/earnings`

### OrderRow (`figma/4577-3608-order-row.png` / Figma `4577:3608`)

Used in shopper All Orders list. Renders 1 row per order.

- Card: rounded-xl, white bg, `border border-[#E5E7EB]`, p-4
- Left: square thumbnail(s) — 72×72px, rounded-2xl, light blue/pink-ish placeholder bg
  - 1 item → 1 thumbnail; 2+ items → 2 thumbnails stacked side-by-side (slightly offset)
- Order ID line: `Order #YK-2026-003` — Satoshi semibold ~18-20px
- Subtitle: `1 item · Addie Johnson` OR `2 items · @username`
  - For multi-item with seller: `3 items from @kirby` (pattern from `figma/4449-1650-all-orders.png`)
  - The `@handle` is colored `#8C2D8B`
- Middle: `$XX.XX` total
- Date column: `Mar 10, 2026` muted
- Right: status pill + chevron-right icon link
- On click: link to `/profile/shopper/orders/[orderNumber]`

**Already exists:** `src/components/dashboard/OrderCard.tsx`. Verify it matches the design and adjust as needed.

### ListingRow (`figma/4577-3661-listing-row.png` / Figma `4577:3661`)

Used in merchant Active Listings and Past Listings.

- Card same shape as OrderRow
- Left: 72×72 thumbnail (pink-ish placeholder bg shown in Figma)
- Body:
  - Item name (semibold ~20px)
  - Subtitle: `Dresses · Reformation` (category · brand, muted, ~14px)
  - Price/duration: `$99 / 7 days` (medium, ~14px)
- Right (Live variant): green Live pill + pencil edit icon + trash delete icon
- Right (Ended variant): gray "Listing ended" pill, **no action icons** (immutable past listings)

**Already exists:** `src/components/dashboard/listing-shared.tsx` and `ListingCards.tsx`. Verify alignment.

### OrderStatusStepper (`figma/4449-1514-order-detail.png` / Figma `4449:1514`)

Horizontal stepper for shopper order detail page.

- 4 steps left-to-right: Order Placed → Processing → Shipped → Delivered
- Each step: circular icon ~48px + label below + sublabel below that
- Horizontal connector line between circles
- Active/completed steps: filled icon background (green for Placed, brand-purple for Processing/Shipped), white icon glyph
- Future step (Delivered, not yet reached): gray outlined icon
- Icon glyphs already exist: `src/components/dashboard/icons/{OrderPlacedIcon,ProcessingIcon,ShippedIcon,DeliveredIcon}.tsx`

### NotificationsDrawer (`figma/4449-1786-notifications-drawer.png` / Figma `4449:1786`)

**Drawer/sheet pattern, NOT a full page.** Slides in from the right edge over any page, with a dimmed backdrop.

- Trigger: bell icon in global NavBar
- Layout: white panel, ~360px wide, full height
- Header: "Notifications" title + X close button
- List of notification items, each:
  - Round Yika logo avatar (left)
  - Title: "Yika" (semibold)
  - Timestamp ("1m ago", "2h ago", "2d ago") right-aligned in row
  - Body text (~14px)
  - **Purple dot** at far right indicates unread
- Items separated by light divider

Will require: shadcn `sheet` primitive — **not yet installed in this repo** (run `npx shadcn add sheet`).

### Form patterns (`figma/4449-1734-settings.png` / Figma `4449:1734`)

Used in Account Settings.

- Field labels: ~14px, semibold, `text-[#111827]`, sit above input
- Inputs: gray-tinted bg `#F3F4F6`-ish, rounded, ~40px tall, full width within column
- Multi-field rows (e.g. city/state/zip): 3-column grid
- Primary button: filled purple `bg-[#8C2D8B]`, white text, rounded, ~40px tall
- **Sticky-note requirement (designer Thanh Nguyen):** "Save Changes" button is **disabled until the form is dirty** (a field has been edited). Use `disabled:opacity-50 disabled:cursor-not-allowed`.

Will need shadcn `input` primitive — not yet in repo.

### "List an Item" form (`figma/4694-3750-list-an-item.png` / Figma `4694:3750`)

Merchant listing creation form.

- 5 square photo upload slots in a row, labeled Cover / Front / Back / Side / Detail, ~6 max
- Input fields: Item Name + Category + Size + Brand dropdowns + Retail Price + Paid Price
- 4 radio buttons in a row for rental duration: 4 / 7 / 14 / 30 days
- 2-month calendar side-by-side (using existing `react-day-picker` setup at `src/components/ui/calendar.tsx`)
- Below calendar: "Selected date: Mar 6 - Mar 13, Apr 6 - Apr 20" text auto-updates as user selects
- Bottom: "Back to Listings" outlined button + "Publish Listing" filled purple button
- **Sticky-note requirements (Thanh Nguyen):**
  - Default state has NO radio options selected
  - Selected-date text below calendar **auto-updates as user selects** — described as a "confirmation step that helps a user scan what they have chosen"

## Page → route mapping

### Shopper (`/profile/shopper/*`)

| Figma | Existing route | Status |
|---|---|---|
| Order entry (dashboard summary) `4449:1514` / `5192:4647` | `/profile/shopper` doesn't exist; redirects to `/orders` | **NEW** — make this the index page |
| All Orders `4449:1650` | `/profile/shopper/orders` ✅ | restyle to match `figma/4449-1650-all-orders.png` |
| Order Detail `4449:1514` (stepper view) | `/profile/shopper/orders/[orderId]` (stub) | **build out** |
| Payment `4449:1668` | `/profile/shopper/payment` ✅ | restyle |
| Settings `4449:1734` | `/profile/shopper/settings` ✅ | restyle, add dirty-state Save button |
| Wishlist `4449:1696` | `/profile/shopper/wishlist` doesn't exist; data via `useLikedItems` localStorage | **NEW** |
| Shopping bag `4449:1671` | doesn't exist | **NEW** (could live at `/cart`, outside profile) |
| Cart confirmation `4449:1762` | doesn't exist | **NEW** (checkout flow) |
| Notifications | n/a — it's a drawer | **NEW** drawer component, lives in shell |
| Payment Details popup `4449:1813` | n/a — it's a dialog | **NEW** modal |
| Mobile Order entry `5193:5040` | n/a — responsive layer | needs mobile variant |

### Merchant (`/profile/merchant/*`)

| Figma | Existing route | Status |
|---|---|---|
| Active Listings `4570:2528` | `/profile/merchant/active-listings` ✅ | restyle |
| Active Rentals `4570:3591` | `/profile/merchant/rentals` ✅ | restyle |
| Past Listing `4570:3870` | `/profile/merchant/past-listings` ✅ | restyle |
| Your Earnings `4570:3922` / `4708:4240` v2 | `/profile/merchant/earnings` ✅ | restyle |
| List an Item `4694:3750` / `4771:4249` v2 | `/profile/merchant/add-listing` ✅ + `/edit-listing` | restyle, implement date-range + dirty state |

## Designer sticky-note acceptance criteria

These yellow sticky notes from designer **Thanh Nguyen** are embedded in the Figma frames and must become acceptance criteria for the issues that implement those pages:

1. **Settings page (`figma/4449-1734-settings.png`):** Save Changes button only activates when changes in the fields are entered/detected.
2. **List an Item page (`figma/4694-3750-list-an-item.png`):** Default state = no radio options selected.
3. **List an Item page (`figma/4694-3750-list-an-item.png`):** Date selector in range → "Selected Date" section below calendar auto-updates as user selects. This is a confirmation step that helps a user scan what they have chosen.

## Open questions (for the designer or product)

1. **Mode switching is a text link in the Profile Header** (resolved from previous question). The current `<Modes>` component (`src/components/dashboard/modes.tsx`) should be replaced with this pattern.
2. **Wishlist data source:** keep `localStorage` (`useLikedItems` hook) or move to backend? — open
3. **Notifications data:** sample data only for now, or real backend? — open. Repo has no backend yet.
4. **Earnings vs Active Rentals tab ambiguity** (frame `figma/4570-3922-earnings.png`): the underlined active tab says "Active Rentals" but the content shows Earnings cards + Earnings History table. Either the designer underlined the wrong tab, or the Rentals page IS the earnings dashboard. — needs designer clarification
5. **Bell icon unread badge:** yes/no, and where does the count come from? — open
6. **@handles on order rows** are styled as if clickable — link to user profiles, or just stylistic? Profiles don't exist yet. — open
7. **In-scope for first batch:** Phase D (shopping bag full view, cart confirmation, payment details popup) — keep in or defer? — open

## Implementation order recommendation

**Phase A — Foundation (do once, both modes reuse)**
1. Add shadcn `table`, `dialog`, `sheet`, `input` primitives
2. Add bell icon + drawer trigger to `Navbar`
3. Refresh `<Modes>` → `<ModeSwitchLink>` (text + link pattern)
4. Polish `<Tabs>` to match exact underline spec
5. Polish `StatusBadge` (already close)
6. Polish `OrderCard`, `ListingCard`
7. Build `<OrderStatusStepper>`
8. Build `<NotificationsDrawer>` (sheet + sample data)

**Phase B — Restyle existing**
9. Shopper: All Orders, Payment, Settings (dirty-state save)
10. Merchant: Active Listings, Active Rentals, Past Listings, Your Earnings, List an Item (date range + dirty state)

**Phase C — New pages**
11. Shopper index / Order entry summary
12. Order Detail (stepper page)
13. Wishlist
14. Mobile Order entry responsive layer

**Phase D — Adjacent (defer if scoping tight)**
15. Shopping bag full view, Cart confirmation, Payment Details popup

## Codebase reference (current state)

- **Framework:** Next.js 16 (app router), React 19, Tailwind v4
- **UI lib:** shadcn/ui ("new-york" style with CSS vars). Installed primitives: `badge`, `button`, `calendar`, `card`, `popover`, `select`. **Missing primitives needed:** `table`, `dialog`, `sheet`, `input`
- **Body bg:** `#FFFDF7` set via `globals.css`
- **Default font:** Satoshi (via Fontshare `<link>` in root layout `<head>`)
- **Root layout:** `src/app/layout.tsx` — wraps everything in global `<Navbar />` + `<Footer />`. Both modes' profile pages render below this nav (with `pt-[76.87px]` offset).
- **Dashboard layout chain:**
  - `src/app/profile/layout.tsx` — renders profile header (greeting + `<Modes>`)
  - `src/app/profile/shopper/layout.tsx` — adds `<Tabs mode="shopper" />`
  - `src/app/profile/merchant/layout.tsx` — adds `<Tabs mode="merchant" />`
- **Sample data only** — no API, no auth, no DB. Mock in `src/lib/data/sample-data.ts` with `SAMPLE_LISTINGS`, `SAMPLE_PAST_LISTINGS`, `SAMPLE_ORDERS`.
- **Local assets:**
  - `public/assets/dashboard/profile-photo.jpg` — Tatiana avatar
  - `public/assets/logos/Logo-Black.svg` — wordmark
  - `public/assets/dashboard/{glasses,pants,shoe}.jpg` — placeholder item images
- **Existing dashboard components:**
  - `src/components/dashboard/{OrderCard,RentalRequest,StatusBadge,modes,tabs,listing-shared,ListingCards}.tsx`
  - `src/components/dashboard/icons/{OrderPlacedIcon,ProcessingIcon,ShippedIcon,DeliveredIcon}.tsx`
- **Existing hooks:** `src/lib/hooks/useLikedItems.ts` (localStorage-backed wishlist)

## Known gaps vs design

- Bell icon missing from `Navbar`
- `<Modes>` component pattern doesn't match Figma's text-link pattern (currently renders 2 items, one bold)
- No `<NotificationsDrawer>`
- No `<OrderStatusStepper>`
- No `Table`, `Dialog`, `Sheet`, `Input` shadcn primitives
- No mobile responsive variants
- No real backend for notifications, orders, listings

---

**Last updated:** 2026-06-02 by Claude session — Tomiwa (badadmad@gmail.com) on branch `kaleidoscoperope/figma-mcp-access-check`.

Preview page demonstrating the visual target: `/preview/shopper-dashboard` (route added in this session).
