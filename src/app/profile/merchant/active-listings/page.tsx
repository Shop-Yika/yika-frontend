'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api/inventory';
import { InventoryItem } from '@/lib/api/types';
import { StatusBadge } from '@/components/dashboard/ListingCards';
import RentalRequest from '@/components/dashboard/RentalRequest';
import { MdOutlineEdit } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';

export default function ActiveListings() {
    const { data: session } = useSession();
    const [items,   setItems]   = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (!session?.user?.email) return;

        const load = async () => {
            try {
                setLoading(true);
                const all = await apiClient.getInventory();
                const userId = session.user.id;
                const email  = session.user.email;
                // Match on owner_id (new items) or contact/email (legacy items)
                setItems(all.filter((item) =>
                    (item.owner_id && item.owner_id === userId) ||
                    (!item.owner_id && item.contact === email)
                ));
            } catch {
                setError('Failed to load listings. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [session?.user?.email]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            setItems((prev) => prev.filter((i) => i.id !== id));
        } catch {
            alert('Failed to delete listing. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <>
            <RentalRequest />

            <section className="flex flex-col gap-6 p-5 bg-white rounded-2xl shadow-none mt-10 border border-[#E5E7EB]">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#111827]">Your Listings</h2>
                        <p className="text-[13px] text-[#6B7280] mt-0.5">
                            {loading ? '...' : `${items.length} listing${items.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <Link
                        href="/profile/merchant/add-listing"
                        className="flex items-center gap-1.5 bg-[#8C2D8B] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#7A2679] transition-colors self-center"
                    >
                        + Post a Listing
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-gray-500 text-sm">You have no active listings yet.</p>
                        <Link
                            href="/profile/merchant/add-listing"
                            className="mt-4 text-[#8C2D8B] text-sm font-semibold hover:underline"
                        >
                            Post your first listing →
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {items.map((item) => (
                            <ListingRow
                                key={item.id}
                                item={item}
                                deleting={deleting === item.id}
                                onDelete={() => handleDelete(item.id)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

function ListingRow({
    item,
    deleting,
    onDelete,
}: {
    item: InventoryItem;
    deleting: boolean;
    onDelete: () => void;
}) {
    const status = item.availability ? 'live' : 'ended';

    return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white">
            {/* Thumbnail + info */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-[#F9FAFB]">
                    {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="72px" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                            No image
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-semibold text-[14px] text-[#111827] truncate">{item.name}</p>
                    <p className="text-[12px] text-[#6B7280]">{item.category} · {item.brand}</p>
                    <p className="text-[13px] text-[#374151] font-medium">
                        CAD$ {item.price.toFixed(2)} / day
                    </p>
                </div>
            </div>

            {/* Status + actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={status} type="listing" />
                <Link
                    href={`/profile/merchant/edit-listing?id=${item.id}`}
                    className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors p-1"
                    aria-label="Edit listing"
                >
                    <MdOutlineEdit size={18} />
                </Link>
                <button
                    onClick={onDelete}
                    disabled={deleting}
                    className="text-[#9CA3AF] hover:text-red-400 transition-colors p-1 disabled:opacity-40"
                    aria-label="Delete listing"
                >
                    <RiDeleteBinLine size={18} />
                </button>
            </div>
        </div>
    );
}
