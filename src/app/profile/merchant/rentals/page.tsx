"use client";

/**
 * ActiveRentals page
 * Route: /dashboard/rentals (or wherever your router expects it)
 *
 * Uses: OrderTable from ListingCards.tsx
 * When ready to connect backend: replace SAMPLE_ORDERS with a real fetch/query.
 */

import { OrderTable, type OrderItem } from "@/components/dashboard/ListingCards";

// Hardcoded sample data — swap out for API data later
const SAMPLE_ORDERS: OrderItem[] = [
    {
        id: "o1",
        orderNumber: "YK-2026-001",
        itemCount: 2,
        renterName: "Maya Chen",
        total: 55,
        dueDate: "Mar 10, 2026",
        status: "live",
        imageUrls: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80",
        ],
        href: "#", // TODO: replace with real order detail route e.g. `/dashboard/orders/o1`
    },
    {
        id: "o2",
        orderNumber: "YK-2026-002",
        itemCount: 1,
        renterName: "Sophia Rodriguez",
        total: 110,
        dueDate: "Mar 10, 2026",
        status: "pending",
        imageUrls: [
            "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80",
        ],
        href: "#",
    },
    {
        id: "o3",
        orderNumber: "YK-2026-004",
        itemCount: 1,
        renterName: "Addie Johnson",
        total: 120,
        dueDate: "Mar 10, 2026",
        status: "rented",
        imageUrls: [
            "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=200&q=80",
        ],
        href: "#",
    },
    {
        id: "o4",
        orderNumber: "YK-2026-005",
        itemCount: 1,
        renterName: "Maryanne Zaheer",
        total: 55,
        dueDate: "Mar 10, 2026",
        status: "returned",
        imageUrls: [
            "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=200&q=80",
        ],
        href: "#",
    },
];

export default function Rentals() {
    return (
        <section className="flex flex-col gap-6 p-5 bg-white rounded-2xl shadow-none mt-10 border border-[#E5E7EB]">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-[#111827]">Active Rentals</h2>
                <p className="text-[13px] text-[#6B7280] mt-0.5">{SAMPLE_ORDERS.length} orders</p>
            </div>

            {/* Order table with column headers + rows */}
            <OrderTable orders={SAMPLE_ORDERS} />
        </section>

    );
}
