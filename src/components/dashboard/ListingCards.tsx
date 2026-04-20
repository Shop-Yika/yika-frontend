"use client";

/**
 * ListingCards.tsx
 *
 * All item/order display variants used across the merchant dashboard, in one file.
 * Import whichever component you need — they all share the same design tokens.
 *
 * Exports:
 *  ─ Types & helpers ─────────────────────────────────────────────────────────
 *  ListingStatus       — union type for item status values
 *  OrderStatus         — union type for order status values
 *  ListingItem         — data shape for a listing row/card
 *  OrderItem           — data shape for an order row
 *  StatusBadge         — shared status badge used across all three variants
 *
 *  ─ Variant 1: Active Listings row ──────────────────────────────────────────
 *  ActiveListingRow    — used in "Active Listings" / "Your Listings" section
 *                        thumbnail | name · category · price | badge · edit · delete
 *
 *  ─ Variant 2: Past Listings card ───────────────────────────────────────────
 *  PastListingCard     — used in "Past Listings" section
 *                        bordered card: thumbnail | name · category · price | "Listing ended"
 *
 *  ─ Variant 3: Order row ────────────────────────────────────────────────────
 *  OrderRow            — used in "Active Rentals" table
 *                        thumbnails | order# · items · renter | total | due date | status | chevron
 *  OrderTable          — full table wrapper with column headers + list of OrderRow
 */

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Status values a listing can have. */
export type ListingStatus = "live" | "pending" | "ended";

/** Status values an order can have. */
export type OrderStatus = "live" | "pending" | "rented" | "returned";

/**
 * Data shape for a single listing item.
 * Used by ActiveListingRow and PastListingCard.
 */
export interface ListingItem {
    id: string;
    name: string;
    /** e.g. "Dresses" */
    category: string;
    /** e.g. "Reformation" */
    brand: string;
    /** Rental price in dollars */
    price: number;
    /** Duration in days */
    durationDays: number;
    /** URL or local path for the product thumbnail */
    imageUrl: string;
    status: ListingStatus;
}

/**
 * Data shape for a single order row.
 * Used by OrderRow and OrderTable.
 */
export interface OrderItem {
    id: string;
    /** e.g. "YK-2026-001" */
    orderNumber: string;
    /** Number of items in the order */
    itemCount: number;
    /** Renter's display name */
    renterName: string;
    /** Total order value in dollars */
    total: number;
    /** ISO date string or formatted date string */
    dueDate: string;
    status: OrderStatus;
    /** Up to 2 product thumbnail URLs shown stacked */
    imageUrls: string[];
    /** Optional href for the row's chevron link */
    href?: string;
}

// ─── Status config ────────────────────────────────────────────────────────────

/**
 * Visual config for each status value.
 * Defines the badge border/background/text colours and dot colour.
 */
const LISTING_STATUS_CONFIG: Record<
    ListingStatus,
    { label: string; dot: string; badge: string }
> = {
    live: {
        label: "Live",
        dot:   "bg-[#15803D]",
        badge: "border border-[#15803D] bg-[#F0FDF4] text-[#15803D]",
    },
    pending: {
        label: "Pending",
        dot:   "bg-[#B45309]",
        badge: "border border-[#D97706] bg-[#FFFBEB] text-[#B45309]",
    },
    ended: {
        label: "Listing ended",
        dot:   "bg-[#9CA3AF]",
        badge: "border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]",
    },
};

const ORDER_STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; dot: string; badge: string }
> = {
    live: {
        label: "Live",
        dot:   "bg-[#15803D]",
        badge: "border border-[#15803D] bg-[#F0FDF4] text-[#15803D]",
    },
    pending: {
        label: "Pending",
        dot:   "bg-[#B45309]",
        badge: "border border-[#D97706] bg-[#FFFBEB] text-[#B45309]",
    },
    rented: {
        label: "Rented",
        dot:   "bg-[#EA580C]",
        badge: "border border-[#EA580C] bg-[#FFF7ED] text-[#EA580C]",
    },
    returned: {
        label: "Returned",
        dot:   "bg-[#9CA3AF]",
        badge: "border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]",
    },
};

// ─── Shared StatusBadge ───────────────────────────────────────────────────────

/**
 * StatusBadge
 *
 * Renders a pill badge with a coloured dot for any listing or order status.
 * Pass either a ListingStatus or OrderStatus value.
 *
 * Usage:
 *   <StatusBadge status="live" type="listing" />
 *   <StatusBadge status="rented" type="order" />
 */
export function StatusBadge({
                                status,
                                type,
                            }: {
    status: ListingStatus | OrderStatus;
    type: "listing" | "order";
}) {
    const config =
        type === "listing"
            ? LISTING_STATUS_CONFIG[status as ListingStatus]
            : ORDER_STATUS_CONFIG[status as OrderStatus];

    return (
        <Badge
            className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap",
                config.badge
            )}
        >
            <span className={cn("w-2 h-2 rounded-full flex-shrink-0", config.dot)} />
            {config.label}
        </Badge>
    );
}

