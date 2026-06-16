import { ReactNode } from 'react';
import Image from 'next/image';
import { auth } from '@/auth';
import Modes from '@/components/dashboard/modes';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    // TODO: restore redirect once dev accounts are set up.
    // if (!session?.user) redirect('/auth/login');
    const session = await auth();
    const { name = 'Dev User', image = undefined } = session?.user ?? {};

    // Use the first part of the name as the greeting (username from AWS backend)
    const firstName = name?.split(' ')[0] ?? 'there';

    // Derive initials for the avatar fallback (e.g. "alice" → "A")
    const initials = name
        ? name.trim().split(/\s+/).map((w) => w[0].toUpperCase()).join('').slice(0, 2)
        : '?';

    return (
        <div className="min-h-screen pt-[76px] px-8 py-12">
            <div className="max-w-5xl mx-auto">

                {/* Profile header */}
                <div className="flex items-center flex-wrap gap-6 mb-2">

                    {/* Avatar — real image if available, else initials */}
                    {image ? (
                        <Image
                            src={image}
                            alt={`${name} profile photo`}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    ) : (
                        <div
                            aria-label={`${name} avatar`}
                            className="w-20 h-20 rounded-full bg-[#8C2D8B] flex items-center justify-center flex-shrink-0"
                        >
                            <span className="text-white text-2xl font-semibold select-none">
                                {initials}
                            </span>
                        </div>
                    )}

                    <h1 className="font-semibold text-[2.5rem] leading-none">
                        Hey there, <span className="text-[#b361a6]">{firstName}!</span>
                    </h1>

                    {/* Shopper ↔ Merchant mode switcher */}
                    <Modes />
                </div>

                <div>{children}</div>
            </div>
        </div>
    );
}
