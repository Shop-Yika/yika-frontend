'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { InventoryItem } from '@/lib/api/types';
import { useLikedItems } from '@/lib/hooks/useLikedItems';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [product, setProduct] = useState<InventoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    // Rental date states
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [rentalDays, setRentalDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const { toggleLike, isLiked } = useLikedItems();

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    // Calculate rental days and total price when dates change
    useEffect(() => {
        if (startDate && endDate && product) {
            const days = differenceInDays(endDate, startDate) + 1; // Include both start and end day
            setRentalDays(days);
            setTotalPrice(product.price * days);
        } else {
            setRentalDays(0);
            setTotalPrice(0);
        }
    }, [startDate, endDate, product]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔍 Fetching product ID:', productId);

            // Fetch all products and find the one we need (fallback method)
            const response = await fetch('/api/inventory');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const rawData = await response.json();
            const items = Array.isArray(rawData) ? rawData : (rawData.data || []);

            console.log('📦 Total products fetched:', items.length);
            console.log('🔍 Looking for product ID:', productId);

            // Find product by ID (check both ItemID and id fields)
            const foundItem = items.find((item: any) => {
                const itemId = item.ItemID || item.id;
                console.log('Checking item:', itemId);
                return itemId === productId;
            });

            if (!foundItem) {
                console.error('❌ Product not found in inventory');
                throw new Error('Product not found');
            }

            console.log('✅ Found product:', foundItem);

            // Map AWS fields to frontend fields
            const mappedProduct: InventoryItem = {
                id: foundItem.ItemID || foundItem.id,
                name: foundItem.ItemName || foundItem.name,
                description: foundItem.description || `${foundItem.ItemName || foundItem.name} from ${foundItem.brand || 'our collection'}`,
                price: typeof foundItem.price === 'number' ? foundItem.price : parseFloat(foundItem.price) || 0,
                category: foundItem.category || 'Uncategorized',
                brand: foundItem.brand || 'Unknown',
                imageUrl: foundItem.thumbnail || foundItem.imageUrl || foundItem.images?.[0] || '',
                images: foundItem.images || (foundItem.thumbnail ? [foundItem.thumbnail] : []),
                stock: foundItem.sizes ? foundItem.sizes.reduce((sum: number, s: any) => sum + (s.in_stock || 0), 0) : 0,
                gender: foundItem.gender || 'Women',
                occasion: Array.isArray(foundItem.occasion) ? foundItem.occasion[0] : foundItem.occasion,
                color: foundItem.color || '',
                sizes: foundItem.sizes ? foundItem.sizes.map((s: any) => s.size).filter(Boolean) : [],
                availability: foundItem.availability !== undefined ? foundItem.availability : true,
                tags: foundItem.tags || [],
                rating: foundItem.rating,
                reviews: foundItem.reviews,
                createdAt: foundItem.createdAt,
                updatedAt: foundItem.updatedAt,
            };

            setProduct(mappedProduct);

        } catch (err) {
            console.error('❌ Error fetching product:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!startDate || !endDate) {
            alert('Please select rental dates first');
            return;
        }
        setShowLoginPrompt(true);
    };

    const handleRentNow = () => {
        if (!startDate || !endDate) {
            alert('Please select rental dates first');
            return;
        }
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
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 mb-2 font-semibold">Product Not Found</p>
                <p className="text-gray-600 text-sm mb-4">{error || 'The product you are looking for does not exist'}</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
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
        <div className="max-w-7xl mx-auto px-4 py-8 ">
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
                    onClick={() => router.push('/')}
                    className="text-blue-600 hover:underline"
                >
                    Shop
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
                            <Image
                                src={images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                                onError={(e) => {
                                    console.error('Image failed to load');
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
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 z-10"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 z-10"
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
                                    className={`relative aspect-square rounded overflow-hidden border-2 ${
                                        selectedImage === index ? 'border-black' : 'border-gray-200'
                                    }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="100px"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Details */}
                <div>
                    {/* Product Name and Like */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">
                                From <span className="underline">{product.brand}</span>
                            </p>
                            <h1 className="text-3xl font-normal">{product.name}</h1>
                        </div>
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
                        <p className="text-sm">
                            from <span className="text-lg font-semibold">CAD$ {product.price.toFixed(2)}</span><span className='text-gray-600'>/day</span>
                        </p>
                    </div>

                    {/* Availability */}
                    {/*
                    <div className="mb-6">
                        {product.availability && product.stock > 0 ? (
                            <p className="text-green-600 font-medium flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Available for rent
                                {product.stock > 0 && ` (${product.stock} in stock)`}
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

                    */}

                    {/* Description */}
                    {product.description && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Description</h2>
                            <p className="text-gray-700">{product.description}</p>
                        </div>
                    )}

                    {/* Product Details */}
                    <div className="mb-6 border-t pt-6">
                        <h3 className="font-semibold italic mb-3">SELLERS NOTES</h3>
                        <dl className="flex flex-col gap-1 text-sm">
                            <div className="flex gap-4">
                                <dt className="text-gray-600">Brand:</dt>
                                <dd className="font-medium">{product.brand}</dd>
                            </div>

                            <div className="flex gap-4">
                                <dt className="text-gray-600">Category:</dt>
                                <dd className="font-medium">{product.category}</dd>
                            </div>

                            {product.color && (
                                <div className="flex gap-4">
                                    <dt className="text-gray-600">Color:</dt>
                                    <dd className="font-medium">{product.color}</dd>
                                </div>
                            )}

                            {product.occasion && (
                                <div className="flex gap-4">
                                    <dt className="text-gray-600">Occasion:</dt>
                                    <dd className="font-medium capitalize">{product.occasion}</dd>
                                </div>
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
                                        className="px-4 py-2 border border-gray-300 rounded text-sm hover:border-black transition-colors"
                                    >
                                        {size}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Date Picker Section */}
                    <div className="mb-6 border-t pt-6">
                        <h3 className="font-semibold mb-4">Select Rental Dates</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white">
                                            {startDate ? (
                                                <span className="text-gray-900 text-sm">
                                                    {format(startDate, 'PPP')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 text-sm">Pick a date</span>
                                            )}
                                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!startDate}
                                        >
                                            {endDate ? (
                                                <span className="text-gray-900 text-sm">
                                                    {format(endDate, 'PPP')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 text-sm">Pick a date</span>
                                            )}
                                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            disabled={(date) => !startDate || date < startDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Rental Summary */}
                        {startDate && endDate && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-700">Rental Period:</span>
                                    <span className="font-semibold">{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                    <span>Daily Rate:</span>
                                    <span>CAD$ {product.price.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-blue-300 pt-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Total Price:</span>
                                        <span className="text-xl font-bold text-blue-600">CAD$ {totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4 mb-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.availability || product.stock === 0}
                            className="flex-1 px-6 py-3 border border-black text-black rounded-lg hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400 font-medium transition-colors"
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