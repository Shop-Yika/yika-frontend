import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { EarningsSummaryCard } from '@/components/dashboard/EarningsSummaryCard';
import { StatusPill, type StatusPillVariant } from '@/components/dashboard/StatusPill';
import { earnings } from '@/lib/data/repositories';
import { cn } from '@/lib/utils';
import type { EarningsHistoryEntry, RentalOrderStatus } from '@/lib/data/types';

/**
 * Merchant Your Earnings page (`figma/4570-3922-earnings.png`).
 *
 * Layout (top to bottom):
 *   1. Two summary cards side by side: Total Earnings + Pending Earnings.
 *   2. "Earnings History" card containing a table:
 *      Order | Total | Due Date | Status  (+ chevron column)
 *
 * Data: read from A2's `earnings` repository (mocked today, real backend
 * later — the page doesn't care which).
 *
 * The dashboard shell (greeting + tabs) is owned by
 * `src/app/profile/merchant/layout.tsx` — this page only renders the
 * content area.
 */

/**
 * Currency formatter — keeps row totals consistent with the summary
 * cards (`$X,XXX.XX`, en-US locale).
 */
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/**
 * Maps A2's `RentalOrderStatus` to the visual variant rendered by
 * A4's `<StatusPill>`. The two enums match 1:1 today; this mapper
 * keeps the relationship explicit so divergence later is a compile
 * error rather than a silent visual bug.
 */
const RENTAL_STATUS_TO_PILL: Record<RentalOrderStatus, StatusPillVariant> = {
    live: 'live',
    pending: 'pending',
    rented: 'rented',
    returned: 'returned',
};

export default async function EarningsPage() {
    const [summary, history] = await Promise.all([
        earnings.getSummary(),
        earnings.getHistory(),
    ]);

    const pendingSubtitle = summary.pendingOrderRef
        ? `From Order #${summary.pendingOrderRef}`
        : 'No pending earnings';

    return (
        <section className="flex flex-col gap-6 mt-10">
            {/* Summary cards — 2-up on tablet+, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <EarningsSummaryCard
                    title="Total Earnings"
                    value={summary.total}
                    subtitle={`Since ${summary.sinceDate}`}
                />
                <EarningsSummaryCard
                    title="Pending Earnings"
                    value={summary.pending}
                    subtitle={pendingSubtitle}
                />
            </div>

            {/* Earnings history */}
            <section className="flex flex-col gap-6 p-5 bg-surface rounded-2xl shadow-none border border-border-default">
                <div>
                    <h2 className="text-xl font-bold text-text-primary">Earnings History</h2>
                    <p className="text-[13px] text-text-muted mt-0.5">
                        {history.length} {history.length === 1 ? 'order' : 'orders'}
                    </p>
                </div>

                {history.length === 0 ? (
                    <p className="py-8 text-center text-[14px] text-text-muted">
                        No earnings history yet
                    </p>
                ) : (
                    <EarningsHistoryTable entries={history} />
                )}
            </section>
        </section>
    );
}

// ─── Earnings history table ─────────────────────────────────────────────────

/**
 * Stacked thumbnails for the Order column.
 *
 * - 0 images → empty placeholder square.
 * - 1 image  → single rounded thumbnail.
 * - 2+ images → 2-up offset stack (extras clipped, item count carries
 *   the rest of the meaning in the subtitle).
 */
function HistoryThumbnails({ urls, alt }: { urls: string[]; alt: string }) {
    const visible = urls.slice(0, 2);

    if (visible.length === 0) {
        return (
            <div
                aria-hidden="true"
                className="w-[56px] h-[56px] flex-shrink-0 rounded-xl bg-status-gray-bg"
            />
        );
    }

    if (visible.length === 1) {
        return (
            <div className="relative w-[56px] h-[56px] flex-shrink-0 rounded-xl overflow-hidden bg-status-gray-bg">
                <Image
                    src={visible[0]}
                    alt={alt}
                    fill
                    sizes="56px"
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div
            aria-label={`${urls.length} item images`}
            className="relative w-[56px] h-[56px] flex-shrink-0"
        >
            {/* Back thumbnail — offset down-right, behind */}
            <div className="absolute top-1 right-0 w-[44px] h-[44px] rounded-lg overflow-hidden bg-status-gray-bg border-2 border-surface">
                <Image
                    src={visible[1]}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                />
            </div>
            {/* Front thumbnail — top-left, in front */}
            <div className="absolute bottom-0 left-0 w-[44px] h-[44px] rounded-lg overflow-hidden bg-status-gray-bg border-2 border-surface">
                <Image
                    src={visible[0]}
                    alt={alt}
                    fill
                    sizes="44px"
                    className="object-cover"
                />
            </div>
        </div>
    );
}

/**
 * Renders the history table. Header styling matches the existing
 * dashboard convention (`text-faint`, uppercase, 11px, tracking-wider)
 * defined alongside `<OrderRow>` and `<OrderTable>`.
 */
function EarningsHistoryTable({ entries }: { entries: EarningsHistoryEntry[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-b border-border-default hover:bg-transparent">
                    <TableHead className="text-[11px] font-semibold tracking-wider text-text-faint uppercase">
                        Order
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold tracking-wider text-text-faint uppercase text-right">
                        Total
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold tracking-wider text-text-faint uppercase">
                        Due Date
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold tracking-wider text-text-faint uppercase">
                        Status
                    </TableHead>
                    {/* Chevron column has no visible header */}
                    <TableHead className="w-[24px]" />
                </TableRow>
            </TableHeader>
            <TableBody>
                {entries.map((entry) => (
                    <EarningsHistoryRow key={entry.orderRef} entry={entry} />
                ))}
            </TableBody>
        </Table>
    );
}

function EarningsHistoryRow({ entry }: { entry: EarningsHistoryEntry }) {
    const pillVariant = RENTAL_STATUS_TO_PILL[entry.status];
    const itemNoun = entry.thumbnailUrls.length === 1 ? 'item' : 'items';
    // Use the count of thumbnails as a proxy for line items — the mock
    // history doesn't carry an explicit itemCount, but every entry's
    // thumbnail array matches its order's line items. When the real
    // backend lands and `EarningsHistoryEntry` gains an explicit
    // `itemCount`, swap to that field.
    const itemCount = Math.max(entry.thumbnailUrls.length, 1);

    return (
        <TableRow className={cn('border-b border-border-subtle last:border-0 hover:bg-transparent')}>
            <TableCell className="py-4 align-middle">
                <div className="flex items-center gap-3 min-w-0">
                    <HistoryThumbnails
                        urls={entry.thumbnailUrls}
                        alt={`Order ${entry.orderRef}`}
                    />
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="font-semibold text-[14px] text-text-primary truncate">
                            Order #{entry.orderRef}
                        </p>
                        <p className="text-[12px] text-text-muted truncate">
                            {itemCount} {itemNoun} · {entry.buyerName}
                        </p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-[14px] font-medium text-text-primary text-right whitespace-nowrap">
                {CURRENCY_FORMATTER.format(entry.total)}
            </TableCell>
            <TableCell className="text-[14px] text-text-muted whitespace-nowrap">
                {entry.dueDate}
            </TableCell>
            <TableCell>
                <StatusPill variant={pillVariant} />
            </TableCell>
            <TableCell className="text-right">
                <ChevronRight
                    className="w-4 h-4 text-text-faint inline-block"
                    aria-hidden="true"
                />
            </TableCell>
        </TableRow>
    );
}
