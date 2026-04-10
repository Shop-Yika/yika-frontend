'use client';

import {usePathname} from 'next/navigation';
import Link from 'next/link';

type Mode = {
    modeType: 'shopper' | 'merchant';
    activeText: string;
    inactiveText: string;
};

const modes: Mode[] = [
    {
        modeType: 'shopper',
        activeText: 'You’re in Shopper Mode',
        inactiveText: 'Switch to Shopper Mode',
    },
    {
        modeType: 'merchant',
        activeText: 'You’re in Merchant Mode',
        inactiveText: 'Switch to Merchant Mode',
    },
];

export default function Modes() {
    const pathname = usePathname();
    if (pathname === '/profile') return null;
    const activeMode = pathname.startsWith('/profile/shopper') ? 'shopper' : 'merchant';
    const orderedModes = [...modes.filter(({modeType}) => modeType === activeMode), ...modes.filter(({modeType}) => modeType !== activeMode)];

    return (
        <div className="flex flex-wrap gap-3">
            {orderedModes.map(({modeType, activeText, inactiveText}) => {
                const href = `/profile/${modeType}`;
                const isActive = pathname.startsWith(href);

                return isActive ? (
                    <p
                        key={modeType}
                        className="opacity-70"
                    >
                        {activeText}
                    </p>
                ) : (
                    <Link
                        href={href}
                        key={modeType}
                        className="font-bold underline"
                    >
                        {inactiveText}
                    </Link>
                );
            })}
        </div>
    );
}
