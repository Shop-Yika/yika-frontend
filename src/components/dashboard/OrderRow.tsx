import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusPill, type StatusPillVariant } from './StatusPill';
import type { Order, OrderStatus, Rental, RentalOrderStatus } from '@/lib/data/types';

/**
 * OrderRow
 *
 * Reusable order row for table-like lists across the dashboard.
 *
 * Used by:
 *  - Shopper All Orders (`/profile/shopper/orders`) — pass `order` + `showHandle`
 *  - Merchant Active Rentals (`/profile/merchant/rentals`) — pass `rental`
 *  - Merchant Earnings history table — Phase B migration
 *
 * Layout (desktop):
 *   [thumb(s)]  Order #YK-…       $XX.XX   Mar 10, 2026   [Pill]   ›
 *               <subtitle>
 *
 * The chevron is rendered as a Next.js <Link> so the entire right edge is
 * keyboard-focusable; the rest of the row is a non-interactive surface.
 *
 * @example Shopper view
 *   <OrderRow
 *     order={order}
 *     hrefBase="/profile/shopper/orders/"
 *     showHandle
 *   />
 *
 * @example Merchant rental view
 *   <OrderRow
 *     rental={rental}
 *     hrefBase="/profile/merchant/rentals/"
 *   />
 */

// ─── Status mapping ──────────────────────────────────────────────────────────

/**
 * Maps A2's lifecycle `OrderStatus` to the visual variant rendered by
 * A4's `<StatusPill>`. Pre-shipping statuses share the yellow `pending`
 * pill because the Figma only spec'd post-shipment colors and these are
 * the closest semantic match.
 */
const ORDER_STATUS_TO_PILL: Record<OrderStatus, StatusPillVariant> = {
    OrderPlaced: 'pending',
    Processing: 'pending',
    Shipped: 'shipped',
    Delivered: 'delivered',
    Returned: 'returned',
};

/**
 * Maps merchant-side `RentalOrderStatus` values to `<StatusPill>` variants.
 * The mapping is 1:1 — the rental lifecycle and the pill variant share the
 * same set of states by design.
 */
const RENTAL_STATUS_TO_PILL: Record<RentalOrderStatus, StatusPillVariant> = {
    live: 'live',
    pending: 'pending',
    rented: 'rented',
    returned: 'returned',
};

// ─── Display normalization ───────────────────────────────────────────────────

/**
 * Internal display contract — every input shape (shopper Order, merchant
 * Rental) collapses to this before rendering. Keeps the JSX body simple
 * and ensures the two views render identically except where the props
 * explicitly diverge (subtitle text + pill variant).
 */
type RowDisplay = {
    orderNumber: string;
    total: number;
    /** The date rendered in the date column (order date OR due date). */
    date: string;
    pillVariant: StatusPillVariant;
    thumbnailUrls: string[];
    subtitle: { prefix: string; handle?: string; name?: string };
};

/**
 * Builds the row's subtitle line.
 *
 * Patterns (from Figma `4577:3608` + `4449:1650`):
 *   1 item · Addie Johnson
 *   2 items · @kirby
 *   3 items from @kirby
 */
function buildSubtitle(
    itemCount: number,
    options: { handle?: string; name?: string },
): { prefix: string; handle?: string; name?: string } {
    const noun = itemCount === 1 ? 'item' : 'items';
    const lead = `${itemCount} ${noun}`;

    if (options.handle) {
        // "3 items from @kirby" — preposition reads better with multiple items;
        // single-item orders use the same construction for consistency.
        return { prefix: `${lead} from `, handle: options.handle };
    }

    if (options.name) {
        return { prefix: `${lead} · `, name: options.name };
    }

    // Fallback — show only the item count.
    return { prefix: lead };
}

function fromOrder(
    order: Order,
    showHandle: boolean,
    showBuyerName: boolean,
): RowDisplay {
    // When both flags are set, the handle wins (shopper-style) so call sites
    // don't need to coordinate.
    const subtitleOpts = showHandle
        ? { handle: order.sellerHandle }
        : showBuyerName
            ? { name: order.buyerName }
            : {};

    return {
        orderNumber: order.orderNumber,
        total: order.total,
        date: order.orderDate,
        pillVariant: ORDER_STATUS_TO_PILL[order.status],
        thumbnailUrls: order.thumbnailUrls,
        subtitle: buildSubtitle(order.itemCount, subtitleOpts),
    };
}

function fromRental(rental: Rental): RowDisplay {
    return {
        orderNumber: rental.orderNumber,
        total: rental.total,
        date: rental.dueDate,
        pillVariant: RENTAL_STATUS_TO_PILL[rental.status],
        thumbnailUrls: rental.thumbnailUrls,
        subtitle: buildSubtitle(rental.itemCount, { name: rental.buyerName }),
    };
}

// ─── Thumbnails ──────────────────────────────────────────────────────────────

/**
 * Single thumbnail or a 2-up stack for multi-item orders.
 *
 * The stack uses a small offset so both squares stay visible inside the
 * 72×72 envelope. Extra images (3+) are intentionally clipped — the
 * subtitle already communicates total item count.
 */
