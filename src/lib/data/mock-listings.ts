/**
 * Mock merchant listings.
 *
 * Coverage requirement (issue A2): at least one Live, one Pending, one Ended.
 */

import type { Listing } from './types';

export const MOCK_LISTINGS: Listing[] = [
    {
        id: 'l1',
        name: 'Silk Midi Dress',
        category: 'Dresses',
        brand: 'Reformation',
        price: 99,
        durationDays: 7,
        imageUrl:
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80',
        status: 'live',
    },
    {
        id: 'l2',
        name: 'Oversized Wool Blazer',
        category: 'Outerwear',
        brand: 'Ganni',
        price: 174,
        durationDays: 14,
        imageUrl:
            'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80',
        status: 'live',
    },
    {
        id: 'l3',
        name: 'Leather Mini Skirt',
        category: 'Bottoms',
        brand: 'Zara',
        price: 35,
        durationDays: 7,
        imageUrl:
            'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=200&q=80',
        status: 'live',
    },
    {
        id: 'l4',
        name: 'Cashmere Crew Sweater',
        category: 'Tops',
        brand: 'Sezane',
        price: 90,
        durationDays: 14,
        imageUrl:
            'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80',
        status: 'pending',
    },
    {
        id: 'l5',
        name: 'Floral Maxi Dress',
        category: 'Dresses',
        brand: 'H&M',
        price: 28,
        durationDays: 7,
        imageUrl:
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&q=80',
        status: 'ended',
    },
    {
        id: 'l6',
        name: 'Cropped Denim Jacket',
        category: 'Outerwear',
        brand: 'Zara',
        price: 30,
        durationDays: 14,
        imageUrl:
            'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=200&q=80',
        status: 'ended',
    },
];
