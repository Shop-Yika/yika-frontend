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
 */
export function DashboardTabs({ mode }: DashboardTabsProps) {
    const tabs = mode === 'shopper' ? shopperTabs : merchantTabs;
    const pathname = usePathname();

    return (
        <nav className="border-b border-border-default mb-8 overflow-x-auto">
            <ul className="flex justify-center md:justify-start gap-8 md:gap-14">
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