// ─── Variant 1: Active Listing Row ───────────────────────────────────────────

/**
 * ActiveListingRow
 *
 * Used in the "Your Listings" / "Active Listings" section.
 *
 * Layout:
 *   [thumbnail]  Name
 *                Category · Brand
 *                $price / X days
 *                                    [status badge]  [edit]  [delete]
 *
 * Props:
 *  item        — listing data
 *  onEdit      — called when the edit icon is clicked
 *  onDelete    — called when the delete icon is clicked
 *  editHref    — if provided, edit icon navigates to this route instead of calling onEdit
 */
export function ActiveListingRow({
                                     item,
                                     showActions = true,
                                     onEdit,
                                     onDelete,
                                     editHref,
                                 }: {
    item: ListingItem;
    showActions?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    editHref?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white">

            {/* Left: thumbnail + text */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-[#F9FAFB]">
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-semibold text-[14px] text-[#111827] truncate">{item.name}</p>
                    <p className="text-[12px] text-[#6B7280]">
                        {item.category} · {item.brand}
                    </p>
                    <p className="text-[13px] text-[#374151] font-medium">
                        ${item.price} / {item.durationDays} days
                    </p>
                </div>
            </div>

            {/* Right: status badge + actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
                {/* Status badge — always shown */}
                <StatusBadge status={item.status} type="listing" />

                {/* Edit and delete only for active listings */}
                {/* Edit + delete — hidden when showActions=false OR status is "ended" */}
                {showActions && item.status !== "ended" && (
                    <>
                        {editHref ? (
                            <Link
                                href={editHref}
                                className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors p-1"
                                aria-label="Edit listing"
                            >
                                <MdOutlineEdit size={18} />
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onEdit?.(item.id)}
                                className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors p-1"
                                aria-label="Edit listing"
                            >
                                <MdOutlineEdit size={18} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => onDelete?.(item.id)}
                            className="text-[#9CA3AF] hover:text-red-400 transition-colors p-1"
                            aria-label="Delete listing"
                        >
                            <RiDeleteBinLine size={18} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}


// ─── Variant 2: Past Listing Card ────────────────────────────────────────────

/**
 * PastListingCard
 *
 * Used in the "Past Listings" section.
 * Each listing is wrapped in its own bordered card.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────────┐
 *   │  [thumbnail]  Name                  Listing ended │
 *   │               Category · Brand                   │
 *   │               $price / X days                    │
 *   └──────────────────────────────────────────────────┘
 */
export function PastListingCard({ item }: { item: ListingItem }) {
    return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white">

            {/* Left: thumbnail + text */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-[#F9FAFB]">
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-semibold text-[14px] text-[#111827] truncate">{item.name}</p>
                    <p className="text-[12px] text-[#6B7280]">
                        {item.category} · {item.brand}
                    </p>
                    <p className="text-[13px] text-[#374151] font-medium">
                        ${item.price} / {item.durationDays} days
                    </p>
                </div>
            </div>

            {/* Right: always "Listing ended" badge */}
            <div className="flex-shrink-0">
                <StatusBadge status="ended" type="listing" />
            </div>
        </div>
    );
}

// ─── Variant 3: Order Row + Table ────────────────────────────────────────────

/**
 * OrderRow
 *
 * A single row in the Active Rentals table.
 *
 * Layout (matches the Figma table):
 *   [thumb1 thumb2]  Order #YK-2026-001      $55.00   Mar 10, 2026   [Live badge]   ›
 *                    2 items · Maya Chen
 *
 * The row is a link if `item.href` is provided; otherwise it's a plain div.
 */
export function OrderRow({ item }: { item: OrderItem }) {
    const inner = (
        <div
            className={cn(
                "grid items-center gap-4 py-4 border-b border-[#F3F4F6] last:border-0",
                "grid-cols-[1fr_auto_auto_auto_auto]", // ORDER | TOTAL | DUE DATE | STATUS | CHEVRON
            )}
        >
            {/* ORDER cell: thumbnails + order number + meta */}
            <div className="flex items-center gap-3 min-w-0">

                {/* Up to 2 stacked thumbnails */}
                <div className="relative flex-shrink-0 w-[56px] h-[56px]">
                    {item.imageUrls.slice(0, 2).map((url, i) => (
                        <div
                            key={i}
                            className={cn(
                                "absolute rounded-lg overflow-hidden border-2 border-white bg-[#F9FAFB]",
                                "w-[44px] h-[44px]",
                                i === 0 ? "top-0 left-0 z-10" : "bottom-0 right-0 z-0"
                            )}
                        >
                            <Image src={url} alt="" fill className="object-cover" />
                        </div>
                    ))}
                    {/* Single image — no stacking needed */}
                    {item.imageUrls.length === 1 && (
                        <div className="absolute inset-0 rounded-lg overflow-hidden bg-[#F9FAFB]">
                            <Image src={item.imageUrls[0]} alt="" fill className="object-cover" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-semibold text-[14px] text-[#111827] truncate">
                        Order #{item.orderNumber}
                    </p>
                    <p className="text-[12px] text-[#6B7280]">
                        {item.itemCount} {item.itemCount === 1 ? "item" : "items"} · {item.renterName}
                    </p>
                </div>
            </div>

            {/* TOTAL */}
            <p className="text-[14px] font-medium text-[#111827] text-right whitespace-nowrap">
                ${item.total.toFixed(2)}
            </p>

            {/* DUE DATE */}
            <p className="text-[14px] text-[#6B7280] whitespace-nowrap hidden sm:block">
                {item.dueDate}
            </p>

            {/* STATUS badge */}
            <div className="flex-shrink-0">
                <StatusBadge status={item.status} type="order" />
            </div>

            {/* CHEVRON */}
            <ChevronRight className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
        </div>
    );

    // Wrap in Link if href provided
    if (item.href) {
        return (
            <Link href={item.href} className="block hover:bg-[#FAFAFA] transition-colors rounded-lg -mx-1 px-1">
                {inner}
            </Link>
        );
    }

    return <div className="hover:bg-[#FAFAFA] transition-colors rounded-lg -mx-1 px-1">{inner}</div>;
}

/**
 * OrderTable
 *
 * Full table wrapper: column headers + a list of OrderRow components.
 * Matches the "Active Rentals" Figma layout.
 *
 * Usage:
 *   <OrderTable orders={myOrders} />
 */
export function OrderTable({ orders }: { orders: OrderItem[] }) {
    return (
        <div className="flex flex-col">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 pb-3 border-b border-[#E5E7EB]">
                <p className="text-[11px] font-semibold tracking-wider text-[#9CA3AF] uppercase">Order</p>
                <p className="text-[11px] font-semibold tracking-wider text-[#9CA3AF] uppercase text-right">Total</p>
                <p className="text-[11px] font-semibold tracking-wider text-[#9CA3AF] uppercase hidden sm:block">Due Date</p>
                <p className="text-[11px] font-semibold tracking-wider text-[#9CA3AF] uppercase">Status</p>
                <div className="w-4" /> {/* chevron column spacer */}
            </div>

            {/* Rows */}
            {orders.map((order) => (
                <OrderRow key={order.id} item={order} />
            ))}
        </div>
    );
}

// ─── Sample data (hardcoded for testing) ─────────────────────────────────────

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
        href: "#",
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

// ─── Default export: renders all three variants for testing ───────────────────

/**
 * Default export — drop this into any page to preview all three card variants
 * with hardcoded sample data. No props needed, nothing needs to be wired up.
 *
 * Usage in a page:
 *   import ListingCards from "@/components/dashboard/ListingCards";
 *   <ListingCards />
 *
 * When you're ready to use individual variants, import them by name instead:
 *   import { ActiveListingRow, PastListingCard, OrderTable } from "@/components/dashboard/ListingCards";
 */
export default function ListingCards() {
    const activeListings = SAMPLE_LISTINGS.filter((l) => l.status !== "ended");
    const pastListings   = SAMPLE_LISTINGS.filter((l) => l.status === "ended");

    return (
        <div className="flex flex-col gap-10 p-6 bg-[#F9FAFB] min-h-screen">

            {/* ── Variant 1: Your Listings (Active Listing Rows) ── */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                <div className="flex items-start justify-between mb-1">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#111827]">Your Listings</h2>
                        <p className="text-[13px] text-[#6B7280] mt-0.5">{SAMPLE_LISTINGS.length} Listings Total</p>
                    </div>
                    <button
                        type="button"
                        className="flex items-center gap-1.5 bg-[#8C2D8B] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#7A2679] transition-colors"
                    >
                        + Post a Listing
                    </button>
                </div>

                {/* Pending notice */}
                <div className="mt-4 mb-2 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[13px] px-4 py-3 rounded-xl">
                    Some listings are pending review. They will go live once approved.
                </div>

                {/* All listing rows */}
                <div className="flex flex-col">
                    {SAMPLE_LISTINGS.map((item) => (
                        <ActiveListingRow
                            key={item.id}
                            item={item}
                            editHref="#"
                        />
                    ))}
                </div>
            </section>

            {/* ── Variant 2: Past Listings (Past Listing Cards) ── */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                <h2 className="text-[18px] font-bold text-[#111827]">Past Listings</h2>
                <p className="text-[13px] text-[#6B7280] mt-0.5 mb-4">{pastListings.length} listings</p>

                <div className="flex flex-col gap-3">
                    {pastListings.map((item) => (
                        <PastListingCard key={item.id} item={item} />
                    ))}
                </div>
            </section>

            {/* ── Variant 3: Active Rentals (Order Table) ── */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
                <h2 className="text-[18px] font-bold text-[#111827]">Active Rentals</h2>
                <p className="text-[13px] text-[#6B7280] mt-0.5 mb-4">{SAMPLE_ORDERS.length} orders</p>

                <OrderTable orders={SAMPLE_ORDERS} />
            </section>

        </div>
    );
}