"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdFavoriteBorder } from "react-icons/md";
import { LuShoppingCart } from "react-icons/lu";
import DropdownNavbar from "./dropdown-navbar";

const Navbar = () => {
  const path = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    console.log("path", path);
  }, [path]);

  return (
    <>
      <div className="h-[76px] px-8 flex justify-between items-center fixed top-0 w-full z-[9999] bg-[#FFFDF7] text-[16.65px]">

        <div className="flex gap-12 items-center">

        {/* Logo */}
        <Link href={"/public"}>
          <Image
            src="/assets/logos/Logo-Black.svg"
            alt="logo"
            width={50}
            height={30}
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex gap-12 items-center">
          <Link href={"/public"}>
            <li
              className={`hover:text-primary font-medium text-base cursor-pointer ${
                path === "/" && "font-[family-name:var(--font-satoshi-regular)]"
              }`}
            >
              HOME
            </li>
          </Link>
          <Link href={"/about"}>
            <li
              className={`hover:text-primary font-medium text-base cursor-pointer ${
                path === "/about" && "font-[family-name:var(--font-satoshi-regular)]"
              }`}
            >
              ABOUT
            </li>
          </Link>
          <Link href={"/public"}>
            <li
              className={`hover:text-primary font-medium text-base cursor-pointer ${
                path === "/products" && "font-[family-name:var(--font-averia-libre-bold)]"
              }`}
            >
              HOW IT WORKS
            </li>
          </Link>
          <Link href={"#footer"} scroll={true}>
            <li
              className={`hover:text-primary font-medium text-base cursor-pointer ${
                path === "/products" && "font-[family-name:var(--font-averia-libre-bold)]"
              }`}
            >
              CONTACT US
            </li>
          </Link>
        </ul>
        </div>

        {/* Desktop Icons */}
        <div className="hidden lg:flex gap-6 items-center">
          <Link href={"/public"}>
            <MdFavoriteBorder
              className={`text-[25px] cursor-pointer ${
                path === "/favorites" && "text-primary"
              }`}
            />
          </Link>

          {/* Hardcoded SVG User Icon */}
          <Link href={"/profile"}>
          <div className="w-[25.23px] h-[25.23px] cursor-pointer relative">
            <Image
              src="/assets/icons/User-Icon.svg" 
              alt="User Profile"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          </Link>

          <Link href={"/public"}>
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
              <span className="block w-full h-[2px] bg-black" />
              <span className="block w-full h-[2px] bg-black" />
              <span className="block w-full h-[2px] bg-black" />
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
