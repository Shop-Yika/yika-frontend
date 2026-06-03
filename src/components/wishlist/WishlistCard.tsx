'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { InventoryItem } from '@/lib/api/types';

export type WishlistCardProps = {
    product: InventoryItem;
    /** Whether this item is currently liked (drives the heart fill state). */
    isLiked: boolean;
    /** Toggle handler — called when the heart icon is clicked. */
    onToggleLike: (productId: string) => void;
};

/**
 * WishlistCard
 *
 * A single product tile rendered in the wishlist grid. Matches
 * `docs/dashboard/figma/4449-1696-wishlist.png` exactly:
 *
 *  - Square thumbnail with subtle bordered surface
 *  - Brand tag overlay (white background, black uppercase text) in the top-left
 *  - Filled heart icon in the top-right (always filled — items in the wishlist
 *    are by definition liked; clicking removes them)
 *  - Product name on a single line below the thumbnail
 *  - "From CAD$ XX.XX" price below the name
 *
 * The card is wrapped in a `<Link>` to the product detail page. The heart
 * button is rendered as a stop-propagation overlay so the click doesn't
 * bubble up to the link.
 *
 * Visual decisions are driven by the design tokens in `src/lib/design-tokens.ts`
 * (mirrored to CSS custom properties in `globals.css`). No raw hex literals.
 */
export function WishlistCard({ product, isLiked, onToggleLike }: WishlistCardProps) {
    const hasValidImage =
        product.imageUrl &&
        product.imageUrl !== '' &&
        !product.imageUrl.includes('placeholder');

    return (
        <article className="group relative flex flex-col">
            <Link
                href={`/product/${product.id}`}
                className="relative block aspect-square w-full overflow-hidden border border-border-default bg-border-subtle"
                aria-label={`View ${product.name}`}
            >
                {hasValidImage ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-border-subtle">
                        <span className="text-xs font-medium text-text-faint">
                            {product.brand}
                        </span>
                    </div>
                )}

                {/* Brand tag overlay — white pill, black uppercase text */}
                {product.brand && (
                    <span className="absolute top-3 left-3 bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-primary">
                        {product.brand}
                    </span>
                )}
            </Link>

            {/* Heart toggle — overlay button positioned above the link */}
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleLike(product.id);
                }}
                className="absolute top-2 right-2 z-10 flex h-9 w-9 items-center justify-center"
                aria-label={isLiked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                aria-pressed={isLiked}
            >
                <Image
                    src={
                        isLiked
                            ? '/assets/icons/Heart-Icon-Fill.svg'
                            : '/assets/icons/Heart-Icon-Outline.svg'
                    }
                    alt=""
                    aria-hidden
                    width={22}
                    height={20}
                />
            </button>

            <h3 className="mt-3 text-[14px] font-medium leading-snug text-text-primary line-clamp-2">
                <Link href={`/product/${product.id}`} className="hover:underline">
                    {product.name}
                </Link>
            </h3>

            <p className="mt-1 text-[14px] text-text-muted">
                From CAD$ {product.price.toFixed(2)}
            </p>
        </article>
    );
}

export default WishlistCard;
