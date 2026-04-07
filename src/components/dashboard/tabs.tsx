'use client';

import {usePathname} from 'next/navigation';
import Link from 'next/link';

type TabsProps = {
    mode: 'shopper' | 'merchant';
};

type TabItem = {
    href: string;
    label: string;
};

const shopperTabs: TabItem[] = [
    {
        href: '/profile/shopper/orders',
        label: 'Your Orders',
    },
    {
        href: '/profile/shopper/payment',
        label: 'Your Payment',
    },
    {
        href: '/profile/shopper/settings',
        label: 'Account Settings',
    },
];

const merchantTabs: TabItem[] = [
    {
        href: '/profile/merchant/active-listings',
        label: 'Active Listings',
    },
    {
        href: '/profile/merchant/rentals',
        label: 'Active Rentals',
    },
    {
        href: '/profile/merchant/past-listings',
        label: 'Past Listings',
    },
    {
        href: '/profile/merchant/earnings',
        label: 'Your Earnings',
    },
];

export default function Tabs({mode}: TabsProps) {
    const tabs = mode === 'shopper' ? shopperTabs : merchantTabs;
    const pathname = usePathname();

    const getClassName = (href: string) => {
        const isActive = pathname.startsWith(href);
        return isActive ? 'font-bold underline underline-offset-10 decoration-3' : 'opacity-70';
    };

    return (
        <nav className="border-b-[3px]">
            <ul className="flex flex-wrap gap-8 leading-none">
                {tabs.map(({href, label}) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className={`${getClassName(href)} block py-2`}
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
