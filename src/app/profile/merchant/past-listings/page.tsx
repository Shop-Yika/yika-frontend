"use client";

/**
 * PastListings page
 * Route: /dashboard/past-listings (or wherever your router expects it)
 *
 * Uses: PastListingCard from ListingCards.tsx
 * When ready to connect backend: replace SAMPLE_PAST_LISTINGS with a real fetch/query.
 */

import { PastListingCard, type ListingItem } from "@/components/dashboard/ListingCards";

// Hardcoded sample data — swap out for API data later
const SAMPLE_PAST_LISTINGS: ListingItem[] = [
    {
        id: "5",
        name: "Floral Maxi Dress",
        category: "Dresses",
        brand: "H&M",
        price: 28,
        durationDays: 7,
        imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&q=80",
        status: "ended",
    },
    {
        id: "6",
        name: "Cropped Denim Jacket",
        category: "Outerwear",
        brand: "Zara",
        price: 30,
        durationDays: 14,
        imageUrl: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=200&q=80",
        status: "ended",
    },
];


export default function PastListings() {
    return (
        <section className="flex flex-col gap-6 p-5 bg-white rounded-2xl shadow-none border border-[#E5E7EB] mt-10">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-[#111827]">Past Listings</h2>
                <p className="text-[13px] text-[#6B7280] mt-0.5">{SAMPLE_PAST_LISTINGS.length} listings</p>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3">
                {SAMPLE_PAST_LISTINGS.map((item) => (
                    <PastListingCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
