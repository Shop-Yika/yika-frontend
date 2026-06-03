"use client";

/**
 * Shopper Account Settings page.
 *
 * Form fields:
 *   - Name (combined first + last)
 *   - Email
 *   - Password (write-only stub — password change flow is out of scope per B4)
 *   - Shipping Address (street + city/state/zip 3-col grid)
 *
 * Behavior (per designer Thanh Nguyen's sticky note in Figma 4449:1734):
 *   The "Save Changes" button is disabled until the form is dirty
 *   (any field differs from the loaded baseline). After a successful save,
 *   the current values become the new baseline so the button disables again.
 */

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { user } from '@/lib/data/repositories';
import type { UserProfile } from '@/lib/data/types';

/**
 * Form-shape mirror of `UserProfile` plus a `password` field. We collapse
 * `firstName` + `lastName` into a single editable "Name" string and split
 * on submit (last whitespace-separated token = lastName, rest = firstName).
 */
type FormValues = {
    name: string;
    email: string;
    /** Stub field — not currently round-tripped to the backend. */
    password: string;
    street: string;
    city: string;
    state: string;
    zip: string;
};

const EMPTY_FORM: FormValues = {
    name: '',
    email: '',
    password: '',
    street: '',
    city: '',
    state: '',
    zip: '',
};

function profileToForm(profile: UserProfile): FormValues {
    return {
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        email: profile.email,
        password: '',
        street: profile.shippingAddress.street,
        city: profile.shippingAddress.city,
        state: profile.shippingAddress.state,
        zip: profile.shippingAddress.zip,
    };
}

/**
 * Split a display name into firstName/lastName. The last whitespace-separated
 * token becomes the lastName; everything before it becomes the firstName.
 * Single-token names go entirely into firstName with an empty lastName.
 */
function splitName(displayName: string): { firstName: string; lastName: string } {
    const trimmed = displayName.trim();
    if (trimmed.length === 0) return { firstName: '', lastName: '' };
    const tokens = trimmed.split(/\s+/);
    if (tokens.length === 1) return { firstName: tokens[0], lastName: '' };
    return {
        firstName: tokens.slice(0, -1).join(' '),
        lastName: tokens[tokens.length - 1],
    };
}

/**
 * Build a `Partial<UserProfile>` containing only the fields that changed
 * relative to the baseline. The `password` field is intentionally dropped —
 * the UserProfile type has no password and the password change flow is out
 * of scope for B4.
 */
function buildPatch(current: FormValues, baseline: FormValues): Partial<UserProfile> {
    const patch: Partial<UserProfile> = {};

    if (current.name !== baseline.name) {
        const { firstName, lastName } = splitName(current.name);
        patch.firstName = firstName;
        patch.lastName = lastName;
    }

    if (current.email !== baseline.email) {
        patch.email = current.email;
    }

    const addressPatch: Partial<UserProfile['shippingAddress']> = {};
    if (current.street !== baseline.street) addressPatch.street = current.street;
    if (current.city !== baseline.city) addressPatch.city = current.city;
    if (current.state !== baseline.state) addressPatch.state = current.state;
    if (current.zip !== baseline.zip) addressPatch.zip = current.zip;

    if (Object.keys(addressPatch).length > 0) {
        // `shippingAddress` on `UserProfile` is required, but the repository
        // merges patches field-by-field so a partial address is safe at the
        // call boundary. The cast keeps the public type honest.
        patch.shippingAddress = addressPatch as UserProfile['shippingAddress'];
    }

    return patch;
}

// Shared field-row styles. Tokens come from `src/lib/design-tokens.ts` →
// CSS vars in `globals.css` → Tailwind semantic classes here.
const labelClass = 'block text-sm font-semibold text-text-primary mb-2';
const fieldClass =
    'h-10 bg-border-subtle border-border-default text-text-primary placeholder:text-text-faint';

export default function ShopperSettingsPage() {
    const [baseline, setBaseline] = useState<FormValues>(EMPTY_FORM);
    const [values, setValues] = useState<FormValues>(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load initial profile from the data layer.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const profile = await user.getProfile();
            if (cancelled) return;
            const initial = profileToForm(profile);
            setBaseline(initial);
            setValues(initial);
            setLoading(false);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Dirty check via deep-equality of the small form object. JSON.stringify
    // is acceptable here because the form is a flat object of primitives,
    // keys are stable, and the comparison only runs on render.
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
            const patch = buildPatch(values, baseline);
            const updated = await user.updateProfile(patch);
            const nextBaseline = profileToForm(updated);
            setBaseline(nextBaseline);
            // Preserve the password field the user typed (stays in the form
            // until they navigate away) but reset everything else from the
            // server response so the dirty check resolves correctly.
            setValues({ ...nextBaseline, password: '' });
        } finally {
            setSaving(false);
        }
    }

    const isSaveDisabled = !isDirty || saving || loading;

    return (
        <div className="mt-8 max-w-xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label htmlFor="name" className={labelClass}>
                        Name
                    </label>
                    <Input
                        id="name"
                        type="text"
                        value={values.name}
                        onChange={update('name')}
                        disabled={loading}
                        className={fieldClass}
                    />
                </div>

                <div>
                    <label htmlFor="email" className={labelClass}>
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={values.email}
                        onChange={update('email')}
                        disabled={loading}
                        className={fieldClass}
                    />
                </div>

                <div>
                    <label htmlFor="password" className={labelClass}>
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        value={values.password}
                        onChange={update('password')}
                        disabled={loading}
                        placeholder="••••••••••••••••"
                        className={fieldClass}
                    />
                </div>

                <fieldset className="flex flex-col gap-3">
                    <legend className={labelClass}>Shipping Address</legend>
                    <Input
                        type="text"
                        value={values.street}
                        onChange={update('street')}
                        placeholder="Street address"
                        aria-label="Street address"
                        disabled={loading}
                        className={fieldClass}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            type="text"
                            value={values.city}
                            onChange={update('city')}
                            placeholder="City"
                            aria-label="City"
                            disabled={loading}
                            className={fieldClass}
                        />
                        <Input
                            type="text"
                            value={values.state}
                            onChange={update('state')}
                            placeholder="State"
                            aria-label="State"
                            disabled={loading}
                            className={fieldClass}
                        />
                        <Input
                            type="text"
                            value={values.zip}
                            onChange={update('zip')}
                            placeholder="ZIP"
                            aria-label="ZIP code"
                            disabled={loading}
                            className={fieldClass}
                        />
                    </div>
                </fieldset>

                <div>
                    <Button
                        type="submit"
                        disabled={isSaveDisabled}
                        className="bg-brand-magenta hover:bg-brand-footer text-white px-8 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving…' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
