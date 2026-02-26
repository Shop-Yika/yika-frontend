'use client';

import Image from 'next/image';
import { InventoryItem } from '@/lib/api/types';

interface ProductCardProps {
    product: InventoryItem;
    onProductClick: (productId: string) => void;
    onLikeClick: (productId: string) => void;
    isLiked: boolean;
    isPlaceholder?: boolean;
}

export default function ProductCard({
                                        product,
                                        onProductClick,
                                        onLikeClick,
                                        isLiked,
                                        isPlaceholder = false
                                    }: ProductCardProps) {
    const handleClick = () => {
        if (isPlaceholder) return;
        onProductClick(product.id);
    };

    const hasValidImage = product.imageUrl &&
        product.imageUrl !== '' &&
        !product.imageUrl.includes('placeholder');

    return (
        <div
            onClick={handleClick}
            className={`product-card group ${isPlaceholder ? 'cursor-default opacity-75' : 'cursor-pointer'}`}
        >
            {/* Product Image */}
            <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden mb-3 rounded-lg">
                {hasValidImage ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className={`object-cover ${!isPlaceholder && 'group-hover:scale-105'} transition-transform duration-300`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={(e) => {
                            // Hide the image and show placeholder
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.style.display = 'none';
                        }}
                    />
                ) : (
                    // Gray placeholder when no image
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 p-4">
                        <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-500 text-center font-medium">Image Coming Soon</p>
                        <p className="text-xs text-gray-400 text-center mt-1">{product.brand}</p>
                    </div>
                )}

                {/* Brand Badge */}
                <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs font-semibold uppercase tracking-wide z-10">
                    {product.brand}
                </div>

                {/* Like Button - Hidden for placeholders */}
                {!isPlaceholder && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onLikeClick(product.id);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-10"
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                        title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <svg
                            className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'fill-none text-gray-700'}`}
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
                )}

                {/* Status Badges */}
                <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                    {isPlaceholder ? (
                        <div className="bg-yellow-500 text-white px-3 py-1 text-xs font-semibold uppercase">
                            Coming Soon
                        </div>
                    ) : !product.availability && (
                        <div className="bg-red-600 text-white px-3 py-1 text-xs font-semibold">
                            Unavailable
                        </div>
                    )}

                    {!isPlaceholder && product.stock === 0 && (
                        <div className="bg-gray-800 text-white px-3 py-1 text-xs font-semibold">
                            Out of Stock
                        </div>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div>
                <h3 className="text-sm font-normal mb-1 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                </h3>

                {!isPlaceholder && (
                    <div className="flex items-baseline justify-between">
                        <p className="text-sm font-medium text-gray-900">
                            CAD$ {product.price.toFixed(2)}
                        </p>

                        {product.rating && (
                            <div className="flex items-center text-xs text-gray-600">
                                <svg className="w-3 h-3 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                                {product.rating.toFixed(1)}
                            </div>
                        )}
                    </div>
                )}

                {!isPlaceholder && product.color && (
                    <p className="text-xs text-gray-500 mt-1">{product.color}</p>
                )}
            </div>
        </div>
    );
}