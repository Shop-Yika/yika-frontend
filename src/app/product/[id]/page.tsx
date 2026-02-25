'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InventoryItem } from '@/lib/api/types';
import { useLikedItems } from '@/lib/hooks/useLikedItems';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [product, setProduct] = useState<InventoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const { toggleLike, isLiked } = useLikedItems();

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔍 Fetching product:', productId);

            // Fetch from API
            const response = await fetch(`/api/inventory/${productId}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const rawData = await response.json();
            console.log('📦 Raw product data:', rawData);

            // Handle both formats
            let item = rawData.data || rawData;

            // Map AWS fields to frontend fields
            const mappedProduct: InventoryItem = {
                id: item.ItemID || item.id,
                name: item.ItemName || item.name,
                description: item.description || `${item.ItemName || item.name} from ${item.brand || 'our collection'}`,
                price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
                category: item.category || 'Uncategorized',
                brand: item.brand || 'Unknown',
                imageUrl: item.thumbnail || item.imageUrl || item.images?.[0] || '',
                images: item.images || (item.thumbnail ? [item.thumbnail] : []),
                stock: item.sizes ? item.sizes.reduce((sum: number, s: any) => sum + (s.in_stock || 0), 0) : 0,
                gender: item.gender || 'Women',
                occasion: Array.isArray(item.occasion) ? item.occasion[0] : item.occasion,
                color: item.color || '',
                sizes: item.sizes ? item.sizes.map((s: any) => s.size).filter(Boolean) : [],
                availability: item.availability !== undefined ? item.availability : true,
                tags: item.tags || [],
                rating: item.rating,
                reviews: item.reviews,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            };

            console.log('✅ Mapped product:', mappedProduct);
            setProduct(mappedProduct);

        } catch (err) {
            console.error('❌ Error fetching product:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        setShowLoginPrompt(true);
    };

    const handleRentNow = () => {
        setShowLoginPrompt(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p className="text-red-600 mb-4">Error: {error || 'Product not found'}</p>
                <button
                    onClick={() => router.push('/shop')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Back to Shop
                </button>
            </div>
        );
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl
            ? [product.imageUrl]
            : [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold mb-4">Sign in to continue</h3>
                        <p className="text-gray-600 mb-6">
                            To add items to your rental bag, please sign in to your account.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => alert('Login page coming soon!')}
                                className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
                <button
                    onClick={() => router.push('/shop')}
                    className="text-blue-600 hover:underline"
                >
                    Shop
                </button>
                <span className="mx-2">/</span>
                <button
                    onClick={() => router.push(`/shop?category=${product.category}`)}
                    className="text-blue-600 hover:underline"
                >
                    {product.category}
                </button>
                <span className="mx-2">/</span>
                <span className="text-gray-600">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Product Images */}
                <div>
                    {/* Main Image */}
                    <div className="relative mb-4 bg-gray-200 rounded-lg overflow-hidden aspect-[3/4]">
                        {images.length > 0 && images[selectedImage] ? (
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                                <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-500">Image Coming Soon</p>
                            </div>
                        )}

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Images */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-6 gap-2">
                            {images.slice(0, 6).map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square rounded overflow-hidden border-2 ${
                                        selectedImage === index ? 'border-black' : 'border-gray-200'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Details */}
                <div>
                    {/* Seller Info */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            From <span className="underline">{product.brand || "Seller's closet"}</span>
                        </p>
                    </div>

                    {/* Product Name and Like */}
                    <div className="flex items-start justify-between mb-4">
                        <h1 className="text-3xl font-normal">{product.name}</h1>
                        <button
                            onClick={() => toggleLike(product.id)}
                            className="p-2"
                            aria-label={isLiked(product.id) ? 'Unlike' : 'Like'}
                        >
                            <svg
                                className={`w-7 h-7 ${isLiked(product.id) ? 'fill-red-500 text-red-500' : 'fill-none text-gray-700'}`}
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <p className="text-xl">
                            from <span className="font-semibold">CAD$ {product.price.toFixed(2)}</span>/rental
                        </p>
                    </div>

                    {/* Availability */}
                    <div className="mb-6">
                        {product.availability && product.stock > 0 ? (
                            <p className="text-green-600 font-medium flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Available for rent ({product.stock} in stock)
                            </p>
                        ) : (
                            <p className="text-red-600 font-medium flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Currently unavailable
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    {/* Product Details */}
                    <div className="mb-6 border-t pt-6">
                        <h3 className="font-semibold mb-3">Product Details</h3>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                            <dt className="text-gray-600">Brand:</dt>
                            <dd className="font-medium">{product.brand}</dd>

                            <dt className="text-gray-600">Category:</dt>
                            <dd className="font-medium">{product.category}</dd>

                            {product.color && (
                                <>
                                    <dt className="text-gray-600">Color:</dt>
                                    <dd className="font-medium">{product.color}</dd>
                                </>
                            )}

                            {product.occasion && (
                                <>
                                    <dt className="text-gray-600">Occasion:</dt>
                                    <dd className="font-medium capitalize">{product.occasion}</dd>
                                </>
                            )}
                        </dl>
                    </div>

                    {/* Available Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Available Sizes</h3>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes.map((size) => (
                                    <span
                                        key={size}
                                        className="px-4 py-2 border border-gray-300 rounded text-sm"
                                    >
                    {size}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                    {tag}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.availability || product.stock === 0}
                            className="flex-1 px-6 py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            Add to Bag
                        </button>
                        <button
                            onClick={handleRentNow}
                            disabled={!product.availability || product.stock === 0}
                            className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            Rent Now
                        </button>
                    </div>

                    {/* Guest Notice */}
                    <p className="text-xs text-gray-500 text-center">
                        Sign in to add items to your cart and checkout
                    </p>
                </div>
            </div>
        </div>
    );
}