import { InventoryItem } from '@/lib/api/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: InventoryItem[];
    onProductClick: (productId: string) => void;
    onLikeClick: (productId: string) => void;
    isLiked: (productId: string) => boolean;
}

export default function ProductGrid({
                                        products,
                                        onProductClick,
                                        onLikeClick,
                                        isLiked
                                    }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">No items found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <section className="w-full max-w-300">

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-6 sm:gap-y-10 w-full">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                    onLikeClick={onLikeClick}
                    isLiked={isLiked(product.id)}
                />
            ))}
        </div>
        </section>
    );
}