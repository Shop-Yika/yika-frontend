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

    return (
        <header className="flex flex-wrap items-center justify-center gap-4 md:justify-start md:gap-6 mb-8">
            <Image
                src={profile.avatarUrl}
                alt={`${profile.firstName} profile photo.`}
                width={72}
                height={72}
                className="h-16 w-16 md:h-[72px] md:w-[72px] rounded-full object-cover"
                priority
            />
            <h1 className="font-semibold text-[24px] md:text-[40px] leading-none text-text-primary mr-0 md:mr-6">
                Hey there,{' '}
                <span className="font-newsreader italic font-medium text-brand-lavender">
                    {profile.firstName}!
                </span>
            </h1>
            <p className="text-sm text-text-muted">
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
