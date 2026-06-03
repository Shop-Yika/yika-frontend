/**
 * Mock merchant earnings — summary + history.
 *
 * Coverage requirement (issue A2): each `RentalOrderStatus` value
 * appears at least once in the history.
 */

import type { EarningsHistoryEntry, EarningsSummary } from './types';

const PLACEHOLDER_DRESS =
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80';
const PLACEHOLDER_BLAZER =
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80';
const PLACEHOLDER_SWEATER =
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80';
const PLACEHOLDER_SKIRT =
    'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=200&q=80';
const PLACEHOLDER_JACKET =
    'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=200&q=80';

export const MOCK_EARNINGS_SUMMARY: EarningsSummary = {
    total: 1820,
    pending: 110,
    pendingOrderRef: 'YK-2026-002',
    sinceDate: 'Jan 1, 2026',
};

export const MOCK_EARNINGS_HISTORY: EarningsHistoryEntry[] = [
    {
        orderRef: 'YK-2026-001',
        buyerName: 'Maya Chen',
        total: 220,
        dueDate: 'Mar 17, 2026',
        status: 'live',
        thumbnailUrls: [PLACEHOLDER_DRESS, PLACEHOLDER_BLAZER],
    },
    {
        orderRef: 'YK-2026-002',
        buyerName: 'Sophia Rodriguez',
        total: 110,
        dueDate: 'Mar 15, 2026',
        status: 'pending',
        thumbnailUrls: [PLACEHOLDER_SWEATER],
    },
    {
        orderRef: 'YK-2026-004',
        buyerName: 'Addie Johnson',
        total: 245,
        dueDate: 'Mar 7, 2026',
        status: 'rented',
        thumbnailUrls: [PLACEHOLDER_SKIRT, PLACEHOLDER_DRESS, PLACEHOLDER_BLAZER],
    },
    {
        orderRef: 'YK-2026-005',
        buyerName: 'Maryanne Zaheer',
        total: 55,
        dueDate: 'Feb 28, 2026',
        status: 'returned',
        thumbnailUrls: [PLACEHOLDER_JACKET],
    },
    {
        orderRef: 'YK-2026-006',
        buyerName: 'Priya Patel',
        total: 140,
        dueDate: 'Feb 20, 2026',
        status: 'returned',
        thumbnailUrls: [PLACEHOLDER_BLAZER],
    },
];
