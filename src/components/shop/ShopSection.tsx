'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InventoryItem, FilterOptions } from '@/lib/api/types';
import { apiClient } from '@/lib/api/inventory';
import { applyFiltersAndSort } from '@/lib/utils';
import { useLikedItems } from '@/lib/hooks/useLikedItems';
import FilterSidebar from '../filters/FilterSidebar';
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

    const [filters, setFilters] = useState<FilterOptions>({});
    const { toggleLike, isLiked } = useLikedItems();

    // Fetch products if not provided
    useEffect(() => {
        if (!initialProducts) {
            fetchProducts();
        }
    }, [initialProducts]);

    // Apply filters whenever products or filters change
    useEffect(() => {
        if (products && products.length > 0) {
            console.log('🔍 Applying filters to', products.length, 'products');
            console.log('🔍 Active filters:', filters);

            const filtered = applyFiltersAndSort(products, filters);

            console.log('✅ Filtered result:', filtered.length, 'products');
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [products, filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Fetching products from API...');

            // Fetch raw data from API
            const response = await fetch('/api/inventory');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const rawData = await response.json();
            console.log('📦 Raw API response:', rawData);

            // Handle both formats: direct array or {data: [...]}
            let items: any[] = [];

            if (Array.isArray(rawData)) {
                items = rawData;
            } else if (rawData.data && Array.isArray(rawData.data)) {
                items = rawData.data;
            } else {
                console.error('❌ Unexpected response format');
                throw new Error('Unexpected API response format');
            }

            console.log('📊 Received', items.length, 'items from API');

            // 🔥 MAP AWS FIELDS TO FRONTEND FIELDS
            const mappedProducts: InventoryItem[] = items.map((item, index) => {
                console.log(`Mapping item ${index + 1}:`, item);

                // Calculate total stock from sizes array
                const totalStock = item.sizes && Array.isArray(item.sizes)
                    ? item.sizes.reduce((sum: number, s: any) => sum + (s.in_stock || 0), 0)
                    : 0;

                // Extract size strings
                const sizeStrings = item.sizes && Array.isArray(item.sizes)
                    ? item.sizes.map((s: any) => s.size).filter(Boolean)
                    : [];

                // Handle occasion (could be string or array)
                const occasion = Array.isArray(item.occasion)
                    ? item.occasion[0]
                    : item.occasion;

                return {
                    // 🔥 FIELD MAPPING (AWS → Frontend)
                    id: item.ItemID || item.id,
                    name: item.ItemName || item.name,
                    description: item.description || `${item.ItemName || item.name} from ${item.brand || 'our collection'}`,
                    price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
                    category: item.category || 'Uncategorized',
                    brand: item.brand || 'Unknown',
                    imageUrl: item.thumbnail || item.imageUrl || item.images?.[0] || '',
                    images: item.images || (item.thumbnail ? [item.thumbnail] : []),
                    stock: totalStock,
                    gender: item.gender || 'Women',
                    occasion: occasion,
                    color: item.color || '',
                    sizes: sizeStrings,
                    availability: item.availability !== undefined ? item.availability : totalStock > 0,
                    tags: item.tags || [],
                    rating: item.rating,
                    reviews: item.reviews,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                };
            });

            console.log('✅ Mapped products sample:', mappedProducts[0]);
            console.log('✅ Total mapped products:', mappedProducts.length);

            setProducts(mappedProducts);
            setFilteredProducts(mappedProducts); // Show all by default

        } catch (err) {
            console.error('❌ Error fetching products:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
        console.log('🔧 Filter changed:', newFilters);
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleApplyFilters = () => {
        console.log('✅ Apply filters button clicked');
        // Filters already applied via useEffect
    };

    const handleProductClick = (productId: string) => {
        console.log('🔗 Navigating to product:', productId);
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
            {/* Filter Sidebar - hidden on mobile, visible on lg */}
            <div className="hidden lg:block w-full max-w-[363.84px] border-r border-black/30 bg-white z-10 px-4 pt-6 lg:px-0 lg:pt-0 sticky top-[76px] h-screen overflow-none">
                <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onApplyFilters={handleApplyFilters}
                    allProducts={products}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 relative">
                <ShopHeroBanner />

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
        </section>
    );
}