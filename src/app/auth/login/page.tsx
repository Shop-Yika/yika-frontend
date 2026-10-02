'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// ── Inner component — reads searchParams (needs Suspense boundary) ─────────────

function LoginForm() {
    const router        = useRouter();
    const searchParams  = useSearchParams();
    const callbackUrl   = searchParams.get('callbackUrl') || '/profile';
    const sessionExpired = searchParams.get('reason') === 'session_expired';

    const [username, setUsername]   = useState('');
    const [password, setPassword]   = useState('');
    const [error,    setError]      = useState<string | null>(
        sessionExpired ? 'Your session has expired. Please sign in again.' : null
    );
    const [loading,  setLoading]    = useState(false);
    const [showPass, setShowPass]   = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password) return;

        setLoading(true);
        setError(null);

        const result = await signIn('credentials', {
            username: username.trim(),
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError('Invalid username or password. Please try again.');
            return;
        }

        // Successful login — navigate to the original destination
        router.push(callbackUrl);
        router.refresh(); // ensure server components re-read the new session
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Error banner */}
            {error && (
                <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Username */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="username" className="text-sm font-semibold text-[#1A1530] uppercase tracking-wide">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                    className="h-[48px] rounded-xl border border-[#E2E0E8] bg-white px-4 text-sm text-[#1A1530] placeholder:text-[#C4BFD4] focus:outline-none focus:ring-2 focus:ring-[#8C2D8B]/30 focus:border-[#8C2D8B] transition-all"
                />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-[#1A1530] uppercase tracking-wide">
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPass ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-[48px] rounded-xl border border-[#E2E0E8] bg-white px-4 pr-12 text-sm text-[#1A1530] placeholder:text-[#C4BFD4] focus:outline-none focus:ring-2 focus:ring-[#8C2D8B]/30 focus:border-[#8C2D8B] transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                        aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                        {showPass ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading || !username.trim() || !password}
                className="h-[48px] rounded-xl bg-[#8C2D8B] text-white font-semibold text-sm uppercase tracking-wide hover:bg-[#7A2679] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Signing in…
                    </span>
                ) : (
                    'Sign In'
                )}
            </button>

            {/* Register link */}
            <p className="text-center text-sm text-[#6B7280]">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-[#8C2D8B] font-semibold hover:underline">
                    Create one
                </Link>
            </p>
        </form>
    );
}

// ── Page wrapper ──────────────────────────────────────────────────────────────

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center px-4 py-16">

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 sm:p-10">

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Image
                            src="/assets/logos/Logo-Black.svg"
                            alt="Yíká"
                            width={60}
                            height={36}
                        />
                    </Link>
                </div>

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-[#1A1530]">Welcome back</h1>
                    <p className="text-sm text-[#6B7280] mt-1">Sign in to your Yíká account</p>
                </div>

                {/* Form — wrapped in Suspense so useSearchParams doesn't block SSR */}
                <Suspense fallback={<div className="h-48 flex items-center justify-center text-sm text-gray-400">Loading…</div>}>
                    <LoginForm />
                </Suspense>
            </div>

            {/* Back to shop */}
            <Link href="/" className="mt-6 text-sm text-[#6B7280] hover:text-[#1A1530] transition-colors">
                ← Back to shop
            </Link>
        </div>
    );
}
