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
            className={`relative w-full h-87.5 sm:h-100 md:h-121.5 mx-auto ${isPlaceholder ? 'cursor-default opacity-75' : 'cursor-pointer'}`}
        >
            {/* Product Image */}
            <div className="absolute top-0 left-0 w-full h-62.5 sm:h-75 md:h-96 bg-[#CBD9FF] border border-black/30 overflow-hidden">
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
                        className="absolute top-0 right-0 w-[40px] sm:w-[53px] h-[40px] sm:h-[53px] flex items-center justify-center"
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                        title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Image
                            src={
                                isLiked
                                    ? "/assets/icons/Heart-Icon-Fill.svg"
                                    : "/assets/icons/Heart-Icon-Outline.svg"
                            }
                            alt="Heart Icon"
                            width={26}
                            height={23}
                        />

                    </button>
                )}

                {/* Status Badges */}
                <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                    {isPlaceholder ? (
                        <div className="bg-yellow-500 px-3 py-1 text-xs font-semibold uppercase">
                            Coming Soon
                        </div>
                    ) : !product.availability && (
                        <div className="bg-red-600  px-3 py-1 text-xs font-semibold">
                            Unavailable
                        </div>
                    )}

                    {!isPlaceholder && Number(product.stock) === 0 && (
                        <div className="bg-gray-800 text-white px-3 py-1 text-xs font-semibold">
                            Out of Stock
                        </div>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div>
                <h3 className="absolute top-65 sm:top-77.5 md:top-101 left-0 mb-0 w-full text-[14px] sm:text-[16.6px] font-['Satoshi'] font-medium leading-5 sm:leading-5.5 tracking-[-0.01em] text-black">
                    {product.name}
                </h3>

                {!isPlaceholder && (
                    <div className="flex">
                        <p className="absolute top-[290px] sm:top-[340px] md:top-[433px] left-0 mt-4 text-[14px] sm:text-[16.6px] font-['Inter'] leading-[18px] sm:leading-[20px] tracking-[-0.01em] text-black">
                            CAD$ {product.price.toFixed(2)}
                        </p>


                    </div>
                )}

                {!isPlaceholder && product.color && (
                    <p className="text-xs text-gray-500 mt-1">{product.color}</p>
                )}
            </div>
        </div>
    );
}