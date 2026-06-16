'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLikedItems } from '@/lib/hooks/useLikedItems';
import { InventoryItem } from '@/lib/api/types';
import { apiClient } from '@/lib/api/inventory';
import ProductCard from '@/components/shop/ProductCard';

export default function FavoritesPage() {
    const router = useRouter();
    const { likedItems, toggleLike, isLiked } = useLikedItems();
    const [favoriteProducts, setFavoriteProducts] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            if (likedItems.length === 0) {
                setFavoriteProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // apiClient.getInventory() normalizes AWS fields centrally
                const allProducts = await apiClient.getInventory();
                const likedSet    = new Set(likedItems);
                setFavoriteProducts(allProducts.filter((p) => likedSet.has(p.id)));
            } catch (error) {
                console.error('Error loading favourites:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [likedItems]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen px-8 py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">My Favourites</h1>

                {favoriteProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No favourites yet</h2>
                        <p className="text-gray-500 mb-6">Tap the heart on any item to save it here.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-500 mb-8">
                            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favoriteProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onProductClick={(id) => router.push(`/product/${id}`)}
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
