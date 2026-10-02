"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdFavoriteBorder } from "react-icons/md";
import { LuShoppingCart } from "react-icons/lu";
import { useSession, signOut } from "next-auth/react";
import DropdownNavbar from "./dropdown-navbar";
import { useLikedItems } from "@/lib/hooks/useLikedItems";

const Navbar = () => {
    const path   = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const isLoggedIn = status === "authenticated";
    const { likedCount } = useLikedItems();

    const [dropdownOpen,   setDropdownOpen]   = useState(false);
    const [userMenuOpen,   setUserMenuOpen]   = useState(false);

    // First initial for the avatar chip shown when logged in
    const initial = session?.user?.name?.charAt(0)?.toUpperCase() ?? "?";

    const handleSignOut = async () => {
        setUserMenuOpen(false);
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
    };

    return (
        <>
            <div className="h-[76px] px-8 flex justify-between items-center fixed top-0 w-full z-[9999] bg-[#FFFDF7] text-[16.65px]">
                <div className="flex gap-12 items-center">

                    {/* Logo */}
                    <Link href="/">
                        <Image
                            src="/assets/logos/Logo-Black.svg"
                            alt="Yíká logo"
                            width={50}
                            height={30}
                        />
                    </Link>

                    {/* Desktop nav links */}
                    <ul className="hidden lg:flex gap-12 items-center">
                        <Link href="/">
                            <li className={`hover:text-primary font-medium text-base cursor-pointer ${path === "/" && "font-bold"}`}>
                                HOME
                            </li>
                        </Link>
                        <Link href="/about">
                            <li className={`hover:text-primary font-medium text-base cursor-pointer ${path === "/about" && "font-bold"}`}>
                                ABOUT
                            </li>
                        </Link>
                        <Link href="/how-it-works">
                            <li className={`hover:text-primary font-medium text-base cursor-pointer ${path === "/how-it-works" && "font-bold"}`}>
                                HOW IT WORKS
                            </li>
                        </Link>
                        <Link href="/contact">
                            <li className={`hover:text-primary font-medium text-base cursor-pointer ${path === "/contact" && "font-bold"}`}>
                                CONTACT US
                            </li>
                        </Link>
                    </ul>
                </div>

                {/* Desktop right-side icons */}
                <div className="hidden lg:flex gap-6 items-center">

                    {/* Favourites */}
                    <Link href="/favourites" className="relative">
                        <MdFavoriteBorder
                            className={`text-[25px] cursor-pointer ${path === "/favourites" && "text-[#8C2D8B]"}`}
                        />
                        {likedCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                {likedCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link href="/cart">
                        <LuShoppingCart
                            className={`text-[25px] cursor-pointer ${path === "/cart" && "text-[#8C2D8B]"}`}
                        />
                    </Link>

                    {/* ── User area ─────────────────────────────────────────── */}
                    {status === "loading" ? (
                        // Skeleton placeholder while session loads — prevents layout shift
                        <div className="w-[26px] h-[26px] rounded-full bg-gray-200 animate-pulse" />

                    ) : isLoggedIn ? (
                        // Logged-in: avatar chip + dropdown
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen((v) => !v)}
                                className="w-[34px] h-[34px] rounded-full bg-[#8C2D8B] flex items-center justify-center text-white text-sm font-semibold hover:bg-[#7A2679] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8C2D8B]/40 focus:ring-offset-1"
                                aria-label="User menu"
                                aria-expanded={userMenuOpen}
                            >
                                {initial}
                            </button>

                            {/* Dropdown */}
                            {userMenuOpen && (
                                <>
                                    {/* Invisible backdrop to close on outside click */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-xl border border-[#E5E7EB] shadow-lg z-50 overflow-hidden">
                                        {/* User info */}
                                        <div className="px-4 py-3 border-b border-[#F3F4F6]">
                                            <p className="text-sm font-semibold text-[#111827] truncate">
                                                {session.user.name}
                                            </p>
                                            <p className="text-xs text-[#6B7280] truncate">
                                                {session.user.email}
                                            </p>
                                        </div>

                                        {/* Links */}
                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="block px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/profile/shopper/orders"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="block px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                                            >
                                                My Orders
                                            </Link>
                                            <Link
                                                href="/favourites"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="block px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                                            >
                                                Favourites
                                            </Link>
                                        </div>

                                        {/* Sign out */}
                                        <div className="border-t border-[#F3F4F6] py-1">
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    ) : (
                        // Logged-out: Sign In link
                        <Link
                            href="/auth/login"
                            className="text-sm font-semibold text-[#1A1530] hover:text-[#8C2D8B] transition-colors uppercase"
                        >
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="lg:hidden flex flex-col justify-between w-[24px] h-[18px]"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    aria-label={dropdownOpen ? "Close menu" : "Open menu"}
                >
                    {dropdownOpen ? (
                        <>
                            <span className="block w-full h-[2px] bg-black rotate-45 origin-center translate-y-[8px]" />
                            <span className="block w-full h-[2px] bg-black -rotate-45 origin-center -translate-y-[8px]" />
                        </>
                    ) : (
                        <>
                            <span className="block w-full h-0.5 bg-black" />
                            <span className="block w-full h-0.5 bg-black" />
                            <span className="block w-full h-0.5 bg-black" />
                        </>
                    )}
                </button>
            </div>

            {/* Mobile dropdown */}
            {dropdownOpen && <DropdownNavbar isOpen={dropdownOpen} />}
        </>
    );
};

export default Navbar;
