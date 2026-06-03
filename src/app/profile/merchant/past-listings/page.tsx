import { ListingRow } from '@/components/dashboard/ListingRow';
import { listings } from '@/lib/data/repositories';

/**
 * Merchant Past Listings page (`/profile/merchant/past-listings`).
 *
 * Read-only archive of listings the merchant has ended (rental period over or
 * delisted). Renders a single Card with header + count subtitle and a list of
 * ended `<ListingRow>` instances. Empty state shows "No past listings".
 *
 * Notes:
 *  - The Phase A shell (NavBar, ProfileHeader, DashboardTabs) is applied by
 *    `src/app/profile/merchant/layout.tsx` via `<DashboardShell>`.
 *  - No merchant tab is named "Past Listings", so by design none of the tabs
 *    appears active when this page is open (DashboardTabs matches by
 *    `pathname.startsWith(href)` and no merchant tab href shares this prefix).
 *  - Action icons (pencil/trash) are intentionally hidden via
 *    `<ListingRow actions="ended">` — past listings are immutable.
 *  - Data flows through A2's repository layer (`listings.listPastListings()`)
 *    so a future backend swap is a one-line change in `repositories.ts`.
 */
export default async function PastListings() {
    const pastListings = await listings.listPastListings();

    return (
        <section className="flex flex-col gap-6 p-5 bg-surface rounded-2xl shadow-none border border-border-default mt-10">
            <div>
                <h2 className="text-xl font-bold text-text-primary">Past Listings</h2>
                <p className="text-[13px] text-text-muted mt-0.5">
                    {pastListings.length} {pastListings.length === 1 ? 'listing' : 'listings'}
                </p>
            </div>

            {pastListings.length === 0 ? (
                <p className="text-[14px] text-text-muted py-6 text-center">No past listings</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {pastListings.map((listing) => (
                        <ListingRow key={listing.id} listing={listing} actions="ended" />
                    ))}
                </div>
            )}
        </section>
    );
}
