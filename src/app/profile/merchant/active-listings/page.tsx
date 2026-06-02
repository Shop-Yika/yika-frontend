import Link from "next/link";
import { ActiveListingRow, PastListingCard } from "@/components/dashboard/ListingCards";
import RentalRequest from "@/components/dashboard/RentalRequest";
import { SAMPLE_LISTINGS, SAMPLE_PAST_LISTINGS } from "@/lib/data/sample-data";

export default function ActiveListings() {
    const activeListings = SAMPLE_LISTINGS.filter((l) => l.status === "live" || l.status === "pending");
    const hasPending = activeListings.some((l) => l.status === "pending");

    return (
        <>
            <RentalRequest />

            <section className="flex flex-col gap-6 p-5 bg-white rounded-2xl shadow-none mt-10 border border-[#E5E7EB]">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#111827]">Your Listings</h2>
                        <p className="text-[13px] text-[#6B7280] mt-0.5">{activeListings.length} Listings Total</p>
                    </div>
                    <Link
                        href="/profile/merchant/add-listing"
                        className="flex items-center gap-1.5 bg-[#8C2D8B] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#7A2679] transition-colors self-center"
                    >
                        + Post a Listing
                    </Link>
                </div>

                {hasPending && (
                    <div className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[13px] px-4 py-3 rounded-xl">
                        Some listings are pending review. They will go live once approved.
                    </div>
                )}

                <div className="flex flex-col gap-5">
                    {activeListings.map((item) => (
                        <ActiveListingRow
                            key={item.id}
                            item={item}
                            editHref={`/profile/merchant/edit-listing?id=${item.id}`}
                        />
                    ))}
                </div>
            </section>
            {/* Past listings */}
            {SAMPLE_PAST_LISTINGS.length > 0 && (
                <section className="flex flex-col gap-6 p-5 bg-white rounded-2xl shadow-none mt-6 border border-[#E5E7EB]">
                    <div>
                        <h2 className="text-xl font-bold text-[#111827]">Past Listings</h2>
                        <p className="text-[13px] text-[#6B7280] mt-0.5">{SAMPLE_PAST_LISTINGS.length} listings</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {SAMPLE_PAST_LISTINGS.map((item) => (
                            <PastListingCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
