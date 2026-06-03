'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FilterOptions, InventoryItem } from '@/lib/api/types';
import { applyFiltersAndSort } from '@/lib/utils';
import { useLikedItems } from '@/lib/hooks/useLikedItems';
import FilterSidebar from '@/components/filters/FilterSidebar';
import FilterButton from '@/components/filters/FilterButton';
import { WishlistGrid } from './WishlistGrid';

/**
 * Raw shape coming back from `/api/inventory` (mirrors the favorites page).
 * Kept loose because the backend response is unstable and not under our control.
 */
type RawInventoryItem = {
    ItemID?: string;
    id?: string;
    ItemName?: string;
    name?: string;
    description?: string;
    price?: number | string;
    category?: string;
    brand?: string;
    thumbnail?: string;
    imageUrl?: string;
    images?: string[];
    gender?: string;
    occasion?: string | string[];
    color?: string;
    sizes?: { size?: string; in_stock?: number }[];
    availability?: boolean;
    tags?: string[];
    rating?: number;
    reviews?: number;
};

function mapRawItem(raw: RawInventoryItem): InventoryItem {
    const totalStock = raw.sizes
        ? raw.sizes.reduce((sum, s) => sum + (s.in_stock || 0), 0)
        : 0;

    const sizeStrings = raw.sizes
        ? raw.sizes.map((s) => s.size).filter((s): s is string => Boolean(s))
        : [];

    const occasion = Array.isArray(raw.occasion) ? raw.occasion[0] : raw.occasion;

    const priceNum =
        typeof raw.price === 'number'
            ? raw.price
            : parseFloat(raw.price ?? '0') || 0;

    return {
        id: raw.ItemID ?? raw.id ?? '',
        name: raw.ItemName ?? raw.name ?? 'Untitled',
        description: raw.description ?? '',
        price: priceNum,
        category: raw.category ?? 'Uncategorized',
        brand: raw.brand ?? '',
        imageUrl: raw.thumbnail ?? raw.imageUrl ?? raw.images?.[0] ?? '',
        images: raw.images ?? [],
        stock: String(totalStock),
        gender:
            raw.gender === 'Men' || raw.gender === 'Unisex' || raw.gender === 'Women'
                ? raw.gender
                : 'Women',
        occasion,
        color: raw.color ?? '',
        sizes: sizeStrings,
        availability: raw.availability !== undefined ? raw.availability : totalStock > 0,
        tags: raw.tags ?? [],
        rating: raw.rating,
        reviews: raw.reviews,
    };
}

/**
 * Top-level wishlist UI.
 *
 * Pulls the liked-item IDs from the `useLikedItems` localStorage hook (Q1
 * default: keep client-side storage). Fetches the full inventory from
 * `/api/inventory` and intersects the two to produce the displayed grid.
 *
 * Filter behaviour mirrors the shop browse page:
 *  - User adjusts filters in the sidebar → pendingFilters update
 *  - User clicks "SHOW RESULTS" → pendingFilters become appliedFilters
 *  - Grid re-renders against the applied filter set
 *
 * The "Clear all" button inside `<FilterSidebar>` resets the pending set;
 * applying those cleared filters requires the user to click SHOW RESULTS,
 * which matches the shop browse UX.
 */
