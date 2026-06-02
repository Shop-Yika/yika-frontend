import { PastListingCard } from "@/components/dashboard/ListingCards";
import { SAMPLE_PAST_LISTINGS } from "@/lib/data/sample-data";

export default function PastListings() {
    return (
        <section className="flex flex-col gap-6 p-5 bg-white rounded-2xl shadow-none border border-[#E5E7EB] mt-10">
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
    );
}
