/**
 * Dashboard domain types.
 *
 * These are the data contracts every dashboard page reads against.
 * When the real backend lands, only the repository implementations
 * (`src/lib/data/repositories.ts` and the `mock-*.ts` files) need to change.
 *
 * Date conventions
 * ----------------
 * - `orderDate`, `dueDate`, `sinceDate` use **display strings**
 *   (e.g. `"Mar 10, 2026"`) because the Figma surfaces them verbatim and
 *   we have no `Date` parsing on the consumer side yet. When the real
 *   backend lands these will become ISO strings and a formatter will be
 *   added at the read site.
 * - `Notification.timestamp` is also a display string (`"1m ago"`) for
 *   the same reason; a relative-time formatter is out of scope for A2.
 */

// ─── Status enums ─────────────────────────────────────────────────────────────

/**
 * Shopper-side order lifecycle. Drives the OrderStatusStepper on the
 * shopper Order Detail page.
 */
export type OrderStatus =
    | 'OrderPlaced'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Returned';

/** Listing lifecycle (merchant view). */
export type ListingStatus = 'live' | 'pending' | 'ended';

/**
 * Merchant-side rental lifecycle. Drives status pills on the merchant
 * Active Rentals and Earnings tables.
 */
export type RentalOrderStatus = 'live' | 'pending' | 'rented' | 'returned';

// ─── Orders ───────────────────────────────────────────────────────────────────

/**
 * Order row — used in the shopper All Orders list.
 *
 * `sellerHandle` is the @handle shown on the shopper view; `buyerName` is
 * only populated on records that also surface in merchant views.
 */
export type Order = {
    id: string;
    orderNumber: string;
    itemCount: number;
    sellerHandle: string;
    buyerName?: string;
    total: number;
    /** Display-formatted date string (see file header). */
    orderDate: string;
    status: OrderStatus;
    thumbnailUrls: string[];
};

/**
 * Order detail — used on the shopper Order Detail page (stepper, shipment
 * info, line items, payment summary).
 */
export type OrderDetail = Order & {
    shippingCarrier: string;
    trackingNumber: string;
    shippingAddress: {
        name: string;
        street: string;
        cityStateZip: string;
    };
    lineItems: {
        product: string;
        sku: string;
        quantity: number;
        unitPrice: number;
    }[];
    paymentMethodLast4: string;
};

// ─── Listings ─────────────────────────────────────────────────────────────────

export type Listing = {
    id: string;
    name: string;
    /** e.g. "Dresses" */
    category: string;
    /** e.g. "Reformation" */
    brand: string;
    /** Rental price in dollars. */
    price: number;
    /** Rental duration in days. */
    durationDays: number;
    imageUrl: string;
    status: ListingStatus;
};

// ─── Notifications ────────────────────────────────────────────────────────────

export type Notification = {
    id: string;
    /** Almost always "Yika" — kept on the model for future system actors. */
    title: string;
    body: string;
    /** Display string (e.g. `"1m ago"`, `"2h ago"`). See file header. */
    timestamp: string;
    read: boolean;
    iconUrl?: string;
};

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserProfile = {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
};

// ─── Earnings ─────────────────────────────────────────────────────────────────

export type EarningsSummary = {
    /** Lifetime earnings in dollars. */
    total: number;
    /** Pending payout in dollars. */
    pending: number;
    /** Optional reference to the order responsible for the pending payout. */
    pendingOrderRef?: string;
    /** Display-formatted "since" date (e.g. `"Jan 1, 2026"`). */
    sinceDate: string;
};

export type EarningsHistoryEntry = {
    orderRef: string;
    buyerName: string;
    total: number;
    /** Display-formatted due date. */
    dueDate: string;
    status: RentalOrderStatus;
    thumbnailUrls: string[];
};
