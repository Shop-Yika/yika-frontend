"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdFavoriteBorder } from "react-icons/md";
import { LuShoppingCart } from "react-icons/lu";
import DropdownNavbar from "./dropdown-navbar";
import { useLikedItems } from "@/lib/hooks/useLikedItems";

const Navbar = () => {
  const path = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { likedCount } = useLikedItems();

  useEffect(() => {
    console.log("path", path);
  }, [path]);

  return (
      <>
        <div className="h-[76px] px-8 flex justify-between items-center fixed top-0 w-full z-[9999] bg-[#FFFDF7] text-[16.65px]">
          <div className="flex gap-12 items-center">
            {/* Logo */}
            <Link href="/">
              <Image
                  src="/assets/logos/Logo-Black.svg"
                  alt="logo"
                  width={50}
                  height={30}
              />
            </Link>

            {/* Desktop Nav Links */}
            <ul className="hidden lg:flex gap-12 items-center">
              <Link href="/">
                <li
                    className={`hover:text-primary font-medium text-base cursor-pointer ${
                        path === "/" && "font-[family-name:var(--font-satoshi-regular)]"
                    }`}
                >
                  HOME
                </li>
              </Link>
              <Link href="/about">
                <li
                    className={`hover:text-primary font-medium text-base cursor-pointer ${
                        path === "/about" && "font-[family-name:var(--font-satoshi-regular)]"
                    }`}
                >
                  ABOUT
                </li>
              </Link>
              <Link href="/how-it-works">
                <li
                    className={`hover:text-primary font-medium text-base cursor-pointer ${
                        path === "/how-it-works" && "font-[family-name:var(--font-averia-libre-bold)]"
                    }`}
                >
                  HOW IT WORKS
                </li>
              </Link>
              <Link href="/contact">
                <li
                    className={`hover:text-primary font-medium text-base cursor-pointer ${
                        path === "/contact" && "font-[family-name:var(--font-averia-libre-bold)]"
                    }`}
                >
                  CONTACT US
                </li>
              </Link>
            </ul>
          </div>

          {/* Desktop Icons */}
          <div className="hidden lg:flex gap-6 items-center">
            {/* Favorites with count badge */}
            <Link href="/favorites" className="relative">
              <MdFavoriteBorder
                  className={`text-[25px] cursor-pointer ${
                      path === "/favorites" && "text-primary"
                  }`}
              />
              {likedCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {likedCount}
              </span>
              )}
            </Link>

            {/* User Profile Icon */}
            <Link href="/profile">
              <div className="w-[25.23px] h-[25.23px] cursor-pointer relative">
                <Image
                    src="/assets/icons/User-Icon.svg"
                    alt="User Profile"
                    fill
                    style={{ objectFit: "contain" }}
                />
              </div>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart">
              <LuShoppingCart
                  className={`text-[25px] cursor-pointer ${
                      path === "/cart" && "text-primary"
                  }`}
              />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
              className="lg:hidden flex flex-col justify-between w-[24px] h-[18px]"
              onClick={() => setDropdownOpen((prev) => !prev)}
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

        {/* Mobile Dropdown */}
        {dropdownOpen && <DropdownNavbar isOpen={dropdownOpen} />}
      </>
  );
};

export default Navbar;