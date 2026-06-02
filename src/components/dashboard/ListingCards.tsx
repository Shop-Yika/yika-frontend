"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

export { StatusBadge };

// ─── Types ────────────────────────────────────────────────────────────────────

/** Status values a listing can have. */
export type ListingStatus = "live" | "pending" | "ended";

/** Status values an order can have (merchant view). */
export type OrderStatus = "live" | "pending" | "rented" | "returned";

/** Status values an order can have (shopper view). */
export type ShopperOrderStatus = "Shipped" | "Delivered";

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
    /** Renter's display name (merchant view) */
    renterName: string;
    /** Seller's @handle (shopper view) */
    sellerHandle: string;
    /** Total order value in dollars */
    total: number;
    /** ISO date string or formatted date string */
    dueDate: string;
    /** Date the order was placed (shopper view) */
    orderDate: string;
    /** Merchant-side status */
    status: OrderStatus;
    /** Shopper-side status */
    shopperStatus: ShopperOrderStatus;
    /** Up to 2 product thumbnail URLs shown stacked */
    imageUrls: string[];
    /** Optional href for the row's chevron link */
    href?: string;
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

