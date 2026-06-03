"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListingRow } from "@/components/dashboard/ListingRow";
import RentalRequest from "@/components/dashboard/RentalRequest";
import { MOCK_LISTINGS } from "@/lib/data/mock-listings";

export default function ActiveListings() {
    const router = useRouter();
    const activeListings = MOCK_LISTINGS.filter((l) => l.status === "live" || l.status === "pending");
    const pastListings = MOCK_LISTINGS.filter((l) => l.status === "ended");
    const hasPending = activeListings.some((l) => l.status === "pending");

    const handleEdit = (id: string) => {
        router.push(`/profile/merchant/edit-listing?id=${id}`);
    };

    const handleDelete = (id: string) => {
        // TODO(backend): wire to DELETE /api/listings/:id
        // Stubbed per A7 manual testing instructions; replaced when delete UX lands.
        console.log("delete listing", id);
    };

    return (
        <>
            <RentalRequest />

            <section className="flex flex-col gap-6 p-5 bg-surface rounded-2xl shadow-none mt-10 border border-border-default">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Your Listings</h2>
                        <p className="text-[13px] text-text-muted mt-0.5">{activeListings.length} Listings Total</p>
                    </div>
                    <Link
                        href="/profile/merchant/add-listing"
                        className="flex items-center gap-1.5 bg-brand-magenta text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#7A2679] transition-colors self-center"
                    >
                        + Post a Listing
                    </Link>
                </div>

                {hasPending && (
                    <div className="bg-status-yellow-bg border border-status-yellow-border text-status-yellow-text text-[13px] px-4 py-3 rounded-xl">
                        Some listings are pending review. They will go live once approved.
                    </div>
                )}

                <div className="flex flex-col gap-5">
                    {activeListings.map((listing) => (
                        <ListingRow
                            key={listing.id}
                            listing={listing}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </section>

            {/* Past listings */}
            {pastListings.length > 0 && (
                <section className="flex flex-col gap-6 p-5 bg-surface rounded-2xl shadow-none mt-6 border border-border-default">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Past Listings</h2>
                        <p className="text-[13px] text-text-muted mt-0.5">{pastListings.length} listings</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {pastListings.map((listing) => (
                            <ListingRow key={listing.id} listing={listing} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
