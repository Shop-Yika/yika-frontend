'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type DashboardTabsProps = {
    mode: 'shopper' | 'merchant';
};

type TabItem = {
    href: string;
    label: string;
};

const shopperTabs: TabItem[] = [
    { href: '/profile/shopper/orders', label: 'Your Orders' },
    { href: '/profile/shopper/payment', label: 'Your Payment' },
    { href: '/profile/shopper/settings', label: 'Account Settings' },
];

const merchantTabs: TabItem[] = [
    { href: '/profile/merchant/active-listings', label: 'Active Listings' },
    { href: '/profile/merchant/rentals', label: 'Active Rentals' },
    { href: '/profile/merchant/earnings', label: 'Your Earnings' },
];

/**
 * Three-tab navigation row for shopper or merchant dashboard.
 *
 * - Full-row hairline border underneath all tabs (`border-b border-border-default`).
 * - Active tab gets a 2px solid underline directly under the label.
 * - Active state is derived from `usePathname()` and matches by `startsWith`
 *   so nested routes (e.g. `/profile/shopper/orders/[id]`) keep the parent
 *   tab highlighted.
 *
 * Mobile behavior (per `figma/5193-5040-mobile-order-detail.png`):
 *   Tabs left-align and scroll horizontally when they overflow the viewport.
 *   The native horizontal scrollbar is hidden via `.scrollbar-hide` (utility
 *   shipped by `tw-animate-css`/Tailwind) so the row reads as a clean strip.
 *   The container itself owns `overflow-x-auto` so swipe/drag still works.
 */
export function DashboardTabs({ mode }: DashboardTabsProps) {
    const tabs = mode === 'shopper' ? shopperTabs : merchantTabs;
    const pathname = usePathname();

    return (
        <nav className="border-b border-border-default mb-6 md:mb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <ul className="flex justify-start gap-6 md:gap-14 min-w-max md:min-w-0">
                {tabs.map(({ href, label }) => {
                    const isActive = pathname.startsWith(href);
                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                className={
                                    'inline-block whitespace-nowrap py-3 text-[15px] -mb-px border-b-2 ' +
                                    (isActive
                                        ? 'font-semibold text-text-primary border-text-primary'
                                        : 'font-normal text-text-muted border-transparent')
                                }
                            >
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default DashboardTabs;
