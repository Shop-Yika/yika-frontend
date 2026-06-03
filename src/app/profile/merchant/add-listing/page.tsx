"use client";

/**
 * Merchant "Post a Listing" page (issue B9).
 *
 * Form sections (per Figma `4694-3750-list-an-item.png`):
 *   1. Photos     — 5 labeled upload slots (Cover/Front/Back/Side/Detail)
 *   2. Item Name  — text input
 *   3. Tags       — Category / Size (US) / Brand dropdowns
 *   4. Pricing    — Retail Price ($) input
 *   5. Rental Price and Duration — 4-option radio group (NONE selected by default)
 *   6. Availability — 2-month calendar, multi-date selection
 *   7. Footer     — Back to Listings + Publish Listing
 *
 * Designer sticky notes (Thanh Nguyen) enforced here:
 *   • Default state: no rental-duration radio is pre-selected.
 *   • Selected-date summary auto-updates as the user clicks the calendar,
 *     grouping consecutive days into ranges (e.g. "Mar 6 - Mar 13, Apr 6 - Apr 20").
 *
 * The Phase A shell (profile header + dashboard tabs) is applied by
 * `src/app/profile/merchant/layout.tsx` — this page only renders the
 * form card.
 */

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { PhotoUploadSlot } from '@/components/dashboard/PhotoUploadSlot';
import {
    RentalDurationRadioGroup,
    type RentalDuration,
} from '@/components/dashboard/RentalDurationRadioGroup';
import { listings, type ListingDraft } from '@/lib/data/repositories';

// ─── Form constants ───────────────────────────────────────────────────────────

const PHOTO_LABELS = ['Cover', 'Front', 'Back', 'Side', 'Detail'] as const;

const CATEGORY_OPTIONS = [
    { value: 'dress', label: 'Dress' },
    { value: 'skirt', label: 'Skirt' },
    { value: 'top', label: 'Top' },
    { value: 'pants', label: 'Pants' },
    { value: 'jacket', label: 'Jacket' },
    { value: 'bag', label: 'Bag' },
    { value: 'accessory', label: 'Accessory' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '0', '2', '4', '6', '8', '10', '12'];

const BRAND_OPTIONS = [
    { value: 'gucci', label: 'Gucci' },
    { value: 'prada', label: 'Prada' },
    { value: 'chanel', label: 'Chanel' },
    { value: 'dior', label: 'Dior' },
    { value: 'louis-vuitton', label: 'Louis Vuitton' },
    { value: 'reformation', label: 'Reformation' },
    { value: 'ganni', label: 'Ganni' },
    { value: 'zara', label: 'Zara' },
    { value: 'sezane', label: 'Sezane' },
    { value: 'other', label: 'Other' },
];

const ACTIVE_LISTINGS_HREF = '/profile/merchant/active-listings';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format a list of selected days into a human-readable summary,
 * grouping consecutive days into ranges.
 *
 * Example: [Mar 6, Mar 7, Mar 8, Apr 6, Apr 7] → "Mar 6 - Mar 8, Apr 6 - Apr 7"
 */
function formatSelectedSummary(dates: Date[]): string {
    if (dates.length === 0) return '';

    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const fmt = (d: Date) =>
        d.toLocaleString('default', { month: 'short', day: 'numeric' });

    const ONE_DAY_MS = 86_400_000;
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
        const diff = sorted[i].getTime() - sorted[i - 1].getTime();
        if (diff === ONE_DAY_MS) {
            end = sorted[i];
        } else {
            ranges.push(
                start.getTime() === end.getTime()
                    ? fmt(start)
                    : `${fmt(start)} - ${fmt(end)}`,
            );
            start = sorted[i];
            end = sorted[i];
        }
    }
    ranges.push(
        start.getTime() === end.getTime()
            ? fmt(start)
            : `${fmt(start)} - ${fmt(end)}`,
    );
    return ranges.join(', ');
}

/**
 * Collapse a multi-date selection into the same shape the data layer expects
 * (`{ from, to }` windows). Each consecutive run of days becomes one window.
 */
function toAvailabilityWindows(dates: Date[]): { from: Date; to: Date }[] {
    if (dates.length === 0) return [];

    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const ONE_DAY_MS = 86_400_000;
    const windows: { from: Date; to: Date }[] = [];
    let from = sorted[0];
    let to = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].getTime() - sorted[i - 1].getTime() === ONE_DAY_MS) {
            to = sorted[i];
        } else {
            windows.push({ from, to });
            from = sorted[i];
            to = sorted[i];
        }
    }
    windows.push({ from, to });
    return windows;
}

