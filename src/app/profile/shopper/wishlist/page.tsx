import { WishlistView } from '@/components/wishlist/WishlistView';

/**
 * Shopper Wishlist page.
 *
 * Matches `docs/dashboard/figma/4449-1696-wishlist.png`:
 *  - Filter sidebar on the left (Gender / Category / Brand / Occasion /
 *    Colour / Size / Availability)
 *  - 3-column responsive product grid on the right showing every item the
 *    shopper has hearted (Q1 default: localStorage-backed `useLikedItems`)
 *
 * Note on shell composition: this route lives under `/profile/shopper/` so
 * it inherits the dashboard shell (ProfileHeader + DashboardTabs above the
 * grid). The Figma renders the wishlist as a standalone page without that
 * shell. The path was kept under `/profile/shopper/` per the C2 issue spec;
 * removing the shell here would require restructuring
 * `src/app/profile/shopper/layout.tsx` (which the brief flagged as off-limits).
 */
export default function ShopperWishlistPage() {
    return <WishlistView />;
}
