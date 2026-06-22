"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const EMPTY = {
    name:     '',
    email:    '',
    password: '',
    street:   '',
    city:     '',
    state:    '',
    zip:      '',
};

const inputClass =
    'w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#8C2D8B]/20 focus:border-[#8C2D8B] transition-colors';

const labelClass = 'block text-[14px] font-medium text-[#111827] mb-1.5';

export default function Settings() {
    const { data: session } = useSession();
    const [fields, setFields]     = useState(EMPTY);
    const [original, setOriginal] = useState(EMPTY);

    // Seed name and email from the live session once it's available
    useEffect(() => {
        if (!session?.user) return;
        const seeded = {
            ...EMPTY,
            name:  session.user.name  ?? '',
            email: session.user.email ?? '',
        };
        setFields(seeded);
        setOriginal(seeded);
    }, [session]);

    const isDirty = Object.keys(EMPTY).some(
        (k) => fields[k as keyof typeof EMPTY] !== original[k as keyof typeof EMPTY]
    );

    function set(key: keyof typeof EMPTY) {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setFields(prev => ({ ...prev, [key]: e.target.value }));
    }

    return (
        <div className="mt-8 max-w-xl">
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-8">

                {/* Account info */}
                <section className="flex flex-col gap-4">
                    <h2 className="text-[15px] font-semibold text-[#111827] border-b border-[#E5E7EB] pb-2">
                        Account Information
                    </h2>

                    <div>
                        <label htmlFor="name" className={labelClass}>Username</label>
                        <input
                            id="name"
                            type="text"
                            value={fields.name}
                            onChange={set('name')}
                            placeholder="Your username"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className={labelClass}>Email</label>
                        <input
                            id="email"
                            type="email"
                            value={fields.email}
                            onChange={set('email')}
                            placeholder="your@email.com"
                            className={inputClass}
                        />
                    </div>
                </section>

                {/* Password */}
                <section className="flex flex-col gap-4">
                    <h2 className="text-[15px] font-semibold text-[#111827] border-b border-[#E5E7EB] pb-2">
                        Change Password
                    </h2>

                    <div>
                        <label htmlFor="password" className={labelClass}>New Password</label>
                        <input
                            id="password"
                            type="password"
                            value={fields.password}
                            onChange={set('password')}
                            placeholder="••••••••••••••••"
                            className={inputClass}
                        />
                    </div>
                </section>

                {/* Shipping address */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-[15px] font-semibold text-[#111827] border-b border-[#E5E7EB] pb-2">
                        Shipping Address
                    </h2>

                    <input
                        type="text"
                        value={fields.street}
                        onChange={set('street')}
                        placeholder="Street address"
                        className={inputClass}
                        aria-label="Street address"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={fields.city}
                            onChange={set('city')}
                            placeholder="City"
                            className={inputClass}
                            aria-label="City"
                        />
                        <input
                            type="text"
                            value={fields.state}
                            onChange={set('state')}
                            placeholder="Province"
                            className={inputClass}
                            aria-label="Province"
                        />
                        <input
                            type="text"
                            value={fields.zip}
                            onChange={set('zip')}
                            placeholder="Postal code"
                            className={inputClass}
                            aria-label="Postal code"
                        />
                    </div>
                </section>

                <div>
                    <Button
                        type="submit"
                        disabled={!isDirty}
                        className="bg-[#8C2D8B] hover:bg-[#7a2679] text-white px-8"
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
