"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    usePhotoSlots,
    FormShell,
    SharedFormFields,
} from "@/components/dashboard/listing-shared";

export default function PostListingPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const { slots, handleChange, handleRemove } = usePhotoSlots();

    const [form, setForm] = useState({
        itemName:    "",
        category:    "",
        size:        "",
        brand:       "",
        brandName:   "",
        rrp:         "",
        description: "",
        color:       "",
        gender:      "",
        occasion:    "",
    });

    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [rentalPrice, setRentalPrice] = useState("");
    const [publishing, setPublishing] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);

    const set = (key: keyof typeof form) => (val: string) =>
        setForm((prev) => ({ ...prev, [key]: val }));

    const handleDurationChange = (days: number) => {
        setSelectedDuration(days);
        setRentalPrice("");
    };

    const handlePublish = async () => {
        if (!form.itemName || !form.category || !form.brand || !rentalPrice) {
            setPublishError("Please fill in all required fields (name, category, brand, rental price).");
            return;
        }
        if (!session?.user) {
            setPublishError("You must be signed in to post a listing.");
            return;
        }

        setPublishing(true);
        setPublishError(null);

        const brandName = form.brand === "other" ? form.brandName : form.brand;

        const payload = {
            ItemName:     form.itemName,
            category:     form.category,
            brand:        brandName,
            description:  form.description,
            price:        rentalPrice,
            color:        form.color,
            gender:       form.gender || undefined,
            occasion:     form.occasion ? [form.occasion] : [],
            sizes:        form.size ? [{ size: form.size, in_stock: 1 }] : [],
            tags:         [form.category, form.color, form.occasion].filter(Boolean),
            availability: true,
            contact:      session.user.email,
            owner:        session.user.name,
            owner_id:     session.user.id,
        };

        try {
            // 1. Create the inventory item
            const res = await fetch("/api/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message ?? `Server error ${res.status}`);
            }

            const created = await res.json();
            const itemId: string = created.ItemID ?? created.itemId ?? created.id;

            // 2. Upload photos if any were selected
            if (itemId) {
                const photoSlots = slots.filter((s) => s.file);
                await Promise.all(
                    photoSlots.map(async (slot) => {
                        const fd = new FormData();
                        fd.append("image", slot.file!);
                        await fetch(`/api/inventory/${itemId}/upload-image`, {
                            method: "POST",
                            body: fd,
                        });
                    })
                );
            }

            router.push("/profile/merchant/active-listings");
        } catch (err) {
            setPublishError(err instanceof Error ? err.message : "Failed to publish listing.");
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-white rounded-2xl shadow-none border border-[#E5E7EB] mt-10 flex justify-center p-5">
            <FormShell
                title="Post a Listing"
                subtitle="Add your item details to list it for rental."
                backHref="../merchant/active-listings"
                footer={
                    <>
                        <Link
                            href="../merchant/active-listings"
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#6B6480] border border-[#E2E0E8] hover:bg-[#F9F5FF] transition-colors"
                        >
                            Back to Listings
                        </Link>
                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={publishing}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1A1530] hover:bg-[#2D2450] transition-colors disabled:opacity-60"
                        >
                            {publishing ? "Publishing…" : "Publish Listing"}
                        </button>
                    </>
                }
            >
                {publishError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-2">
                        {publishError}
                    </div>
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
                />
            </FormShell>
        </div>
    );
}
