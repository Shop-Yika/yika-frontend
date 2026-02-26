'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLikedItems } from '@/lib/hooks/useLikedItems';
import { InventoryItem } from '@/lib/api/types';
import ProductCard from '@/components/shop/ProductCard';

export default function FavoritesPage() {
    const router = useRouter();
    const { likedItems, toggleLike, isLiked } = useLikedItems();
    const [favoriteProducts, setFavoriteProducts] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, [likedItems]);

    const loadFavorites = async () => {
        if (likedItems.length === 0) {
            setFavoriteProducts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Fetch all products
            const response = await fetch('/api/inventory');
            const rawData = await response.json();
            const allProducts = Array.isArray(rawData) ? rawData : (rawData.data || []);

            // Map and filter favorites
            const favorites = allProducts
                .filter((item: any) => {
                    const itemId = item.ItemID || item.id;
                    return likedItems.includes(itemId);
                })
                .map((item: any) => ({
                    id: item.ItemID || item.id,
                    name: item.ItemName || item.name,
                    description: item.description || '',
                    price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
                    category: item.category || 'Uncategorized',
                    brand: item.brand || 'Unknown',
                    imageUrl: item.thumbnail || item.imageUrl || item.images?.[0] || '',
                    images: item.images || [],
                    stock: item.sizes ? item.sizes.reduce((sum: number, s: any) => sum + (s.in_stock || 0), 0) : 0,
                    gender: item.gender || 'Women',
                    occasion: Array.isArray(item.occasion) ? item.occasion[0] : item.occasion,
                    color: item.color || '',
                    sizes: item.sizes ? item.sizes.map((s: any) => s.size).filter(Boolean) : [],
                    availability: item.availability !== undefined ? item.availability : true,
                    tags: item.tags || [],
                    rating: item.rating,
                    reviews: item.reviews,
                }));

            setFavoriteProducts(favorites);
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-[76px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[76px] px-8 py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">My Favorites</h1>

                {favoriteProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
                        <p className="text-gray-500 mb-6">Start adding items to your favorites to see them here!</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-8">
                            You have {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} in your favorites
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favoriteProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onProductClick={handleProductClick}
                                    onLikeClick={toggleLike}
                                    isLiked={isLiked(product.id)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}