// ─── Page component ──────────────────────────────────────────────────────────

type FormState = {
    itemName: string;
    category: string;
    size: string;
    brand: string;
    retailPrice: string;
};

const EMPTY_FORM: FormState = {
    itemName: '',
    category: '',
    size: '',
    brand: '',
    retailPrice: '',
};

export default function AddListingPage() {
    const router = useRouter();

    // Per-slot photo files + preview data URLs (held client-side; no upload).
    const [photos, setPhotos] = useState<(File | null)[]>(
        () => PHOTO_LABELS.map(() => null),
    );
    const [previews, setPreviews] = useState<(string | null)[]>(
        () => PHOTO_LABELS.map(() => null),
    );

    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [duration, setDuration] = useState<RentalDuration | null>(null);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const setField = <K extends keyof FormState>(key: K) =>
        (value: FormState[K]) =>
            setForm((prev) => ({ ...prev, [key]: value }));

    // Block dates before today on the calendar.
    const today = useRef(new Date()).current;

    const handlePhotoChange = (index: number, file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result;
            if (typeof dataUrl !== 'string') return;
            setPhotos((prev) => {
                const next = [...prev];
                next[index] = file;
                return next;
            });
            setPreviews((prev) => {
                const next = [...prev];
                next[index] = dataUrl;
                return next;
            });
        };
        reader.readAsDataURL(file);
    };

    const handlePhotoRemove = (index: number) => {
        setPhotos((prev) => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
        setPreviews((prev) => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
    };

    const summary = useMemo(
        () => formatSelectedSummary(selectedDates),
        [selectedDates],
    );

    // Form validity — the Publish button stays disabled until all of these hold.
    const isValid =
        photos.some((p) => p !== null) &&
        form.itemName.trim().length > 0 &&
        form.category.length > 0 &&
        form.size.length > 0 &&
        form.brand.length > 0 &&
        Number(form.retailPrice) > 0 &&
        duration !== null &&
        selectedDates.length > 0;

    const handlePublish = async () => {
        if (!isValid || submitting) return;
        setSubmitting(true);
        try {
            const draft: ListingDraft = {
                name: form.itemName.trim(),
                category: form.category,
                size: form.size,
                brand: form.brand,
                retailPrice: Number(form.retailPrice),
                // Non-null assertion is safe: `isValid` gates this branch.
                durationDays: duration!,
                photos: photos.filter((p): p is File => p !== null),
                availability: toAvailabilityWindows(selectedDates),
            };
            const created = await listings.createListing(draft);
            // No toast component is wired in this repo yet — log so the
            // manual-testing checklist (acceptance criterion: "console.log
            // shows form data") can confirm the call shape.
            console.log('Listing published (stub):', created);
            router.push(ACTIVE_LISTINGS_HREF);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="mt-10 bg-surface rounded-2xl border border-border-default p-6 sm:p-8">
            {/* Header */}
            <header className="mb-6">
                <h2 className="text-xl font-bold text-text-primary">Post a Listing</h2>
                <p className="text-sm text-text-muted mt-1">
                    Add your item details to list it for rental.
                </p>
            </header>

            <div className="flex flex-col gap-8">
                {/* 1. Photos */}
                <Fieldset
                    label="Photos"
                    helpText="Upload up to 6 photos in JPEG or PNG format. Min 1 required."
                >
                    <div className="grid grid-cols-5 gap-3 max-w-xl">
                        {PHOTO_LABELS.map((label, i) => (
                            <PhotoUploadSlot
                                key={label + i}
                                label={label}
                                preview={previews[i] ?? undefined}
                                onChange={(file) => handlePhotoChange(i, file)}
                                onRemove={() => handlePhotoRemove(i)}
                            />
                        ))}
                    </div>
                </Fieldset>

                {/* 2. Item Name */}
                <Fieldset label="Item Name">
                    <Input
                        type="text"
                        value={form.itemName}
                        onChange={(e) => setField('itemName')(e.target.value)}
                        placeholder="e.g. Silk Midi Dress"
                        className="h-11 bg-border-subtle border-border-default text-text-primary placeholder:text-text-faint max-w-xl"
                    />
                </Fieldset>

                {/* 3. Tags — Category / Size / Brand */}
                <SectionGroup label="TAGS">
                    <Fieldset label="Category">
                        <FormSelect
                            value={form.category}
                            onValueChange={setField('category')}
                            placeholder="Select a category"
                        >
                            {CATEGORY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </FormSelect>
                    </Fieldset>

                    <Fieldset label="Size (US)">
                        <FormSelect
                            value={form.size}
                            onValueChange={setField('size')}
                            placeholder="Select a size"
                        >
                            {SIZE_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s.toLowerCase()}>
                                    {s}
                                </SelectItem>
                            ))}
                        </FormSelect>
                    </Fieldset>

                    <Fieldset label="Brand">
                        <FormSelect
                            value={form.brand}
                            onValueChange={setField('brand')}
                            placeholder="Select a brand"
                        >
                            {BRAND_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </FormSelect>
                    </Fieldset>
                </SectionGroup>

                {/* 4. Pricing */}
                <SectionGroup label="PRICING">
                    <Fieldset
                        label="Retail Price ($)"
                        helpText="How much you paid for the item"
                    >
                        <Input
                            type="number"
                            value={form.retailPrice}
                            onChange={(e) => setField('retailPrice')(e.target.value)}
                            placeholder="0.00"
                            min={0}
                            step={0.01}
                            inputMode="decimal"
                            className="h-11 bg-border-subtle border-border-default text-text-primary placeholder:text-text-faint max-w-xl"
                        />
                    </Fieldset>
                </SectionGroup>

                {/* 5. Rental Price and Duration */}
                <Fieldset label="Rental Price and Duration">
                    <p className="text-sm text-text-muted mb-3 leading-relaxed max-w-xl">
                        Select the duration you can rent the item for and price per
                        duration. Our recommended price is based on your item&apos;s
                        retail value and typical demand. Competitively priced listings
                        get more bookings, and more bookings means more returns on
                        what&apos;s already sitting in your closet.
                    </p>
                    <div className="max-w-xl">
                        <RentalDurationRadioGroup
                            value={duration}
                            onChange={setDuration}
                        />
                    </div>
                </Fieldset>

                {/* 6. Availability */}
                <SectionGroup label="AVAILABILITY">
                    <div>
                        <p className="text-sm font-semibold text-text-primary">
                            Available dates
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                            Click dates below to block them from rental availability.
                            Showing next 6 months.
                        </p>
                    </div>
                    <div className="rounded-xl border border-border-default p-3 sm:p-4 inline-block">
                        <Calendar
                            mode="multiple"
                            selected={selectedDates}
                            onSelect={(d) => setSelectedDates(d ?? [])}
                            numberOfMonths={2}
                            disabled={{ before: today }}
                            showOutsideDays
                        />
                    </div>
                    {summary && (
                        <p className="text-sm text-text-primary">
                            <span className="font-semibold">Selected date:</span>{' '}
                            {summary}
                        </p>
                    )}
                </SectionGroup>
            </div>

            {/* Footer */}
            <footer className="mt-10 pt-6 border-t border-border-default flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                <Button
                    asChild
                    variant="outline"
                    className="h-10 px-6 border-border-default text-text-primary hover:bg-border-subtle"
                >
                    <Link href={ACTIVE_LISTINGS_HREF}>Back to Listings</Link>
                </Button>
                <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={!isValid || submitting}
                    className="h-10 px-6 bg-brand-magenta hover:bg-brand-footer text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Publishing…' : 'Publish Listing'}
                </Button>
            </footer>
        </section>
    );
}

// ─── Local layout helpers ─────────────────────────────────────────────────────

/**
 * Field wrapper — uppercase label above the control, optional help text.
 * Mirrors the Figma's TAGS / PRICING / AVAILABILITY field pattern.
 */
function Fieldset({
    label,
    helpText,
    children,
}: {
    label: string;
    helpText?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-primary">
                {label}
            </label>
            {helpText && (
                <p className="text-xs text-text-muted -mt-1">{helpText}</p>
            )}
            {children}
        </div>
    );
}

/**
 * Section group — a small uppercase section header above a stack of fields.
 * Used for the TAGS, PRICING, and AVAILABILITY groupings in the Figma.
 */
function SectionGroup({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold tracking-wider text-text-faint uppercase">
                {label}
            </p>
            <div className="flex flex-col gap-4">{children}</div>
        </div>
    );
}

/**
 * Form select wrapper — applies the form's gray-tinted trigger styling.
 *
 * Reads design tokens from `globals.css` via Tailwind semantic classes.
 */
function FormSelect({
    value,
    onValueChange,
    placeholder,
    children,
}: {
    value: string;
    onValueChange: (v: string) => void;
    placeholder: string;
    children: React.ReactNode;
}) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="h-11 w-full max-w-xl bg-border-subtle border-border-default text-text-primary data-[placeholder]:text-text-faint">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
        </Select>
    );
}
