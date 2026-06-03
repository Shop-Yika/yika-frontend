"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ListingRow } from "@/components/dashboard/ListingRow";
import { listings as listingsRepo } from "@/lib/data/repositories";
import type { Listing } from "@/lib/data/types";

/**
 * ActiveListingsView
 *
 * Client wrapper for the merchant Active Listings card. Renders the section
 * header (title + count + "Post a Listing" CTA), an optional "pending review"
 * banner, and one `<ListingRow>` per active listing.
 *
 * Stateful pieces — owned here, not on the page:
 *  - Edit navigation (router.push to /edit-listing?id=...)
 *  - Delete confirmation dialog (Cancel + Confirm Delete)
 *  - Local optimistic removal once `listings.delete(id)` resolves
 *
 * Data is hoisted from the server via the `listings` prop. The wrapping page
 * (`/profile/merchant/active-listings/page.tsx`) awaits the repository on the
 * server and passes the result down — that keeps initial render synchronous
 * and avoids a client-side loading flicker.
 *
 * @example
 *   const active = await listings.listActiveListings();
 *   return <ActiveListingsView listings={active} />;
 */
export type ActiveListingsViewProps = {
    listings: Listing[];
};

export function ActiveListingsView({ listings }: ActiveListingsViewProps) {
    const router = useRouter();

    // Local copy so we can optimistically remove a row after the delete
    // stub resolves. Mock repo is module-scoped and would re-serve the
    // deleted row on next fetch — owning the list here keeps the UI honest.
    const [items, setItems] = useState<Listing[]>(listings);

    // The listing currently queued for deletion. `null` = dialog closed.
    const [pendingDelete, setPendingDelete] = useState<Listing | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const hasPending = items.some((l) => l.status === "pending");

    const handleEdit = (id: string) => {
        router.push(`/profile/merchant/edit-listing?id=${id}`);
    };

    const handleDeleteRequest = (id: string) => {
        const target = items.find((l) => l.id === id);
        if (target) setPendingDelete(target);
    };

    const handleDeleteConfirm = async () => {
        if (!pendingDelete) return;
        setIsDeleting(true);
        try {
            await listingsRepo.delete(pendingDelete.id);
            setItems((prev) => prev.filter((l) => l.id !== pendingDelete.id));
            setPendingDelete(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        if (isDeleting) return;
        setPendingDelete(null);
    };

    return (
        <>
            <section className="flex flex-col gap-6 p-5 bg-surface rounded-2xl shadow-none mt-10 border border-border-default">
                {/* ── Header: title + count + CTA ── */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">
                            Active Listings
                        </h2>
                        <p className="text-[13px] text-text-muted mt-0.5">
                            {items.length} {items.length === 1 ? "listing" : "listings"}
                        </p>
                    </div>

                    <Link
                        href="/profile/merchant/add-listing"
                        className="flex items-center gap-1.5 bg-brand-magenta text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#7A2679] transition-colors self-center"
                    >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        Post a Listing
                    </Link>
                </div>

                {/* ── Pending-review banner ── */}
                {hasPending && (
                    <div
                        role="status"
                        className="flex items-start gap-2 bg-status-yellow-bg border border-status-yellow-border text-status-yellow-text text-[13px] px-4 py-3 rounded-xl"
                    >
                        <AlertCircle
                            className="w-4 h-4 shrink-0 mt-0.5"
                            aria-hidden="true"
                        />
                        <span>
                            Some listings are pending review. They will go live
                            once approved.
                        </span>
                    </div>
                )}

                {/* ── Listings ── */}
                {items.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="flex flex-col gap-5">
                        {items.map((listing) => (
                            <ListingRow
                                key={listing.id}
                                listing={listing}
                                actions="live"
                                onEdit={handleEdit}
                                onDelete={handleDeleteRequest}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Delete confirmation dialog ── */}
            <Dialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open) handleDeleteCancel();
                }}
            >
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-text-primary">
                            Delete listing?
                        </DialogTitle>
                        <DialogDescription className="text-text-muted">
                            {pendingDelete
                                ? `“${pendingDelete.name}” will be removed from your active listings. This can’t be undone.`
                                : "This listing will be removed from your active listings."}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={handleDeleteCancel}
                            disabled={isDeleting}
                            className="bg-border-subtle hover:bg-border-default text-text-muted text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-brand-magenta hover:bg-[#7A2679] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? "Deleting…" : "Delete listing"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

/**
 * Shown when the merchant has zero active listings.
 *
 * Figma does NOT document an empty state for this page (the canonical export
 * shows a populated list), so this is a sensible fallback: a short copy block
 * and the same "Post a Listing" CTA the header carries. When the designer
 * provides an explicit empty-state frame, swap in that visual.
 */
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <p className="font-semibold text-[15px] text-text-primary">
                No active listings yet
            </p>
            <p className="text-[13px] text-text-muted max-w-sm">
                Post your first item to start renting it out.
            </p>
            <Link
                href="/profile/merchant/add-listing"
                className="mt-2 flex items-center gap-1.5 bg-brand-magenta text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#7A2679] transition-colors"
            >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Post a Listing
            </Link>
        </div>
    );
}

export default ActiveListingsView;
