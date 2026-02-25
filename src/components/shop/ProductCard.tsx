'use client';

import { InventoryItem } from '@/lib/api/types';

interface ProductCardProps {
    product: InventoryItem;
    onProductClick: (productId: string) => void;
    onLikeClick: (productId: string) => void;
    isLiked: boolean;
}

export default function ProductCard({
                                        product,
                                        onProductClick,
                                        onLikeClick,
                                        isLiked
                                    }: ProductCardProps) {
    return (
        <div
            onClick={() => onProductClick(product.id)}
            className="product-card group cursor-pointer"
        >
            {/* Product Image */}
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Brand Badge */}
                <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs font-semibold">
                    {product.brand}
                </div>

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLikeClick(product.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                    aria-label={isLiked ? 'Unlike' : 'Like'}
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

                {/* Unavailable Badge */}
                {!product.availability && (
                    <div className="absolute bottom-3 left-3 bg-gray-800 text-white px-3 py-1 text-xs">
                        Currently Unavailable
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div>
                <h3 className="text-sm font-normal mb-1 line-clamp-1">
                    {product.name}
                </h3>

                <p className="text-sm text-gray-700">
                    From CAD$ {product.price.toFixed(2)}
                </p>
            </div>
        </div>
    );
}