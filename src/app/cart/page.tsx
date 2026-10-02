'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useCart } from '@/lib/hooks/useCart';

export default function Cart() {
    const router = useRouter();
    const { items, removeItem, subtotal } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen pt-[76px] px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
                    <div className="flex flex-col items-center justify-center py-20">
                        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Add items to your cart to get started!</p>
                        <Link href="/" className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                            Browse Items
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[76px] px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Cart items */}
                    <div className="flex-1 flex flex-col gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 border border-gray-200 p-4">
                                {/* Image */}
                                <div className="relative w-24 h-32 flex-shrink-0 bg-gray-100 overflow-hidden">
                                    {item.imageUrl ? (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="96px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">{item.brand}</p>
                                        <p className="font-medium leading-snug">{item.name}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {format(new Date(item.startDate), 'MMM d')} –{' '}
                                            {format(new Date(item.endDate), 'MMM d, yyyy')}
                                            {' '}({item.rentalDays} {item.rentalDays === 1 ? 'day' : 'days'})
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-semibold text-[#8C2D8B]">
                                            CAD$ {item.totalPrice.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order summary */}
                    <div className="lg:w-72 flex-shrink-0">
                        <div className="border border-gray-200 p-6">
                            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                                <span>CAD$ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-4 mt-4 flex justify-between font-semibold">
                                <span>Total</span>
                                <span>CAD$ {subtotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={() => router.push('/profile/shopper/payment')}
                                className="w-full mt-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                            <Link
                                href="/"
                                className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
