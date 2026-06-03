import RentalRequest from "@/components/dashboard/RentalRequest";
import { ActiveListingsView } from "@/components/dashboard/ActiveListingsView";
import { listings } from "@/lib/data/repositories";

/**
 * Merchant Active Listings page.
 *
 * Server component — fetches the active listings via the A2 repository
 * and hands them to <ActiveListingsView> (client) which owns the edit/delete
 * interactions and the confirmation dialog. The legacy <RentalRequest> banner
 * is preserved at the top of the page; it will be retired when the real rental
 * request flow lands.
 */
export default async function ActiveListingsPage() {
    const activeListings = await listings.listActiveListings();

    return (
        <>
            <RentalRequest />
            <ActiveListingsView listings={activeListings} />
        </>
    );
}
