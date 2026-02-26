export default function HowItWorksPage() {
    return (
        <div className="min-h-screen pt-[76px] px-8 py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">How It Works</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-4xl font-bold text-primary mb-4">1</div>
                        <h3 className="text-xl font-semibold mb-2">Browse & Select</h3>
                        <p className="text-gray-600">
                            Explore our curated collection of designer pieces and select your favorites.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-4xl font-bold text-primary mb-4">2</div>
                        <h3 className="text-xl font-semibold mb-2">Rent & Enjoy</h3>
                        <p className="text-gray-600">
                            Choose your rental dates and have your items delivered right to your door.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-4xl font-bold text-primary mb-4">3</div>
                        <h3 className="text-xl font-semibold mb-2">Return</h3>
                        <p className="text-gray-600">
                            After your event, return the items using our prepaid shipping label.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Rental Details</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>✓ Free shipping both ways</li>
                        <li>✓ Professional dry cleaning included</li>
                        <li>✓ Insurance coverage on all rentals</li>
                        <li>✓ Flexible rental periods (4-8 days)</li>
                        <li>✓ Reserve up to 30 days in advance</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}