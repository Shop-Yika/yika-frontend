import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
    return (
        <div className="min-h-screen pt-[76px] px-8 py-12">
            <div className="max-w-4xl mx-auto">
                {/* <h1 className="text-4xl font-bold mb-8">My Profile</h1>
                <div className="flex flex-col items-center justify-center py-20">
                    <svg
                        className="w-24 h-24 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Sign in to view your profile</h2>
                    <p className="text-gray-500 mb-6">Create an account or sign in to manage your rentals and preferences.</p>
                </div> */}
                <div className="flex items-center flex-wrap gap-6 mb-2">
                    <Image
                        src="/assets/dashboard/profile-photo.jpg"
                        alt="Tatiana profile photo."
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <h1 className="font-semibold text-[2.5rem] leading-none">
                        Hey there, <span className="text-[#b361a6]">Tatiana!</span>
                    </h1>
                    <div className="flex flex-wrap gap-3">
                        <p className="opacity-70">You’re in Shopper Mode</p>
                        <Link
                            href="/"
                            className="font-bold underline"
                        >
                            Switch to Merchant Mode
                        </Link>
                    </div>
                </div>

                <nav className="border-b-[3px]">
                    <ul className="flex flex-wrap gap-8 leading-none">
                        <li>
                            <Link
                                href="/"
                                className="font-bold underline underline-offset-10 decoration-3 block py-2"
                            >
                                Your Orders
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                className="block py-2 opacity-70"
                            >
                                Your Payment
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/"
                                className="block py-2 opacity-70"
                            >
                                Account Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
