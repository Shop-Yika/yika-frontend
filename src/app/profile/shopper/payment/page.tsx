"use client";

import {useState} from 'react';
import {Button} from '@/components/ui/button';

const INITIAL = {
    cardNumber: '',
    expiry:     '',
    cvc:        '',
    nameOnCard: '',
    zip:        '',
};

const inputClass =
    'w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#8C2D8B]/20 focus:border-[#8C2D8B] transition-colors';

const labelClass = 'block text-[14px] font-medium text-[#111827] mb-1.5';

export default function Payment() {
    const [fields, setFields] = useState(INITIAL);

    const isDirty = Object.values(fields).some(v => v !== '');

    function set(key: keyof typeof INITIAL) {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setFields(prev => ({...prev, [key]: e.target.value}));
    }

    return (
        <div className="mt-8 max-w-xl">
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-6">
                <fieldset className="flex flex-col gap-3">
                    <legend className={labelClass}>Your Card Information</legend>
                    <div className="relative">
                        <input
                            type="text"
                            value={fields.cardNumber}
                            onChange={set('cardNumber')}
                            placeholder="1234 1234 1234 1234"
                            maxLength={19}
                            className={`${inputClass} pr-12`}
                            aria-label="Card number"
                        />
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]"
                        >
                            <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            value={fields.expiry}
                            onChange={set('expiry')}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={inputClass}
                            aria-label="Expiry date"
                        />
                        <input
                            type="text"
                            value={fields.cvc}
                            onChange={set('cvc')}
                            placeholder="CVC"
                            maxLength={4}
                            className={inputClass}
                            aria-label="CVC"
                        />
                    </div>
                </fieldset>

                <div>
                    <label htmlFor="nameOnCard" className={labelClass}>Your Name on Card</label>
                    <input
                        id="nameOnCard"
                        type="text"
                        value={fields.nameOnCard}
                        onChange={set('nameOnCard')}
                        placeholder="Full Name"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="billingZip" className={labelClass}>Your Billing Zip Code</label>
                    <input
                        id="billingZip"
                        type="text"
                        value={fields.zip}
                        onChange={set('zip')}
                        placeholder="Zip Code"
                        maxLength={10}
                        className={inputClass}
                    />
                </div>

                <div>
                    <Button
                        type="submit"
                        disabled={!isDirty}
                        className="bg-[#8C2D8B] hover:bg-[#7a2679] text-white px-8 disabled:opacity-40"
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
