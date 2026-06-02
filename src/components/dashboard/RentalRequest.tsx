import { Card } from "@/components/ui/card";
import { ActiveListingRow, type ListingItem } from "@/components/dashboard/ListingCards";
import { cn } from "@/lib/utils";

// ─── Hardcoded sample data ────────────────────────────────────────────────────
// Replace these with real props or a data fetch when wiring to the backend.

const SAMPLE_REQUEST = {
    renterName: "Maya Chen",
    // Initials derived from name — no image dependency
    renterInitials: "MC",
    // Soft pink background matching the Figma avatar
    renterAvatarBg: "bg-pink-100 text-pink-500",
    durationDays: 7,
    dueDate: "Mar 9",
    income: 110.00,
};

const SAMPLE_LISTING_ITEM: ListingItem = {
    id: "rental-item-1",
    name: "Silk Midi Dress",
    category: "Dresses",
    brand: "Reformation",
    price: 99,
    durationDays: 7,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80",
    status: "pending",
};

export default function RentalRequest() {
    const { renterName, renterInitials, renterAvatarBg, durationDays, dueDate, income } =
        SAMPLE_REQUEST;

    return (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] flex flex-col gap-5 p-6 mt-10">

            {/* ── Header: title + action buttons ── */}
            <div className="flex items-start justify-between gap-4">

                {/* Left: title + description */}
                <div className="min-w-0">
                    <h1 className="font-bold text-[18px] text-[#111827]">
                        You have a new rental request
                    </h1>
                    <p className="text-[13px] text-[#6B7280] mt-1">
                        Approve if your item is available and ready to ship. Once confirmed,
                        you&apos;ll receive packaging instructions.
                    </p>
                </div>

                {/* Right: Confirm + Decline buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/*
                     * Confirm rental — purple primary button.
                     * TODO: wire up to your confirmation handler.
                     */}
                    <button
                        type="button"
                        className="bg-[#8C2D8B] hover:bg-[#7A2679] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                    >
                        Confirm rental
                    </button>

                    {/*
                     * Decline — ghost/muted button.
                     * TODO: wire up to your decline handler.
                     */}
                    <button
                        type="button"
                        className="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                    >
                        Decline
                    </button>
                </div>
            </div>

            {/* ── Renter profile ── */}
            <div className="flex items-center gap-3">
                {/*
                 * Avatar: initials-based circle — no image file dependency.
                 * Colour matches the soft pink shown in the Figma.
                 */}
                <div
                    className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        "text-[15px] font-semibold flex-shrink-0",
                        renterAvatarBg
                    )}
                >
                    {renterInitials}
                </div>

                <div className="flex flex-col gap-0.5">
                    <p className="font-semibold text-[14px] text-[#111827]">{renterName}</p>
                    <p className="text-[12px] text-[#6B7280]">Renter</p>
                </div>
            </div>

            {/* ── Rental detail cards: Duration / Due Date / Income ── */}


            <div className="flex flex-wrap gap-5">

                {/* Duration */}
                <Card className="p-4 bg-[#F9FAFB] border-none shadow-none rounded-xl min-w-[140px]">
                    <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
                        Duration
                    </p>
                    <p className="font-bold text-[16px] text-[#111827] mt-1">
                        {durationDays} days
                    </p>
                </Card>

                {/* Due Date */}
                <Card className="p-4 bg-[#F9FAFB] border-none shadow-none rounded-xl min-w-[140px]">
                    <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
                        Due Date
                    </p>
                    <p className="font-bold text-[16px] text-[#111827] mt-1">
                        {dueDate}
                    </p>
                </Card>

                {/* Income */}
                <Card className="p-4 bg-[#F9FAFB] border-none shadow-none rounded-xl min-w-[140px]">
                    <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
                        Income
                    </p>
                    <p className="font-bold text-[16px] text-[#111827] mt-1">
                        ${income.toFixed(2)}
                    </p>
                </Card>
            </div>

            {/* ── Rental item ── */}
            {/*
             * Reuses ActiveListingRow so the item card looks identical to
             * the listing rows in the Active Listings section.
             * Edit/delete icons are hidden because status is "live" but
             * we pass no onEdit/onDelete/editHref — they won't render
             * since this context is read-only (viewing the request, not managing).
             *
             * To hide icons unconditionally, we pass showActions={false}.
             * (ActiveListingRow already hides icons for "ended" status — for
             * this read-only context we wrap it in a border container instead.)
             */}
            <ActiveListingRow
                    item={SAMPLE_LISTING_ITEM}
                    showActions={false}
                />

        </div>
    );
}