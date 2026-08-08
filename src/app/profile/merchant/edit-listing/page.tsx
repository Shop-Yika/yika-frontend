"use client";

import { useState } from "react";
import Link from "next/link";
import {
    usePhotoSlots,
    FormShell,
    SharedFormFields,
    InlineAlert,
} from "@/components/dashboard/listing-shared";

// TODO: replace with real API fetch by listing ID

const SAMPLE_LISTING = {
    itemName:    "Leather Mini Skirt",
    category:    "skirt",
    size:        "2",
    brand:       "other",
    brandName:   "Hermes",
    rrp:         "88",
    duration:    7,     // number of days — maps to a radio pill
    rentalPrice: "45",
    photos: [
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80",
        "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=200&q=80",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80",
    ],
};

// ─── Page component ───────────────────────────────────────────────────────────

export default function EditListingPage() {

    // ── Photo slots — pre-filled with existing photos ──
    const { slots, handleChange, handleRemove } = usePhotoSlots(SAMPLE_LISTING.photos);

    // ── Core form fields — seeded from the listing ──
    const [form, setForm] = useState({
        itemName:    SAMPLE_LISTING.itemName,
        category:    SAMPLE_LISTING.category,
        size:        SAMPLE_LISTING.size,
        brand:       SAMPLE_LISTING.brand,
        brandName:   SAMPLE_LISTING.brandName,
        rrp:         SAMPLE_LISTING.rrp,
        description: "",
        color:       "",
        gender:      "",
        occasion:    "",
    });

    // ── Duration + rental price — seeded from existing listing ──
    const [selectedDuration, setSelectedDuration] = useState<number | null>(
        SAMPLE_LISTING.duration
    );
    const [rentalPrice, setRentalPrice] = useState(SAMPLE_LISTING.rentalPrice);

    const set = (key: keyof typeof form) => (val: string) =>
        setForm((prev) => ({ ...prev, [key]: val }));

    /**
     * When duration changes on the Edit page we also reset the rental price,
     * since the previous price was set for the old duration.
     */
    const handleDurationChange = (days: number) => {
        setSelectedDuration(days);
        setRentalPrice("");
    };

    /**
     * handleSave — persist changes to API.
     * TODO: replace with real PATCH call.
     */
    const handleSave = () => {
        // TODO: await updateListing(id, { ...form, duration: selectedDuration, rentalPrice, photos: slots.map(s => s.file) });
    };

    return (
        <div className="min-h-screen bg-white rounded-2xl shadow-none border border-[#E5E7EB] mt-10 flex justify-center p-5">

        <FormShell
                title="Edit Listing"
                subtitle="Update your listing details below."
                backHref="../merchant/active-listings"
                footer={
                    <>
                        <Link
                            href={"../merchant/active-listings"}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#6B6480] border border-[#E2E0E8] hover:bg-[#F9F5FF] transition-colors"
                        >
                            Back to Listings
                        </Link>

                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#9B5DE5] hover:bg-[#7C3ACA] transition-colors"
                        >
                            Save Changes
                        </button>
                    </>
                }
            >
                {/* Top-level amber alert for pre-existing "Other" brand listings */}
                {form.brand === "other" && (
                    <InlineAlert message="Listings with unlisted brands will be set to 'Pending' for review before going live." />
                )}

                <SharedFormFields
                    slots={slots}
                    onPhotoChange={handleChange}
                    onPhotoRemove={handleRemove}
                    form={form}
                    set={set}
                    selectedDuration={selectedDuration}
                    onDurationChange={handleDurationChange}
                    rentalPrice={rentalPrice}
                    onRentalPriceChange={setRentalPrice}
                    // Forces Brand Name field visible even before the user touches the brand select
                    showBrandNameField={true}
                />
            </FormShell>
        </div>
    );
}