'use client';

import type { InventoryItem } from '@/lib/api/types';
import { WishlistCard } from './WishlistCard';

export type WishlistGridProps = {
    products: InventoryItem[];
    isLiked: (productId: string) => boolean;
    onToggleLike: (productId: string) => void;
};

/**
 * Responsive grid of wishlist items.
 *
 * - 3 columns on lg+
 * - 2 columns on sm/md
 * - 1 column on mobile
 *
 * The empty state for a fully-empty wishlist is owned by the parent
 * `<WishlistView>`; this component only renders the "no items match the
 * active filters" empty state, which is contextually different copy.
 */
export function WishlistGrid({ products, isLiked, onToggleLike }: WishlistGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-[15px] text-text-muted">
                    No items match the current filters.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
                <WishlistCard
                    key={product.id}
                    product={product}
                    isLiked={isLiked(product.id)}
                    onToggleLike={onToggleLike}
                />
            ))}
        </div>
    );
}

export default WishlistGrid;
