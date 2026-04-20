import Link from "next/link";
import { ActiveListingRow, type ListingItem } from "@/components/dashboard/ListingCards";
import RentalRequest from "@/components/dashboard/RentalRequest";

// Hardcoded sample data — swap out for API data later
const SAMPLE_LISTINGS: ListingItem[] = [
    {
        id: "1",
        name: "Silk Midi Dress",
        category: "Dresses",
        brand: "Reformation",
        price: 99,
        durationDays: 7,
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80",
        status: "live",
    },
    {
        id: "2",
        name: "Oversized Wool Blazer",
        category: "Dresses",
        brand: "Ganni",
        price: 174,
        durationDays: 14,
        imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80",
        status: "live",
    },
    {
        id: "3",
        name: "Leather Mini Skirt",
        category: "Bottoms",
        brand: "Zara",
        price: 35,
        durationDays: 7,
        imageUrl: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=200&q=80",
        status: "live",
    },
    {
        id: "4",
        name: "Cashmere Crew Sweater",
        category: "Tops",
        brand: "Sezane",
        price: 90,
        durationDays: 14,
        imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80",
        status: "pending",
    },
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
export default function ActiveListings() {
    const hasPending = SAMPLE_LISTINGS.some((l) => l.status === "pending");

    return (

        <>
            <RentalRequest />
            <section className="flex flex-col gap-6 p-5 bg-white rounded-2xl shadow-none mt-10 border border-[#E5E7EB]">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#111827]">Your Listings</h2>
                    <p className="text-[13px] text-[#6B7280] mt-0.5">{SAMPLE_LISTINGS.length} Listings Total</p>
                </div>
                <Link
                    href={"../merchant/add-listing"}
                    className="flex items-center gap-1.5 bg-[#8C2D8B] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#7A2679] transition-colors self-center"
                >
                    + Post a Listing
                </Link>
            </div>

            {/* Pending notice — only shown when at least one listing is pending */}
            {hasPending && (
                <div className="bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[13px] px-4 py-3 rounded-xl">
                    Some listings are pending review. They will go live once approved.
                </div>
            )}

            {/* Listing rows */}
            <div className="flex flex-col gap-5">
                {SAMPLE_LISTINGS.map((item) => (
                    <ActiveListingRow
                        key={item.id}
                        item={item}
                        // TODO: replace "#" with real edit route e.g. `/merchant/edit-listing/${item.id}`
                        editHref="#"
                    />
                ))}
            </div>
        </section>

        </>

    );
}
