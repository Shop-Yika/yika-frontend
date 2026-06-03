/**
 * Mock shopper orders + order details.
 *
 * Coverage requirements (see issue A2):
 *   - At least one entry per `OrderStatus` value
 *   - At least one multi-item order (itemCount > 1)
 *   - At least one single-item order
 *
 * When the real backend lands, replace this file with a fetcher in
 * `repositories.ts`.
 */

import type { Order, OrderDetail } from './types';

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

export const MOCK_ORDERS: Order[] = [
    {
        id: 'o1',
        orderNumber: 'YK-2026-001',
        itemCount: 2,
        sellerHandle: 'kirby',
        buyerName: 'Maya Chen',
        total: 220,
        orderDate: 'Mar 10, 2026',
        status: 'OrderPlaced',
        thumbnailUrls: [PLACEHOLDER_DRESS, PLACEHOLDER_BLAZER],
    },
    {
        id: 'o2',
        orderNumber: 'YK-2026-002',
        itemCount: 1,
        sellerHandle: 'sezane',
        buyerName: 'Sophia Rodriguez',
        total: 110,
        orderDate: 'Mar 8, 2026',
        status: 'Processing',
        thumbnailUrls: [PLACEHOLDER_SWEATER],
    },
    {
        id: 'o3',
        orderNumber: 'YK-2026-003',
        itemCount: 1,
        sellerHandle: 'reformation',
        buyerName: 'Addie Johnson',
        total: 99,
        orderDate: 'Mar 5, 2026',
        status: 'Shipped',
        thumbnailUrls: [PLACEHOLDER_DRESS],
    },
    {
        id: 'o4',
        orderNumber: 'YK-2026-004',
        itemCount: 3,
        sellerHandle: 'kirby',
        buyerName: 'Addie Johnson',
        total: 245,
        orderDate: 'Feb 28, 2026',
        status: 'Delivered',
        thumbnailUrls: [PLACEHOLDER_SKIRT, PLACEHOLDER_DRESS, PLACEHOLDER_BLAZER],
    },
    {
        id: 'o5',
        orderNumber: 'YK-2026-005',
        itemCount: 1,
        sellerHandle: 'zara',
        buyerName: 'Maryanne Zaheer',
        total: 55,
        orderDate: 'Feb 22, 2026',
        status: 'Returned',
        thumbnailUrls: [PLACEHOLDER_JACKET],
    },
];

/**
 * Per-order detail records (shipment, line items, payment).
 * Keyed by `orderNumber` to match the URL parameter shape used in
 * `/profile/shopper/orders/[orderNumber]`.
 */
export const MOCK_ORDER_DETAILS: Record<string, OrderDetail> = {
    'YK-2026-001': {
        ...MOCK_ORDERS[0],
        shippingCarrier: 'UPS',
        trackingNumber: '1Z999AA10123456784',
        shippingAddress: {
            name: 'Tatiana Cole',
            street: '1024 Magnolia Lane',
            cityStateZip: 'Bozeman, MT 59715',
        },
        lineItems: [
            {
                product: 'Silk Midi Dress — Reformation',
                sku: 'RFM-SMD-001',
                quantity: 1,
                unitPrice: 99,
            },
            {
                product: 'Oversized Wool Blazer — Ganni',
                sku: 'GAN-OWB-014',
                quantity: 1,
                unitPrice: 121,
            },
        ],
        paymentMethodLast4: '4242',
    },
    'YK-2026-002': {
        ...MOCK_ORDERS[1],
        shippingCarrier: 'USPS',
        trackingNumber: '9400111899223456789012',
        shippingAddress: {
            name: 'Tatiana Cole',
            street: '1024 Magnolia Lane',
            cityStateZip: 'Bozeman, MT 59715',
        },
        lineItems: [
            {
                product: 'Cashmere Crew Sweater — Sezane',
                sku: 'SZN-CCS-007',
                quantity: 1,
                unitPrice: 110,
            },
        ],
        paymentMethodLast4: '4242',
    },
    'YK-2026-003': {
        ...MOCK_ORDERS[2],
        shippingCarrier: 'FedEx',
        trackingNumber: '794635123456',
        shippingAddress: {
            name: 'Tatiana Cole',
            street: '1024 Magnolia Lane',
            cityStateZip: 'Bozeman, MT 59715',
        },
        lineItems: [
            {
                product: 'Silk Midi Dress — Reformation',
                sku: 'RFM-SMD-002',
                quantity: 1,
                unitPrice: 99,
            },
        ],
        paymentMethodLast4: '4242',
    },
    'YK-2026-004': {
        ...MOCK_ORDERS[3],
        shippingCarrier: 'UPS',
        trackingNumber: '1Z999AA10123456785',
        shippingAddress: {
            name: 'Tatiana Cole',
            street: '1024 Magnolia Lane',
            cityStateZip: 'Bozeman, MT 59715',
        },
        lineItems: [
            {
                product: 'Leather Mini Skirt — Zara',
                sku: 'ZRA-LMS-022',
                quantity: 1,
                unitPrice: 35,
            },
            {
                product: 'Silk Midi Dress — Reformation',
                sku: 'RFM-SMD-003',
                quantity: 1,
                unitPrice: 99,
            },
            {
                product: 'Oversized Wool Blazer — Ganni',
                sku: 'GAN-OWB-015',
                quantity: 1,
                unitPrice: 111,
            },
        ],
        paymentMethodLast4: '4242',
    },
    'YK-2026-005': {
        ...MOCK_ORDERS[4],
        shippingCarrier: 'USPS',
        trackingNumber: '9400111899223456789013',
        shippingAddress: {
            name: 'Tatiana Cole',
            street: '1024 Magnolia Lane',
            cityStateZip: 'Bozeman, MT 59715',
        },
        lineItems: [
            {
                product: 'Cropped Denim Jacket — Zara',
                sku: 'ZRA-CDJ-009',
                quantity: 1,
                unitPrice: 55,
            },
        ],
        paymentMethodLast4: '4242',
    },
};
