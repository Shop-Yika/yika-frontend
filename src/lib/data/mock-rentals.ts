/**
 * Mock merchant rentals.
 *
 * Coverage requirements (see issue B6):
 *   - At least one entry per `RentalOrderStatus` value
 *     (live, pending, rented, returned)
 *   - At least one multi-item rental
 *
 * When the real backend lands, replace this file with a fetcher in
 * `repositories.ts`.
 */

import type { Rental } from './types';

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

export const MOCK_RENTALS: Rental[] = [
    {
        id: 'r1',
        orderNumber: 'YK-2026-001',
        itemCount: 2,
        buyerName: 'Maya Chen',
        total: 55,
        dueDate: 'Mar 10, 2026',
        status: 'live',
        thumbnailUrls: [PLACEHOLDER_DRESS, PLACEHOLDER_BLAZER],
    },
    {
        id: 'r2',
        orderNumber: 'YK-2026-002',
        itemCount: 1,
        buyerName: 'Sophia Rodriguez',
        total: 110,
        dueDate: 'Mar 10, 2026',
        status: 'pending',
        thumbnailUrls: [PLACEHOLDER_SWEATER],
    },
    {
        id: 'r3',
        orderNumber: 'YK-2026-004',
        itemCount: 1,
        buyerName: 'Addie Johnson',
        total: 120,
        dueDate: 'Mar 10, 2026',
        status: 'rented',
        thumbnailUrls: [PLACEHOLDER_SKIRT],
    },
    {
        id: 'r4',
        orderNumber: 'YK-2026-005',
        itemCount: 1,
        buyerName: 'Maryanne Zaheer',
        total: 55,
        dueDate: 'Mar 10, 2026',
        status: 'returned',
        thumbnailUrls: [PLACEHOLDER_JACKET],
    },
];
