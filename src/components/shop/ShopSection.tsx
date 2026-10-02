'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InventoryItem, FilterOptions } from '@/lib/api/types';
import { apiClient } from '@/lib/api/inventory';
import { applyFiltersAndSort } from '@/lib/utils';
// apiClient.getInventory() handles normalization centrally — no inline mapping here
import { useLikedItems } from '@/lib/hooks/useLikedItems';
import FilterSidebar from '../filters/FilterSidebar';
import FilterButton from '../filters/FilterButton';
import ProductGrid from './ProductGrid';
import ShopHeroBanner from "@/components/shop/ShopHeroBanner";

interface ShopSectionProps {
    products?: InventoryItem[];
}

export default function ShopSection({ products: initialProducts }: ShopSectionProps) {
    const router = useRouter();
    const [products, setProducts] = useState<InventoryItem[]>(initialProducts || []);
    const [filteredProducts, setFilteredProducts] = useState<InventoryItem[]>(initialProducts || []);
    const [loading, setLoading] = useState(!initialProducts);
    const [error, setError] = useState<string | null>(null);

    // Separate pending and applied filters
    const [pendingFilters, setPendingFilters] = useState<FilterOptions>({});
    const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({});

    // Mobile sidebar toggle
    const [showSidebar, setShowSidebar] = useState(false);

    const { toggleLike, isLiked } = useLikedItems();

    // Fetch products if not provided
    useEffect(() => {
        if (!initialProducts) {
            fetchProducts();
        }
    }, [initialProducts]);

    // Apply filters only when appliedFilters change (when "Show Results" is clicked)
    useEffect(() => {
        if (products && products.length > 0) {
            setFilteredProducts(applyFiltersAndSort(products, appliedFilters));
        } else {
            setFilteredProducts([]);
        }
    }, [products, appliedFilters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            // apiClient.getInventory() routes through /api/inventory and runs
            // normalizeItem — single source of truth for AWS field mapping.
            const products = await apiClient.getInventory();
            setProducts(products);
            setFilteredProducts(products);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Update pending filters (doesn't apply yet)
    const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
        setPendingFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleApplyFilters = () => {
        setAppliedFilters(pendingFilters);
        setShowSidebar(false);
    };

    const handleProductClick = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <button
                    onClick={fetchProducts}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <section className="relative max-w-full min-h-screen flex flex-col lg:flex-row bg-[#F6F6F6]">
            {/* Desktop Filter Sidebar - Always visible on lg+ */}
            <div className="hidden lg:block w-full max-w-[363.84px] border-r border-black/30 bg-white z-10 sticky top-[76px] h-[calc(100vh-76px)] overflow-hidden">
                <FilterSidebar
                    filters={pendingFilters}
                    onFilterChange={handleFilterChange}
                    onApplyFilters={handleApplyFilters}
                    allProducts={products}
                />
            </div>

            {/* Mobile Filter Sidebar - Slide-in modal */}
            {showSidebar && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setShowSidebar(false)}
                    />

                    {/* Sidebar Content */}
                    <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl animate-slide-in-left">
                        {/* Close Button */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-xl font-['Satoshi'] font-bold">Filters & Sort</h2>
                            <button
                                onClick={() => setShowSidebar(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Filter Content */}
                        <div className="h-[calc(100vh-80px)]">
                            <FilterSidebar
                                filters={pendingFilters}
                                onFilterChange={handleFilterChange}
                                onApplyFilters={handleApplyFilters}
                                allProducts={products}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 relative">
                <ShopHeroBanner />

                {/* Mobile Filter Button */}
                <FilterButton
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />

                {/* Padding and alignment */}
                <div className="px-4 sm:px-6 lg:px-12 py-6">
                    <div className="w-full max-w-[1200px] px-4 md:px-10 mx-auto mb-10">
                        {/* Section Header */}
                        <div className="w-full max-w-none mb-8">
                            <h2 className="text-[19px] font-['Satoshi'] font-bold leading-[29px] uppercase text-[#1E1E1E] pl-[18px]">
                                SUMMER STYLE EDIT
                            </h2>
                            <p className="text-sm text-gray-600 text-center">
                                Showing {filteredProducts?.length || 0} of {products?.length || 0} items
                            </p>
                        </div>

                        {/* Product Grid */}
                        <ProductGrid
                            products={filteredProducts || []}
                            onProductClick={handleProductClick}
                            onLikeClick={toggleLike}
                            isLiked={isLiked}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}