"use client";

import { useState } from "react";
import Link from "next/link";
import {
    usePhotoSlots,
    FormShell,
    SharedFormFields,
} from "@/components/dashboard/listing-shared";

export default function PostListingPage() {

    // ── Photo slots — all empty on Post page ──
    const { slots, handleChange, handleRemove } = usePhotoSlots();

    // ── Core form fields ──
    const [form, setForm] = useState({
        itemName:  "",
        category:  "",
        size:      "",
        brand:     "",
        brandName: "",
        rrp:       "",
    });

    // ── Rental Price and Duration ──
    // selectedDuration: null = no pill chosen yet → price inputs hidden
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [rentalPrice, setRentalPrice] = useState("");

    /**
     * Generic setter factory for the core form fields.
     * Works for both text inputs (e.target.value) and shadcn Select values.
     */
    const set = (key: keyof typeof form) => (val: string) =>
        setForm((prev) => ({ ...prev, [key]: val }));

    /**
     * When the merchant picks a new duration, reset the rental price to empty
     * so they're prompted to enter a price for the new duration.
     */
    const handleDurationChange = (days: number) => {
        setSelectedDuration(days);
        setRentalPrice(""); // reset so they re-enter for the new duration
    };

    const handlePublish = () => {
        // TODO: await createListing({ ...form, duration: selectedDuration, rentalPrice, photos: slots.map(s => s.file) });
    };

    return (
        <div className="min-h-screen bg-white rounded-2xl shadow-none border border-[#E5E7EB] mt-10 flex justify-center p-5">
            <FormShell
                title="Post a Listing"
                subtitle="Add your item details to list it for rental."
                backHref="../merchant/active-listings"
                footer={
                    <>
                        {/* Footer left: secondary back link */}
                        <Link
                            href={"../merchant/active-listings"}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#6B6480] border border-[#E2E0E8] hover:bg-[#F9F5FF] transition-colors"
                        >
                            Back to Listings
                        </Link>

                        {/* Footer right: primary publish action */}
                        <button
                            type="button"
                            onClick={handlePublish}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1A1530] hover:bg-[#2D2450] transition-colors"
                        >
                            Publish Listing
                        </button>
                    </>
                }
            >
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
                    // showBrandNameField omitted — Brand Name only shows when user picks "Other"
                />
            </FormShell>
        </div>
    );
}


