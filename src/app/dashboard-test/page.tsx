import Link from 'next/link';
import {
    orders,
    listings,
    rentals,
    notifications,
    user,
    earnings,
} from '@/lib/data/repositories';

/**
 * Dev-only launcher for clicking through every dashboard route built
 * during the Phase A/B/C autonomous implementation. Reads the same
 * mock repos the real pages use, so the counts below mirror what
 * each linked page will show.
 *
 * Not linked from anywhere — visit /dashboard-test directly. Safe to
 * delete after manual verification.
 */
export default async function DashboardTestPage() {
    const [
        profile,
        shopperOrders,
        activeListings,
        pastListings,
        merchantRentals,
        notifList,
        unread,
        earningsSummary,
        earningsHistory,
    ] = await Promise.all([
        user.getProfile(),
        orders.listShopperOrders(),
        listings.listActiveListings(),
        listings.listPastListings(),
        rentals.listActive(),
        notifications.list(),
        notifications.unreadCount(),
        earnings.getSummary(),
        earnings.getHistory(),
    ]);

    const firstOrder = shopperOrders[0];

    return (
        <main className="mx-auto max-w-4xl px-6 py-12">
            <header className="mb-10">
                <h1 className="text-3xl font-semibold text-text-primary">
                    Dashboard test launcher
                </h1>
                <p className="mt-2 text-text-muted">
                    Clickable index of every route built during the autonomous
                    Phase A/B/C run. Counts below come from the same A2 mock
                    repos the real pages use.
                </p>
            </header>

            <SectionTitle>Logged-in user</SectionTitle>
            <DataBlock>
                <Row k="Name">
                    {profile.firstName} {profile.lastName}
                </Row>
                <Row k="Email">{profile.email}</Row>
                <Row k="Shipping">
                    {profile.shippingAddress.city}, {profile.shippingAddress.state}
                </Row>
            </DataBlock>

            <SectionTitle>Shopper mode</SectionTitle>
            <RouteCard
                href="/profile/shopper/orders"
                title="Your Orders"
                desc={`${shopperOrders.length} mock orders covering every status (OrderPlaced / Processing / Shipped / Delivered / Returned).`}
            />
            {firstOrder && (
                <RouteCard
                    href={`/profile/shopper/orders/${firstOrder.orderNumber}`}
                    title={`Order Detail — ${firstOrder.orderNumber}`}
                    desc={`Detail page for ${firstOrder.orderNumber} (status: ${firstOrder.status}). Uses A8 stepper + A3 Table.`}
                />
            )}
            <RouteCard
                href="/profile/shopper/wishlist"
                title="Wishlist"
                desc="Filter sidebar + grid. Heart items elsewhere to populate (uses localStorage). Requires API_URL env for the catalog to render."
            />
            <RouteCard
                href="/profile/shopper/payment"
                title="Payment Methods"
                desc="Card form + billing address (option a). Save button enables on edit, disables after save."
            />
            <RouteCard
                href="/profile/shopper/settings"
                title="Account Settings"
                desc="Form with dirty-state. Edit a field, watch Save enable. Password field clears after save."
            />

            <SectionTitle>Merchant mode</SectionTitle>
            <RouteCard
                href="/profile/merchant/active-listings"
                title="Active Listings"
                desc={`${activeListings.length} listings. Pencil → edit, trash opens a confirm dialog. Mock listings.delete().`}
            />
            <RouteCard
                href="/profile/merchant/rentals"
                title="Active Rentals"
                desc={`${merchantRentals.length} rentals — Live / Pending / Rented / Returned variants. Each row uses OrderRow with the new rental prop.`}
            />
            <RouteCard
                href="/profile/merchant/past-listings"
                title="Past Listings"
                desc={`${pastListings.length} ended listings. No pencil/trash icons (actions="ended").`}
            />
            <RouteCard
                href="/profile/merchant/earnings"
                title="Your Earnings"
                desc={`Total ${formatCurrency(earningsSummary.total)} / pending ${formatCurrency(earningsSummary.pending)}. ${earningsHistory.length} history rows.`}
            />
            <RouteCard
                href="/profile/merchant/add-listing"
                title="List an Item"
                desc="Form with 5 photo slots, multi-date calendar, validation. Publish is disabled until valid; on click it calls listings.createListing() and routes back."
            />

            <SectionTitle>Global header / notifications</SectionTitle>
            <DataBlock>
                <Row k="Unread bell badge">{unread}</Row>
                <Row k="Total notifications">{notifList.length}</Row>
            </DataBlock>
            <p className="mt-3 text-sm text-text-muted">
                Click the bell icon in the AppHeader (top right) on any page to
                open the drawer. Clicking an unread item clears its dot.
            </p>

            <SectionTitle>Mobile testing</SectionTitle>
            <p className="text-sm text-text-muted">
                C3 added a mobile responsive layer to all shopper routes. Use
                browser devtools to set the viewport to 375px (iPhone SE) and
                confirm: no horizontal scroll, hamburger menu opens the
                dropdown nav, ProfileHeader stacks vertically, tabs scroll
                horizontally, and the OrderStatusStepper switches to vertical
                on the order detail page.
            </p>

            <SectionTitle>Manual smoke checklist</SectionTitle>
            <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted">
                <li>All pages render without runtime errors</li>
                <li>Profile header greeting shows italic &ldquo;Tatiana!&rdquo;</li>
                <li>Status pills render with correct colors (StatusPill A4)</li>
                <li>OrderRow desktop column headers align with row cells</li>
                <li>Dashboard tabs show active underline on the current route</li>
                <li>&ldquo;Switch to {profile.firstName.startsWith('M') ? 'Shopper' : 'Merchant'} Mode&rdquo; link works both directions</li>
                <li>NotificationsDrawer opens/closes via X and backdrop</li>
                <li>Delete confirmation dialog (active-listings) cancels safely</li>
                <li>Settings + payment Save buttons disable after save</li>
                <li>List an Item: Publish stays disabled until all required fields filled</li>
            </ul>

            <p className="mt-10 text-xs text-text-faint">
                This page is dev-only. Delete{' '}
                <code className="px-1 py-0.5 bg-border-subtle rounded">
                    src/app/dashboard-test/
                </code>{' '}
                when you&apos;re done.
            </p>
        </main>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="mt-10 mb-3 text-sm font-semibold uppercase tracking-wider text-text-faint">
            {children}
        </h2>
    );
}

function RouteCard({
    href,
    title,
    desc,
}: {
    href: string;
    title: string;
    desc: string;
}) {
    return (
        <Link
            href={href}
            className="block mb-3 p-4 rounded-xl border border-border-default bg-surface hover:border-brand-magenta transition-colors"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <p className="font-medium text-text-primary">{title}</p>
                    <p className="text-sm text-text-muted truncate">{desc}</p>
                </div>
                <code className="text-xs text-text-faint whitespace-nowrap">
                    {href}
                </code>
            </div>
        </Link>
    );
}

function DataBlock({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-border-default bg-surface p-4 space-y-1">
            {children}
        </div>
    );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="text-text-muted">{k}</span>
            <span className="font-medium text-text-primary">{children}</span>
        </div>
    );
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(amount);
}
