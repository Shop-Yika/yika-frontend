'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const ERROR_MESSAGES: Record<string, string> = {
    Configuration:   'There is a server configuration issue. Please contact support.',
    AccessDenied:    'You do not have permission to access this resource.',
    Verification:    'The sign-in link is no longer valid. Please request a new one.',
    Default:         'An unexpected error occurred. Please try signing in again.',
};

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const errorCode    = searchParams.get('error') ?? 'Default';
    const message      = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

    return (
        <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold text-[#1A1530] mb-2">Authentication Error</h1>
            <p className="text-sm text-[#6B7280] mb-6">{message}</p>
            <Link
                href="/auth/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#8C2D8B] text-white text-sm font-semibold hover:bg-[#7A2679] transition-colors"
            >
                Back to Sign In
            </Link>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-10">
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Image src="/assets/logos/Logo-Black.svg" alt="Yíká" width={60} height={36} />
                    </Link>
                </div>
                <Suspense fallback={<p className="text-center text-sm text-gray-400">Loading…</p>}>
                    <AuthErrorContent />
                </Suspense>
            </div>
        </div>
    );
}