function OrderThumbnails({ urls, alt }: { urls: string[]; alt: string }) {
    const visible = urls.slice(0, 2);

    if (visible.length === 0) {
        return (
            <div
                aria-hidden="true"
                className="w-[72px] h-[72px] flex-shrink-0 rounded-xl bg-status-gray-bg"
            />
        );
    }

    if (visible.length === 1) {
        return (
            <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-status-gray-bg">
                <Image
                    src={visible[0]}
                    alt={alt}
                    fill
                    sizes="72px"
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div
            aria-label={`${urls.length} item images`}
            className="relative w-[72px] h-[72px] flex-shrink-0"
        >
            {/* Back thumbnail — offset down-right, behind */}
            <div className="absolute top-1 right-0 w-[56px] h-[56px] rounded-xl overflow-hidden bg-status-gray-bg border-2 border-surface">
                <Image
                    src={visible[1]}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                />
            </div>
            {/* Front thumbnail — top-left, in front */}
            <div className="absolute bottom-0 left-0 w-[56px] h-[56px] rounded-xl overflow-hidden bg-status-gray-bg border-2 border-surface">
                <Image
                    src={visible[0]}
                    alt={alt}
                    fill
                    sizes="56px"
                    className="object-cover"
                />
            </div>
        </div>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────

type BaseProps = {
    /**
     * Base href for the row's chevron link. Final destination is
     * `${hrefBase}${order.orderNumber}` (or rental.orderNumber).
     *
     * @example "/profile/shopper/orders/" — chevron links to
     *          `/profile/shopper/orders/YK-2026-001`
     */
    hrefBase: string;
    /** Optional extra classes for the outer container. */
    className?: string;
};

type OrderInputProps = BaseProps & {
    order: Order;
    /** When true, render `@sellerHandle` in the subtitle (shopper view). */
    showHandle?: boolean;
    /** When true, render the buyer's display name in the subtitle (merchant view). */
    showBuyerName?: boolean;
    rental?: never;
};

type RentalInputProps = BaseProps & {
    rental: Rental;
    order?: never;
    showHandle?: never;
    showBuyerName?: never;
};

/**
 * Discriminated union — callers pass either `order` (shopper view) or
 * `rental` (merchant view), never both. TypeScript prevents accidental
 * mixing at the type level.
 */
export type OrderRowProps = OrderInputProps | RentalInputProps;

export function OrderRow(props: OrderRowProps) {
    const { hrefBase, className } = props;
    const display: RowDisplay = props.rental
        ? fromRental(props.rental)
        : fromOrder(
            props.order,
            props.showHandle ?? false,
            props.showBuyerName ?? false,
        );

    return (
        <div
            className={cn(
                'grid items-center gap-4 rounded-2xl border border-border-default bg-surface p-4',
                // Mobile: stack thumb/title block above meta block.
                // Desktop: 5 columns — order info | total | date | pill | chevron
                'grid-cols-[auto_1fr_auto] md:grid-cols-[auto_minmax(0,1fr)_100px_120px_auto_auto]',
                className,
            )}
        >
            {/* Thumbnails */}
            <OrderThumbnails
                urls={display.thumbnailUrls}
                alt={`Order ${display.orderNumber}`}
            />

            {/* Order id + subtitle */}
            <div className="min-w-0">
                <p className="font-semibold text-[18px] text-text-primary truncate">
                    Order #{display.orderNumber}
                </p>
                <p className="text-[14px] text-text-muted truncate">
                    {display.subtitle.prefix}
                    {display.subtitle.handle && (
                        <span className="text-brand-magenta">
                            @{display.subtitle.handle}
                        </span>
                    )}
                    {display.subtitle.name}
                </p>
            </div>

            {/* Total — mobile renders inline with the status pill row */}
            <p className="hidden md:block text-[15px] font-medium text-text-primary text-center whitespace-nowrap">
                ${display.total.toFixed(2)}
            </p>

            {/* Date — desktop only */}
            <p className="hidden md:block text-[15px] text-text-muted text-center whitespace-nowrap">
                {display.date}
            </p>

            {/* Status pill — placed in the meta row on mobile, dedicated column on desktop */}
            <div className="hidden md:flex justify-center">
                <StatusPill variant={display.pillVariant} />
            </div>

            {/* Chevron link */}
            <Link
                href={`${hrefBase}${display.orderNumber}`}
                aria-label={`View order ${display.orderNumber}`}
                className="justify-self-end text-text-faint hover:text-text-muted transition-colors p-1"
            >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </Link>

            {/* Mobile meta strip — total / date / status — spans the full row below the title */}
            <div className="col-span-3 md:hidden flex items-center justify-between gap-2 pt-1 -mt-1">
                <span className="text-[14px] font-medium text-text-primary">
                    ${display.total.toFixed(2)}
                </span>
                <span className="text-[14px] text-text-muted">{display.date}</span>
                <StatusPill variant={display.pillVariant} />
            </div>
        </div>
    );
}

export default OrderRow;