export function WishlistView() {
    const { likedItems, toggleLike, isLiked, isLoaded } = useLikedItems();

    const [allProducts, setAllProducts] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingFilters, setPendingFilters] = useState<FilterOptions>({});
    const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({});
    const [showSidebar, setShowSidebar] = useState(false);

    // Fetch the full product catalog once on mount. We intersect against the
    // liked-item IDs locally — there's no backend filter endpoint for "items
    // by id list" today.
    useEffect(() => {
        let cancelled = false;

        async function fetchProducts() {
            try {
                const response = await fetch('/api/inventory');
                if (!response.ok) {
                    if (!cancelled) setAllProducts([]);
                    return;
                }
                const rawData = await response.json();
                const items: RawInventoryItem[] = Array.isArray(rawData)
                    ? rawData
                    : rawData.data ?? [];
                if (!cancelled) {
                    setAllProducts(items.map(mapRawItem));
                }
            } catch {
                if (!cancelled) setAllProducts([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchProducts();
        return () => {
            cancelled = true;
        };
    }, []);

    // Narrow the catalog down to the liked items first, then apply the
    // user-selected filters and sort. Memoised because the inputs change
    // independently and the work is non-trivial when N is large.
    const visibleProducts = useMemo(() => {
        if (!isLoaded) return [];
        const likedSet = new Set(likedItems);
        const onlyLiked = allProducts.filter((p) => likedSet.has(p.id));
        return applyFiltersAndSort(onlyLiked, appliedFilters);
    }, [allProducts, likedItems, appliedFilters, isLoaded]);

    // Total liked count — surfaced in the page header. Counted off the
    // liked-id set itself so the header stays accurate even when the
    // catalog hasn't loaded yet (or some ids no longer exist in inventory).
    const totalLikedCount = likedItems.length;

    const handleFilterChange = (partial: Partial<FilterOptions>) => {
        setPendingFilters((prev) => ({ ...prev, ...partial }));
    };

    const handleApplyFilters = () => {
        setAppliedFilters(pendingFilters);
        setShowSidebar(false);
    };

    // Empty state: shopper has nothing in their wishlist at all.
    // (Distinct from the "no matches" empty state inside the grid.)
    const isWishlistEmpty = isLoaded && totalLikedCount === 0;

    return (
        <section className="-mx-4 -my-6 md:-mx-8 md:-my-12">
            <div className="flex flex-col bg-border-subtle lg:flex-row">
                {/* Desktop filter sidebar — sticky to the viewport so it stays
                    in view as the grid scrolls. Hidden under lg. */}
                <aside className="sticky top-[76px] hidden h-[calc(100vh-76px)] w-full max-w-[320px] flex-shrink-0 overflow-hidden border-r border-border-default bg-surface lg:block">
                    <FilterSidebar
                        filters={pendingFilters}
                        onFilterChange={handleFilterChange}
                        onApplyFilters={handleApplyFilters}
                        allProducts={allProducts}
                    />
                </aside>

                {/* Mobile sidebar — slide-in modal triggered by the
                    `<FilterButton>` below the page header. */}
                {showSidebar && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setShowSidebar(false)}
                            aria-hidden
                        />
                        <div className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-surface shadow-xl">
                            <div className="flex items-center justify-between border-b border-border-default p-4">
                                <h2 className="text-lg font-bold text-text-primary">
                                    Filters &amp; Sort
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setShowSidebar(false)}
                                    className="rounded-full p-2 transition-colors hover:bg-border-subtle"
                                    aria-label="Close filters"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <FilterSidebar
                                    filters={pendingFilters}
                                    onFilterChange={handleFilterChange}
                                    onApplyFilters={handleApplyFilters}
                                    allProducts={allProducts}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Main content column */}
                <div className="flex-1 px-6 py-8 lg:px-12">
                    <header className="mb-6 flex items-baseline gap-3">
                        <h1 className="text-[24px] font-semibold text-text-primary">
                            Wishlist
                        </h1>
                        <span className="text-[13px] text-text-muted">
                            {totalLikedCount} {totalLikedCount === 1 ? 'item' : 'items'}
                        </span>
                    </header>

                    <FilterButton
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />

                    {isWishlistEmpty ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <p className="mb-2 text-[18px] font-semibold text-text-primary">
                                Your wishlist is empty.
                            </p>
                            <p className="text-[15px] text-text-muted">
                                Browse items to add some.
                            </p>
                        </div>
                    ) : loading && totalLikedCount > 0 && visibleProducts.length === 0 ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="h-10 w-10 animate-spin rounded-full border-2 border-text-muted border-t-transparent" />
                        </div>
                    ) : (
                        <WishlistGrid
                            products={visibleProducts}
                            isLiked={isLiked}
                            onToggleLike={toggleLike}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}

export default WishlistView;
