"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { LuShoppingCart } from "react-icons/lu";
import { MdFavoriteBorder } from "react-icons/md";

import DropdownNavbar from "./dropdown-navbar";
import { NotificationsDrawer } from "./notifications/NotificationsDrawer";
import { notifications as notificationsRepo } from "@/lib/data/repositories";
import { useLikedItems } from "@/lib/hooks/useLikedItems";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/how-it-works", label: "HOW IT WORKS" },
  { href: "/contact", label: "CONTACT US" },
] as const;

/**
 * Global navigation bar for the whole site.
 *
 * Replaces the previous `<Navbar />` (`src/components/navbar.tsx`) — this
 * version adds a bell icon between the heart and avatar that opens the
 * `<NotificationsDrawer>`. Unread count is sourced from the mock
 * `notifications` repository (issue A2); see issue A5 for the contract.
 *
 * Matches `docs/dashboard/figma/4449-1927-navbar.png`.
 */
export function AppHeader() {
  const path = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { likedCount } = useLikedItems();

  // Refresh the unread badge on first mount and whenever the drawer closes
  // (closing is the only point at which read-state can have changed via our
  // own UI — opening just fetches the list inside the drawer).
  useEffect(() => {
    let cancelled = false;

    notificationsRepo.unreadCount().then((count) => {
      if (!cancelled) setUnreadCount(count);
    });

    return () => {
      cancelled = true;
    };
  }, [drawerOpen]);

  return (
    <>
      <div className="bg-page fixed top-0 z-[9999] flex h-[76px] w-full items-center justify-between px-4 md:px-8 text-[16.65px]">
        <div className="flex items-center gap-3 md:gap-12">
          {/* Mobile hamburger — left of logo per figma/5193-5040-mobile-order-detail.png */}
          <button
            className="flex h-[18px] w-[24px] flex-col justify-between lg:hidden"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={dropdownOpen}
          >
            {dropdownOpen ? (
              <>
                <span className="block h-[2px] w-full origin-center translate-y-[8px] rotate-45 bg-black" />
                <span className="block h-[2px] w-full origin-center -translate-y-[8px] -rotate-45 bg-black" />
              </>
            ) : (
              <>
                <span className="block h-0.5 w-full bg-black" />
                <span className="block h-0.5 w-full bg-black" />
                <span className="block h-0.5 w-full bg-black" />
              </>
            )}
          </button>

          {/* Logo */}
          <Link href="/" aria-label="Yika home">
            <Image
              src="/assets/logos/Logo-Black.svg"
              alt="logo"
              width={50}
              height={30}
            />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-12 lg:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <li
                  className={`hover:text-primary cursor-pointer text-base font-medium ${
                    path === href ? "text-text-primary" : ""
                  }`}
                >
                  {label}
                </li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Right-side action icons.
            Desktop (lg+): full 4-icon set (heart, bell, profile, cart).
            Mobile (<lg): condensed 2-icon set (bell, cart) — per mobile Figma
            the heart and profile drop because they're reachable through the
            hamburger drawer. */}
        <div className="flex items-center gap-5 md:gap-6">
          {/* Favorites with count badge — desktop only */}
          <Link href="/favorites" className="relative hidden lg:block" aria-label="Favorites">
            <MdFavoriteBorder
              className={`cursor-pointer text-[25px] ${
                path === "/favorites" ? "text-primary" : ""
              }`}
            />
            {likedCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {likedCount}
              </span>
            )}
          </Link>

          {/* Notifications bell with unread badge — always visible */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative cursor-pointer"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
          >
            <Bell className="size-[22px] md:size-[25px]" strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="bg-brand-magenta absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User profile icon — desktop only */}
          <Link href="/profile" className="hidden lg:block" aria-label="Profile">
            <div className="relative h-[25.23px] w-[25.23px] cursor-pointer">
              <Image
                src="/assets/icons/User-Icon.svg"
                alt="User Profile"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>

          {/* Shopping cart — always visible */}
          <Link href="/cart" aria-label="Cart">
            <LuShoppingCart
              className={`cursor-pointer text-[22px] md:text-[25px] ${
                path === "/cart" ? "text-primary" : ""
              }`}
            />
          </Link>
        </div>
      </div>

      {/* Mobile dropdown */}
      {dropdownOpen && <DropdownNavbar isOpen={dropdownOpen} />}

      {/* Notifications drawer */}
      <NotificationsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
