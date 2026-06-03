"use client";

import Image from 'next/image';
import { MdOutlineEdit } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { StatusPill, type StatusPillVariant } from './StatusPill';
import type { Listing, ListingStatus } from '@/lib/data/types';

/**
 * ListingRow
 *
 * Reusable merchant listing row. Used in:
 *  - Merchant Active Listings (`/profile/merchant/active-listings`)
 *  - Merchant Past Listings (`/profile/merchant/past-listings`) — Phase B migration
 *
 * Layout:
 *   [thumb]  Name
 *            Category · Brand                    [Pill]  [edit]  [trash]
 *            $price / N days
 *
 * Edit + delete actions are controlled by `actions`:
 *  - 'live'  — pill + pencil + trash (default for active listings)
 *  - 'ended' — pill only ("Listing ended" gray)
 *  - 'none'  — pill only (e.g. read-only embeds like rental requests)
 *
 * @example
 *   <ListingRow
 *     listing={listing}
 *     actions="live"
 *     onEdit={(id) => router.push(`/profile/merchant/edit-listing?id=${id}`)}
 *     onDelete={(id) => confirmDelete(id)}
 *   />
 */

// ─── Status mapping ──────────────────────────────────────────────────────────

/**
 * Maps A2's `ListingStatus` to the visual variant rendered by A4's
 * `<StatusPill>`. `ended` uses the dedicated "Listing ended" variant.
 */
const LISTING_STATUS_TO_PILL: Record<ListingStatus, StatusPillVariant> = {
    live: 'live',
    pending: 'pending',
    ended: 'ended',
};

// ─── Component ───────────────────────────────────────────────────────────────

export type ListingRowProps = {
    listing: Listing;
    /**
     * Controls which action icons appear on the right.
     * - `live`  — show pencil + trash
     * - `ended` — hide actions (immutable past listings)
     * - `none`  — hide actions (read-only embed)
     *
     * Defaults to `live` for active listings, `ended` for ended listings.
     * Callers can override to force `none` (e.g. inside a rental request panel).
     */
    actions?: 'live' | 'ended' | 'none';
    /** Fires when the merchant clicks the pencil icon. */
    onEdit?: (id: string) => void;
    /** Fires when the merchant clicks the trash icon. */
    onDelete?: (id: string) => void;
    /** Optional extra classes for the outer container. */
    className?: string;
};

export function ListingRow({
    listing,
    actions,
    onEdit,
    onDelete,
    className,
}: ListingRowProps) {
    const pillVariant = LISTING_STATUS_TO_PILL[listing.status];

    // Default actions mode is derived from status when caller omits it.
    const resolvedActions: 'live' | 'ended' | 'none' =
        actions ?? (listing.status === 'ended' ? 'ended' : 'live');

    const showActionIcons = resolvedActions === 'live';

    return (
        <div
            className={cn(
                'flex items-center justify-between gap-4 rounded-2xl border border-border-default bg-surface p-4',
                className,
            )}
        >
            {/* Left: thumbnail + text block */}
            <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-status-gray-bg">
                    <Image
                        src={listing.imageUrl}
                        alt={listing.name}
                        fill
                        sizes="72px"
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-semibold text-[18px] text-text-primary truncate">
                        {listing.name}
                    </p>
                    <p className="text-[14px] text-text-muted truncate">
                        {listing.category} · {listing.brand}
                    </p>
                    <p className="text-[14px] font-medium text-text-primary">
                        ${listing.price} / {listing.durationDays} days
                    </p>
                </div>
            </div>

            {/* Right: status pill + (optional) action icons */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <StatusPill variant={pillVariant} />

                {showActionIcons && (
                    <>
                        <button
                            type="button"
                            onClick={() => onEdit?.(listing.id)}
                            aria-label={`Edit ${listing.name}`}
                            className="text-text-faint hover:text-text-muted transition-colors p-1"
                        >
                            <MdOutlineEdit size={20} aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete?.(listing.id)}
                            aria-label={`Delete ${listing.name}`}
                            className="text-text-faint hover:text-status-orange-text transition-colors p-1"
                        >
                            <RiDeleteBinLine size={20} aria-hidden="true" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ListingRow;
