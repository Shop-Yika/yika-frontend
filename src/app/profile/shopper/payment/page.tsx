"use client";

/**
 * Shopper Payment Methods page.
 *
 * Halt gate (B3) resolved with option (a): keep the existing card form +
 * billing address from the prior implementation, restyled against the new
 * dashboard shell (A1 tokens, A3 shadcn <Input>, B4 dirty-state pattern).
 *
 * Form fields:
 *   - Card number (with lock icon)
 *   - Expiry (MM/YY) + CVC
 *   - Name on card
 *   - Billing zip code
 *
 * Behavior:
 *   The "Save" button is disabled until the form is dirty (any field differs
 *   from the loaded baseline). On submit we no-op (console.log) — this issue
 *   is UI-only, no payment processor is wired up. After a successful save the
 *   current values become the new baseline so the button disables again.
 */

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type FormValues = {
    cardNumber: string;
    expiry: string;
    cvc: string;
    nameOnCard: string;
    zip: string;
};

const EMPTY_FORM: FormValues = {
    cardNumber: '',
    expiry: '',
    cvc: '',
    nameOnCard: '',
    zip: '',
};

// Shared field-row styles. Tokens come from `src/lib/design-tokens.ts` →
// CSS vars in `globals.css` → Tailwind semantic classes here. Labels follow
// the B3 brief (13-14px, muted); fields use the shadcn <Input> default with a
// subtle gray-tinted background to match the Figma form pattern.
const labelClass = 'block text-[13px] font-medium text-text-muted mb-1.5';
const fieldClass =
    'h-10 bg-border-subtle border-border-default text-text-primary placeholder:text-text-faint';

export default function ShopperPaymentPage() {
    // Today there is no persisted payment method, so the baseline is empty.
    // When a data layer is added, hydrate `baseline` from the repository the
    // same way B4 settings does and reset to it after a successful save.
    const [baseline, setBaseline] = useState<FormValues>(EMPTY_FORM);
    const [values, setValues] = useState<FormValues>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    // Dirty check via deep-equality of the small form object. JSON.stringify
    // is safe here: flat object of primitives, stable key order, comparison
    // only runs on render.
    const isDirty = useMemo(
        () => JSON.stringify(values) !== JSON.stringify(baseline),
        [values, baseline],
    );

    function update<K extends keyof FormValues>(key: K) {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setValues((prev) => ({ ...prev, [key]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isDirty || saving) return;
        setSaving(true);
        try {
            // No backend wiring yet — log the patch so the dirty-state flow
            // can still be observed in the browser console during manual QA.
            // When a payment processor (Stripe etc.) is integrated this is
            // where the tokenization call would go.

            console.log('[payment] save', values);
            // Promote the current values to the new baseline so the Save
            // button disables until the user edits again.
            setBaseline(values);
        } finally {
            setSaving(false);
        }
    }

    const isSaveDisabled = !isDirty || saving;

    return (
        <div className="mt-8 max-w-xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <fieldset className="flex flex-col gap-3">
                    <legend className={labelClass}>Your Card Information</legend>
                    <div className="relative">
                        <Input
                            type="text"
                            value={values.cardNumber}
                            onChange={update('cardNumber')}
                            placeholder="1234 1234 1234 1234"
                            maxLength={19}
                            aria-label="Card number"
                            className={`${fieldClass} pr-12`}
                        />
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint"
                        >
                            <path
                                d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M7 11V7a5 5 0 0 1 10 0v4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            type="text"
                            value={values.expiry}
                            onChange={update('expiry')}
                            placeholder="MM/YY"
                            maxLength={5}
                            aria-label="Expiry date"
                            className={fieldClass}
                        />
                        <Input
                            type="text"
                            value={values.cvc}
                            onChange={update('cvc')}
                            placeholder="CVC"
                            maxLength={4}
                            aria-label="CVC"
                            className={fieldClass}
                        />
                    </div>
                </fieldset>

                <div>
                    <label htmlFor="nameOnCard" className={labelClass}>
                        Your Name on Card
                    </label>
                    <Input
                        id="nameOnCard"
                        type="text"
                        value={values.nameOnCard}
                        onChange={update('nameOnCard')}
                        placeholder="Full Name"
                        className={fieldClass}
                    />
                </div>

                <div>
                    <label htmlFor="billingZip" className={labelClass}>
                        Your Billing Zip Code
                    </label>
                    <Input
                        id="billingZip"
                        type="text"
                        value={values.zip}
                        onChange={update('zip')}
                        placeholder="Zip Code"
                        maxLength={10}
                        className={fieldClass}
                    />
                </div>

                <div>
                    <Button
                        type="submit"
                        disabled={isSaveDisabled}
                        className="bg-brand-magenta hover:bg-brand-footer text-white font-semibold px-8 h-10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving…' : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
