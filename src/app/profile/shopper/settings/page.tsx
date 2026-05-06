"use client";

import {useState} from 'react';
import {Button} from '@/components/ui/button';

const INITIAL = {
    name:    'Tatiana Smith',
    email:   'tatiana@email.com',
    password: '',
    street:  '123 Fashion Avenue',
    city:    'New York',
    state:   'NY',
    zip:     '10001',
};

const inputClass =
    'w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#8C2D8B]/20 focus:border-[#8C2D8B] transition-colors';

const labelClass = 'block text-[14px] font-medium text-[#111827] mb-1.5';

export default function Settings() {
    const [fields, setFields] = useState(INITIAL);

    const isDirty = Object.keys(INITIAL).some(
        (k) => fields[k as keyof typeof INITIAL] !== INITIAL[k as keyof typeof INITIAL]
    );

    function set(key: keyof typeof INITIAL) {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setFields(prev => ({...prev, [key]: e.target.value}));
    }

    return (
        <div className="mt-8 max-w-xl">
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-6">
                <div>
                    <label htmlFor="name" className={labelClass}>Name</label>
                    <input
                        id="name"
                        type="text"
                        value={fields.name}
                        onChange={set('name')}
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
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="password" className={labelClass}>Password</label>
                    <input
                        id="password"
                        type="password"
                        value={fields.password}
                        onChange={set('password')}
                        placeholder="••••••••••••••••"
                        className={inputClass}
                    />
                </div>

                <fieldset className="flex flex-col gap-3">
                    <legend className={labelClass}>Shipping Address</legend>
                    <input
                        type="text"
                        value={fields.street}
                        onChange={set('street')}
                        placeholder="Street address"
                        className={inputClass}
                        aria-label="Street address"
                    />
                    <div className="grid grid-cols-3 gap-3">
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
                            placeholder="State"
                            className={inputClass}
                            aria-label="State"
                        />
                        <input
                            type="text"
                            value={fields.zip}
                            onChange={set('zip')}
                            placeholder="ZIP"
                            className={inputClass}
                            aria-label="ZIP code"
                        />
                    </div>
                </fieldset>

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
