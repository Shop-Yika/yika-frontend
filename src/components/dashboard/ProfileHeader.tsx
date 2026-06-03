import Image from 'next/image';
import Link from 'next/link';
import { user } from '@/lib/data/repositories';

export type ProfileHeaderProps = {
    mode: 'shopper' | 'merchant';
};

/**
 * Top-of-dashboard greeting strip.
 *
 * Renders:
 *  - Avatar (~72px circular)
 *  - "Hey there, <Newsreader-italic Tatiana!>"
 *  - Mode-switch line: "You're in X Mode. <Link>Switch to Y Mode</Link>"
 *
 * Reads the current user via the A2 repository so this component owns its
 * own data dependency — consumers just choose the mode.
 */
export async function ProfileHeader({ mode }: ProfileHeaderProps) {
    const profile = await user.getProfile();
    const otherMode = mode === 'shopper' ? 'merchant' : 'shopper';
    const currentLabel = mode === 'shopper' ? 'Shopper' : 'Merchant';
    const otherLabel = otherMode === 'shopper' ? 'Shopper' : 'Merchant';

    // Mobile layout (per figma/5193-5040-mobile-order-detail.png):
    //   row 1: avatar (left) + greeting (right of avatar)
    //   row 2: mode-switch text, full width, left-aligned
    // Desktop layout (unchanged):
    //   single wrap row, avatar + greeting + mode-switch inline
    return (
        <header className="mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-3 md:gap-6 md:justify-start">
                <Image
                    src={profile.avatarUrl}
                    alt={`${profile.firstName} profile photo.`}
                    width={72}
                    height={72}
                    className="h-12 w-12 md:h-[72px] md:w-[72px] rounded-full object-cover"
                    priority
                />
                <h1 className="font-semibold text-[22px] md:text-[40px] leading-tight md:leading-none text-text-primary mr-0 md:mr-6">
                    Hey there,{' '}
                    <span className="font-newsreader italic font-medium text-brand-lavender">
                        {profile.firstName}!
                    </span>
                </h1>
                {/* Desktop: inline next to the greeting */}
                <p className="hidden md:block text-sm text-text-muted">
                    You&rsquo;re in {currentLabel} Mode.{' '}
                    <Link
                        href={`/profile/${otherMode}`}
                        className="font-medium text-text-primary underline underline-offset-4 decoration-1"
                    >
                        Switch to {otherLabel} Mode
                    </Link>
                </p>
            </div>
            {/* Mobile: stacked below the avatar+greeting row */}
            <p className="md:hidden mt-2 text-[13px] text-text-muted">
                You&rsquo;re in {currentLabel} Mode.{' '}
                <Link
                    href={`/profile/${otherMode}`}
                    className="font-medium text-text-primary underline underline-offset-4 decoration-1"
                >
                    Switch to {otherLabel} Mode
                </Link>
            </p>
        </header>
    );
}

export default ProfileHeader;
