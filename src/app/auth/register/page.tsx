'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Role = 'shopper' | 'merchant' | 'both';

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
    {
        value: 'shopper',
        label: 'I want to rent',
        description: 'Browse and rent fashion from brands and individuals',
    },
    {
        value: 'merchant',
        label: 'I want to lend',
        description: 'List your wardrobe and earn from items you already own',
    },
    {
        value: 'both',
        label: 'Both',
        description: 'Rent and lend — get the full Yíká experience',
    },
];

export default function RegisterPage() {
    const router = useRouter();

    const [step,     setStep]     = useState<1 | 2>(1); // step 1 = role, step 2 = details
    const [role,     setRole]     = useState<Role | null>(null);
    const [username, setUsername] = useState('');
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error,    setError]    = useState<string | null>(null);
    const [loading,  setLoading]  = useState(false);

    // ── Step 1: role selection ────────────────────────────────────────────────
    const handleRoleSelect = (selected: Role) => {
        setRole(selected);
        setStep(2);
    };

    // ── Step 2: form submission ───────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password) return;

        setLoading(true);
        setError(null);

        // 1. Register via our proxy route → AWS POST /create_user
        const regRes = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username:  username.trim(),
                email:     email.trim(),
                password,
                role:      role === 'both' ? 'user' : (role ?? 'user'),
            }),
        });

        const regData = await regRes.json();

        if (!regRes.ok) {
            setLoading(false);
            if (regRes.status === 409) {
                setError('That username is already taken. Please choose another.');
            } else {
                setError(regData?.error || 'Registration failed. Please try again.');
            }
            return;
        }

        // 2. Auto-login immediately after successful registration
        const loginResult = await signIn('credentials', {
            username: username.trim(),
            password,
            redirect: false,
        });

        setLoading(false);

        if (loginResult?.error) {
            // Registration succeeded but auto-login failed — send to login page
            router.push('/auth/login?reason=registered');
            return;
        }

        // 3. Redirect to the right section based on role choice
        const destination =
            role === 'merchant'
                ? '/profile/merchant/active-listings'
                : '/profile/shopper/orders';

        router.push(destination);
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center px-4 py-16">

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

                {/* ── Step 1: Role selection ───────────────────────────────── */}
                {step === 1 && (
                    <div>
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold text-[#1A1530]">Join Yíká</h1>
                            <p className="text-sm text-[#6B7280] mt-1">What brings you here?</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {ROLE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleRoleSelect(opt.value)}
                                    className="flex flex-col items-start text-left px-5 py-4 rounded-xl border-2 border-[#E2E0E8] hover:border-[#8C2D8B] hover:bg-[#8C2D8B]/5 transition-all group"
                                >
                                    <span className="font-semibold text-[#1A1530] group-hover:text-[#8C2D8B] transition-colors">
                                        {opt.label}
                                    </span>
                                    <span className="text-xs text-[#6B7280] mt-0.5">{opt.description}</span>
                                </button>
                            ))}
                        </div>

                        <p className="text-center text-sm text-[#6B7280] mt-6">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-[#8C2D8B] font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                )}

                {/* ── Step 2: Account details ──────────────────────────────── */}
                {step === 2 && (
                    <div>
                        {/* Back + heading */}
                        <div className="mb-8">
                            <button
                                type="button"
                                onClick={() => { setStep(1); setError(null); }}
                                className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#1A1530] mb-4 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                            <h1 className="text-2xl font-bold text-[#1A1530]">Create your account</h1>
                            <p className="text-sm text-[#6B7280] mt-1">
                                {role === 'merchant'
                                    ? 'Set up your merchant account'
                                    : role === 'both'
                                        ? 'Get the full Yíká experience'
                                        : 'Start renting fashion today'}
                            </p>
                        </div>

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

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-sm font-semibold text-[#1A1530] uppercase tracking-wide">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
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
                                        autoComplete="new-password"
                                        required
                                        minLength={8}
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
                                <p className="text-xs text-[#9CA3AF]">Must be at least 8 characters</p>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !username.trim() || !email.trim() || password.length < 8}
                                className="h-[48px] rounded-xl bg-[#8C2D8B] text-white font-semibold text-sm uppercase tracking-wide hover:bg-[#7A2679] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Creating account…
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            <p className="text-center text-sm text-[#6B7280]">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="text-[#8C2D8B] font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                )}
            </div>

            <Link href="/" className="mt-6 text-sm text-[#6B7280] hover:text-[#1A1530] transition-colors">
                ← Back to shop
            </Link>
        </div>
    );
}
