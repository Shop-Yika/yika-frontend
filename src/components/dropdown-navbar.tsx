"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface DropdownNavbarProps {
  isOpen: boolean;
}

export default function DropdownNavbar({ isOpen }: DropdownNavbarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile || !isOpen) return null;

  return (
    <div className="fixed top-[76px] left-0 right-0 w-screen h-auto bg-page z-[10000] border-t border-black/50">
      <Link href="/public">
        <div className="flex items-center justify-center px-8 h-[62px] border-b border-black/50 text-[16.65px] font-satoshi font-medium uppercase">
          Home
        </div>
      </Link>

      <Link href="/about">
        <div className="flex items-center justify-center px-8 h-[62px] border-b border-black/50 text-[16.65px] font-satoshi font-medium uppercase">
          About
        </div>
      </Link>

      <Link href="/public">
        <div className="flex items-center justify-center px-8 h-[62px] border-b border-black/50 text-[16.65px] font-satoshi font-medium uppercase">
          How it works
        </div>
      </Link>

      <Link href="#footer" scroll={true}>
        <div className="flex items-center justify-center px-8 h-[62px] border-b border-black/50 text-[16.65px] font-satoshi font-medium uppercase">
          Contact Us
        </div>
      </Link>
    </div>
  );
}
