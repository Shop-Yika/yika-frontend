/**
 * Dashboard data repositories.
 *
 * Every dashboard page imports its data from this module. Today the
 * implementations are in-memory mocks. When the real backend lands,
 * swap the bodies — the call sites stay the same.
 *
 * Each method:
 *   - Simulates network latency with `await sleep(...)` (50–200 ms)
 *   - Carries a `TODO(backend):` comment naming the eventual endpoint
 *   - Returns a fresh shallow clone of any array / object it owns, so
 *     callers can't mutate the shared mock store by accident.
 */

import { MOCK_EARNINGS_HISTORY, MOCK_EARNINGS_SUMMARY } from './mock-earnings';
import { MOCK_LISTINGS } from './mock-listings';
import { MOCK_NOTIFICATIONS } from './mock-notifications';
import { MOCK_ORDERS, MOCK_ORDER_DETAILS } from './mock-orders';
import { MOCK_RENTALS } from './mock-rentals';
import { MOCK_USER } from './mock-user';
import type {
    EarningsHistoryEntry,
    EarningsSummary,
    Listing,
    Notification,
    Order,
    OrderDetail,
    Rental,
    UserProfile,
} from './types';

// ─── Internals ────────────────────────────────────────────────────────────────

/** Simulate a network round trip. Range matches issue A2 (50–200 ms). */
function sleep(minMs = 50, maxMs = 200): Promise<void> {
    const ms = minMs + Math.random() * (maxMs - minMs);
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mutable, per-process notification store so `markRead` reflects in
 * subsequent `list` / `unreadCount` calls during the same dev session.
 * Resets on server restart — that's fine for the mock layer.
 */
const notificationStore: Notification[] = MOCK_NOTIFICATIONS.map((n) => ({ ...n }));

/**
 * Mutable in-memory copy of the user profile so `updateProfile` patches
 * stick within a process. Resets on restart.
 */
let userStore: UserProfile = { ...MOCK_USER };

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orders = {
    // TODO(backend): GET /api/orders?role=shopper
    async listShopperOrders(): Promise<Order[]> {
        await sleep();
        return MOCK_ORDERS.map((o) => ({ ...o, thumbnailUrls: [...o.thumbnailUrls] }));
    },

    // TODO(backend): GET /api/orders/:orderNumber
    async getOrderDetail(orderNumber: string): Promise<OrderDetail | null> {
        await sleep();
        const detail = MOCK_ORDER_DETAILS[orderNumber];
        if (!detail) return null;
        return {
            ...detail,
            thumbnailUrls: [...detail.thumbnailUrls],
            lineItems: detail.lineItems.map((li) => ({ ...li })),
            shippingAddress: { ...detail.shippingAddress },
        };
    },
};

// ─── Listings ─────────────────────────────────────────────────────────────────

export const listings = {
    // TODO(backend): GET /api/listings?merchant=me&status=live,pending
    async listActiveListings(): Promise<Listing[]> {
        await sleep();
        return MOCK_LISTINGS
            .filter((l) => l.status !== 'ended')
            .map((l) => ({ ...l }));
    },

    // TODO(backend): GET /api/listings?merchant=me&status=ended
    async listPastListings(): Promise<Listing[]> {
        await sleep();
        return MOCK_LISTINGS
            .filter((l) => l.status === 'ended')
            .map((l) => ({ ...l }));
    },

    // TODO(backend): DELETE /api/listings/:id
    // Stub for B5 (Merchant Active Listings) — mock data is module-scoped and
    // resets per request, so this is intentionally a no-op. When the backend
    // lands, replace with the real call and have the page revalidate.
    async delete(id: string): Promise<void> {
        await sleep();
        // Touch the parameter so the lint config doesn't flag it as unused
        // before the backend wiring lands.
        void id;
    },

    /**
     * Stub create for the merchant "Post a Listing" form (issue B9).
     *
     * Returns a synthetic `Listing` echoing the submitted draft, with a
     * generated id and `pending` status (new listings always start in
     * review). The caller can `console.log` the returned record or wire
     * a toast — no persistence happens yet.
     *
     * TODO(backend): POST /api/listings — multipart upload with photos.
     */
    async createListing(draft: ListingDraft): Promise<Listing> {
        await sleep();
        return {
            id: `l-${Date.now()}`,
            name: draft.name,
            category: draft.category,
            brand: draft.brand,
            // No separate rental price on the draft; surface retail as a
            // stand-in so downstream rows render a non-zero value in dev.
            price: draft.retailPrice,
            durationDays: draft.durationDays,
            imageUrl: '',
            status: 'pending',
        };
    },
};

/**
 * Draft payload submitted by the "Post a Listing" merchant form (B9).
 *
 * Mirrors the form state — NOT the published `Listing` type. The form
 * collects additional context (multiple photos, retail price, size,
 * availability windows) that doesn't yet live on the listing record.
 * When the real backend lands, this becomes the request body for
 * `POST /api/listings`.
 */
export type ListingDraft = {
    name: string;
    category: string;
    size: string;
    brand: string;
    /** Retail / paid price in dollars (RRP). */
    retailPrice: number;
    /** Rental duration the merchant selected, in days. */
    durationDays: number;
    /** Locally-held photo files; not uploaded yet. */
    photos: File[];
    /** Availability windows picked on the calendar. */
    availability: { from: Date; to: Date }[];
};

// ─── Rentals ──────────────────────────────────────────────────────────────────

export const rentals = {
    // TODO(backend): GET /api/merchant/rentals?status=active
    async listActive(): Promise<Rental[]> {
        await sleep();
        return MOCK_RENTALS.map((r) => ({
            ...r,
            thumbnailUrls: [...r.thumbnailUrls],
        }));
    },
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = {
    // TODO(backend): GET /api/notifications
    async list(): Promise<Notification[]> {
        await sleep();
        return notificationStore.map((n) => ({ ...n }));
    },

    // TODO(backend): POST /api/notifications/:id/read
    async markRead(id: string): Promise<void> {
        await sleep();
        const target = notificationStore.find((n) => n.id === id);
        if (target) target.read = true;
    },

    // TODO(backend): GET /api/notifications/unread-count
    async unreadCount(): Promise<number> {
        await sleep();
        return notificationStore.filter((n) => !n.read).length;
    },
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const user = {
    // TODO(backend): GET /api/me
    async getProfile(): Promise<UserProfile> {
        await sleep();
        return {
            ...userStore,
            shippingAddress: { ...userStore.shippingAddress },
        };
    },

    // TODO(backend): PATCH /api/me
    async updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
        await sleep();
        userStore = {
            ...userStore,
            ...patch,
            shippingAddress: {
                ...userStore.shippingAddress,
                ...(patch.shippingAddress ?? {}),
            },
        };
        return {
            ...userStore,
            shippingAddress: { ...userStore.shippingAddress },
        };
    },
};

// ─── Earnings ─────────────────────────────────────────────────────────────────

export const earnings = {
    // TODO(backend): GET /api/merchant/earnings/summary
    async getSummary(): Promise<EarningsSummary> {
        await sleep();
        return { ...MOCK_EARNINGS_SUMMARY };
    },

    // TODO(backend): GET /api/merchant/earnings/history
    async getHistory(): Promise<EarningsHistoryEntry[]> {
        await sleep();
        return MOCK_EARNINGS_HISTORY.map((e) => ({
            ...e,
            thumbnailUrls: [...e.thumbnailUrls],
        }));
    },
};
