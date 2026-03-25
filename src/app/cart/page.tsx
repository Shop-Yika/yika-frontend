export default function Cart() {
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

                </div>
            </div>
        </div>
    );
}