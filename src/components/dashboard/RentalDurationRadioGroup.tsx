"use client";

/**
 * RentalDurationRadioGroup — row of 4 rental-duration radio pills.
 *
 * Used by the merchant "Post a Listing" page (issue B9). Each pill is
 * a radio button styled to match the Figma:
 *   ( ) 4 days   ( ) 7 days   ( ) 14 days   ( ) 30 days
 *
 * **Default state: nothing selected.** Per Thanh Nguyen's sticky note
 * in the Figma frame, the merchant must affirmatively pick a duration.
 *
 * Design tokens (Tailwind semantic classes):
 *   - border-border-default       inactive border
 *   - text-text-primary           label
 *   - text-text-muted             unselected ring
 *   - bg-brand-magenta            selected fill
 *   - bg-status-magenta-bg        selected pill background
 */

import { cn } from '@/lib/utils';

export type RentalDuration = 4 | 7 | 14 | 30;

const OPTIONS: { days: RentalDuration; label: string }[] = [
    { days: 4, label: '4 days' },
    { days: 7, label: '7 days' },
    { days: 14, label: '14 days' },
    { days: 30, label: '30 days' },
];

export type RentalDurationRadioGroupProps = {
    /** Currently-selected duration, or `null` for the initial empty state. */
    value: RentalDuration | null;
    /** Called when the user picks a duration. */
    onChange: (days: RentalDuration) => void;
    /** Optional id base used for radio inputs (for `<label htmlFor>`). */
    name?: string;
};

export function RentalDurationRadioGroup({
    value,
    onChange,
    name = 'rental-duration',
}: RentalDurationRadioGroupProps) {
    return (
        <div
            role="radiogroup"
            aria-label="Rental duration"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
            {OPTIONS.map((opt) => {
                const isActive = value === opt.days;
                const inputId = `${name}-${opt.days}`;
                return (
                    <label
                        key={opt.days}
                        htmlFor={inputId}
                        className={cn(
                            'flex items-center gap-2.5 px-4 h-11 rounded-xl border cursor-pointer transition-colors',
                            isActive
                                ? 'border-brand-magenta bg-status-magenta-bg'
                                : 'border-border-default bg-surface hover:border-brand-magenta/60',
                        )}
                    >
                        <input
                            id={inputId}
                            type="radio"
                            name={name}
                            value={opt.days}
                            checked={isActive}
                            onChange={() => onChange(opt.days)}
                            className="sr-only"
                        />
                        <span
                            aria-hidden
                            className={cn(
                                'grid place-items-center w-4 h-4 rounded-full border-2 flex-shrink-0',
                                isActive
                                    ? 'border-brand-magenta'
                                    : 'border-text-faint',
                            )}
                        >
                            {isActive && (
                                <span className="w-2 h-2 rounded-full bg-brand-magenta" />
                            )}
                        </span>
                        <span
                            className={cn(
                                'text-sm',
                                isActive
                                    ? 'font-semibold text-text-primary'
                                    : 'text-text-primary',
                            )}
                        >
                            {opt.label}
                        </span>
                    </label>
                );
            })}
        </div>
    );
}

export default RentalDurationRadioGroup;
