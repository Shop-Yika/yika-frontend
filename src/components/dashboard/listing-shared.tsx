"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ImageIcon, X, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhotoSlot {
    label: string;
    file?: File;
    preview?: string;
}

export interface DurationOption {
    days: number;
    label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const PHOTO_LABELS = ["Cover", "Front", "Back", "Side", "Detail", "Detail"];

export const DURATION_OPTIONS: DurationOption[] = [
    { days: 4,  label: "4 days"  },
    { days: 7,  label: "7 days"  },
    { days: 14, label: "14 days" },
    { days: 30, label: "30 days" },
];

// ─── Shared input class ───────────────────────────────────────────────────────

export const inputCls =
    "w-full h-[44px] rounded-xl border border-[#E2E0E8] bg-white px-3.5 text-sm text-[#1A1530] " +
    "placeholder:text-[#C4BFD4] focus:outline-none focus:ring-2 focus:ring-[#9B5DE5]/30 " +
    "focus:border-[#9B5DE5] transition-all";

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function usePhotoSlots(initialPreviews?: string[]) {
    const [slots, setSlots] = useState<PhotoSlot[]>(
        PHOTO_LABELS.map((label, i) => ({ label, preview: initialPreviews?.[i] }))
    );

    const handleChange = (index: number, file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setSlots((prev) =>
                prev.map((s, i) =>
                    i === index ? { ...s, file, preview: e.target?.result as string } : s
                )
            );
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = (index: number) => {
        setSlots((prev) => prev.map((s, i) => (i === index ? { label: s.label } : s)));
    };

    return { slots, handleChange, handleRemove };
}

export function useRentalPricing(rrp: string, duration: number | null) {
    const rrpNum = parseFloat(rrp) || 0;
    const recommendedPrice =
        rrpNum > 0 && duration !== null
            ? 0.115 * rrpNum * Math.pow(duration, 0.402)
            : 0;
    const maxPrice = recommendedPrice > 0 ? 1.2 * recommendedPrice : 0;
    return { recommendedPrice, maxPrice };
}

// ─── UI Primitives ────────────────────────────────────────────────────────────

export function PhotoSlotButton({
                                    label, preview, onChange, onRemove,
                                }: {
    label: string;
    preview?: string;
    onChange: (file: File) => void;
    onRemove: () => void;
}) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    return (
        <div className="flex flex-col items-center gap-1.5">
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "relative w-[100px] h-[128px] rounded-xl border-2",
                    "flex items-center justify-center overflow-hidden transition-all group",
                    preview ? "border-transparent" : "border-[#E2E0E8] hover:border-[#9B5DE5] hover:bg-[#F9F5FF]"
                )}
            >
                {preview ? (
                    <>
                        <img src={preview} alt={label} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3 text-white" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-1.5">
                        <ImageIcon className="w-5 h-5 text-[#C4BFD4]" />
                        <span className="text-[11px] text-[#8A85A0] font-medium">{label}</span>
                    </div>
                )}
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }}
            />
        </div>
    );
}

export function Field({ label, children, className }: {
    label: string; children: React.ReactNode; className?: string;
}) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <label className="text-[13px] font-semibold text-[#1A1530] tracking-wide uppercase">
                {label}
            </label>
            {children}
        </div>
    );
}

export function InlineAlert({ message, type = "warning" }: {
    message: string; type?: "warning" | "error";
}) {
    return (
        <div className={cn(
            "flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-sm",
            type === "warning" ? "bg-[#FFFBEA] border border-[#FCD34D] text-[#92400E]"
                : "bg-[#FFF5F5] border border-[#FECACA] text-[#991B1B]"
        )}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{message}</span>
        </div>
    );
}

export function StyledSelect({ placeholder, value, onValueChange, children }: {
    placeholder: string; value: string; onValueChange: (v: string) => void; children: React.ReactNode;
}) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={cn(
                "w-full h-[44px] rounded-xl border border-[#E2E0E8] bg-white px-3.5 text-sm text-[#1A1530]",
                "focus:ring-2 focus:ring-[#9B5DE5]/30 focus:border-[#9B5DE5]",
                "data-[placeholder]:text-[#C4BFD4]"
            )}>
                <SelectValue placeholder={<span className="text-[#C4BFD4]">{placeholder}</span>} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-[#E2E0E8] shadow-lg">
                {children}
            </SelectContent>
        </Select>
    );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[11px] font-bold tracking-widest uppercase text-[#9B5DE5] mt-1">
            {children}
        </p>
    );
}

// ─── Rental Price and Duration ────────────────────────────────────────────────

export function RentalPriceAndDuration({
    rrp, selectedDuration, onDurationChange, rentalPrice, onRentalPriceChange,
}: {
    rrp: string;
    selectedDuration: number | null;
    onDurationChange: (days: number) => void;
    rentalPrice: string;
    onRentalPriceChange: (val: string) => void;
}) {
    const [showCapAlert, setShowCapAlert] = useState(false);
    const { recommendedPrice, maxPrice } = useRentalPricing(rrp, selectedDuration);

    const handlePriceChange = (val: string) => {
        const num = parseFloat(val) || 0;
        if (maxPrice > 0 && num > maxPrice) {
            onRentalPriceChange(maxPrice.toFixed(2));
            setShowCapAlert(true);
        } else {
            onRentalPriceChange(val);
            setShowCapAlert(false);
        }
    };

    // Reset alert state when duration changes (new cap applies)
    const handleDurationChange = (days: number) => {
        setShowCapAlert(false);
        onDurationChange(days);
    };

    return (
        <div className="flex flex-col gap-3">
            <div>
                <h3 className="text-[15px] font-semibold text-[#1A1530]">Rental Price and Duration</h3>
                <p className="text-[13px] text-[#8A85A0] mt-1 leading-relaxed">
                    Select the duration you can rent the item for and price per duration.
                    Our recommended price is based on your item's retail value and typical
                    demand. Competitively priced listings get more bookings, and more
                    bookings means more returns on what's already sitting in your closet.
                </p>
            </div>

            {/* Duration radio pills */}
            <div className="flex flex-wrap gap-3">
                {DURATION_OPTIONS.map((opt) => {
                    const isActive = selectedDuration === opt.days;
                    return (
                        <button
                            key={opt.days}
                            type="button"
                            onClick={() => handleDurationChange(opt.days)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all",
                                isActive
                                    ? "border-[#9B5DE5] bg-[#F9F5FF] text-[#9B5DE5]"
                                    : "border-[#E2E0E8] bg-white text-[#6B6480] hover:border-[#9B5DE5] hover:bg-[#F9F5FF]"
                            )}
                        >
                            <span className={cn(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                isActive ? "border-[#9B5DE5]" : "border-[#C4BFD4]"
                            )}>
                                {isActive && <span className="w-2 h-2 rounded-full bg-[#9B5DE5]" />}
                            </span>
                            {opt.label}
                        </button>
                    );
                })}
            </div>

            {/* Price inputs — shown only after a duration is picked */}
            {selectedDuration !== null && (
                <div className="flex flex-col gap-1.5">
                    <div className="flex gap-3">
                        {/* Recommended price (read-only) */}
                        <div className="flex-1">
                            <input
                                type="number"
                                className={cn(inputCls, "bg-[#FAFAFA] text-[#8A85A0]")}
                                value={recommendedPrice > 0 ? recommendedPrice.toFixed(2) : ""}
                                readOnly
                                placeholder="0.00"
                                tabIndex={-1}
                            />
                        </div>
                        {/* Editable rental price */}
                        <div className="flex-1">
                            <input
                                type="number"
                                className={cn(inputCls, showCapAlert && "border-amber-400 focus:ring-amber-300/30 focus:border-amber-400")}
                                value={rentalPrice}
                                onChange={(e) => handlePriceChange(e.target.value)}
                                onBlur={() => setShowCapAlert(false)}
                                placeholder="0.00"
                                min={0}
                                step={0.01}
                            />
                        </div>
                    </div>
                    <p className="text-[12px] text-[#8A85A0]">Recommended price</p>
                    {showCapAlert && maxPrice > 0 && (
                        <InlineAlert
                            message={`Rental prices are capped based on your item's value. Maximum for this duration: $${maxPrice.toFixed(2)}.`}
                            type="warning"
                        />
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Availability Calendar ────────────────────────────────────────────────────

/**
 * formatSelectedSummary
 * Groups consecutive selected dates into ranges for display below the calendar.
 * e.g. [Apr 12, Apr 13, Apr 14, Apr 23] → "Apr 12 - Apr 14, Apr 23"
 */
function formatSelectedSummary(dates: Date[]): string {
    if (!dates || dates.length === 0) return "";
    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const fmt = (d: Date) => d.toLocaleString("default", { month: "short", day: "numeric" });
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].getTime() - sorted[i - 1].getTime() === 86_400_000) {
            end = sorted[i];
        } else {
            ranges.push(start.getTime() === end.getTime() ? fmt(start) : `${fmt(start)} - ${fmt(end)}`);
            start = sorted[i];
            end = sorted[i];
        }
    }
    ranges.push(start.getTime() === end.getTime() ? fmt(start) : `${fmt(start)} - ${fmt(end)}`);
    return ranges.join(", ");
}

/**
 * AvailabilityCalendar
 *
 * Fully custom calendar layout — bypasses shadcn's Calendar component entirely
 * and uses DayPicker (react-day-picker) directly. This gives us 100% control
 * over the header row (arrows + month labels) so positioning is never an issue.
 *
 * Layout:
 *   [←]  April 2026          May 2026  [→]
 *   Su Mo Tu We Th Fr Sa   Su Mo Tu We Th Fr Sa
 *   …                      …
 *
 * - Two separate DayPicker instances share the same `selected` state
 * - Our own ← → buttons control `leftMonth`; right panel = leftMonth + 1
 * - On mobile the right panel is hidden; a single month is shown
 * - Purple design tokens applied via DayPicker's `classNames` prop (these
 *   are plain CSS class strings, no shadcn merging involved)
 */
export function AvailabilityCalendar() {
    const today = new Date();
    const [leftMonth, setLeftMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selected, setSelected] = useState<Date[] | undefined>([]);

    const rightMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1);

    const goBack = () => setLeftMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
    const goForward = () => setLeftMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

    const fmtMonth = (d: Date) => d.toLocaleString("default", { month: "long", year: "numeric" });

    // Toggle a date in/out of the selected array
    const handleSelect = (dates: Date[] | undefined) => setSelected(dates);

    const summary = formatSelectedSummary(selected ?? []);

    // DayPicker classNames — plain strings, applied directly to the rdp elements.
    // No shadcn wrapper, no defaultClassNames merging.
    const dayPickerClassNames = {
        months: "w-full",
        month: "w-full",
        month_caption: "hidden",           // we render our own header
        nav: "hidden",                     // we render our own nav arrows
        weekdays: "flex w-full mb-1",
        weekday: "flex-1 text-center text-[11px] font-semibold text-[#8A85A0] select-none py-1",
        weeks: "flex flex-col gap-0.5",
        week: "flex w-full",
        day: "flex-1 flex items-center justify-center aspect-square",
        day_button: cn(
            "w-11 h-11 rounded-lg flex items-center justify-center",
            "text-[13px] font-normal text-[#1A1530] transition-all cursor-pointer",
            "hover:bg-[#F3EEFF] hover:text-[#9B5DE5]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9B5DE5]/30",
            // Selected: solid purple
            "rdp-day_selected:bg-[#9B5DE5] rdp-day_selected:text-white rdp-day_selected:hover:bg-[#7C3ACA]",
        ),
        selected: "bg-[#9B5DE5] text-white rounded-lg",
        today: "font-bold text-[#9B5DE5]",
        outside: "text-[#C4BFD4] opacity-40",
        disabled: "text-[#D4D0DF] opacity-40 cursor-not-allowed pointer-events-none",
    };

    const navArrow = cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
        "text-[#6B6480] border border-[#E2E0E8]",
        "hover:text-[#9B5DE5] hover:bg-[#F3EEFF] hover:border-[#9B5DE5]",
        "transition-all"
    );

    return (
        <div className="flex flex-col gap-3">

            {/* Section heading */}
            <div>
                <SectionLabel>Availability</SectionLabel>
                <p className="text-[14px] font-semibold text-[#1A1530] mt-1">Available dates</p>
                <p className="text-[12px] text-[#8A85A0] mt-0.5">
                    Click dates below to block them from rental availability. Showing next 6 months.
                </p>
            </div>

            {/* Calendar card — using shadcn Card for consistent styling */}
            <Card className="rounded-2xl border-none mb-5 shadow-none">
                <CardContent className="p-6 sm:p-8">

                    {/* Header row: [←] [Month A label] [Month B label] [→] */}
                    <div className="flex items-center gap-2 mb-5">

                        {/* ← Previous */}
                        <button type="button" onClick={goBack} aria-label="Previous month" className={navArrow}>
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Month labels — each centred over its grid */}
                        <div className="flex flex-1 min-w-0">
                            <span className="flex-1 text-center text-[15px] font-semibold text-[#1A1530] truncate">
                                {fmtMonth(leftMonth)}
                            </span>
                            {/* Right label only on md+ */}
                            <span className="hidden md:block flex-1 text-center text-[15px] font-semibold text-[#1A1530] truncate">
                                {fmtMonth(rightMonth)}
                            </span>
                        </div>

                        {/* → Next */}
                        <button type="button" onClick={goForward} aria-label="Next month" className={navArrow}>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Month grids */}
                    <div className="flex justify-center gap-16">

                        {/* Left month — always visible */}
                        <div className="flex items-center min-w-0">
                            <DayPicker
                                mode="multiple"
                                month={leftMonth}
                                onMonthChange={() => {}} // controlled by our arrows
                                selected={selected}
                                onSelect={handleSelect}
                                disabled={{ before: today }}
                                showOutsideDays
                                classNames={dayPickerClassNames}
                            />
                        </div>

                        {/* Vertical divider — md+ only */}
                        <div className="hidden md:block w-px bg-[#F0EDF8] self-stretch" />

                        {/* Right month — md+ only */}
                        <div className="hidden md:flex min-w-0">
                            <DayPicker
                                mode="multiple"
                                month={rightMonth}
                                onMonthChange={() => {}}
                                selected={selected}
                                onSelect={handleSelect}
                                disabled={{ before: today }}
                                showOutsideDays
                                classNames={dayPickerClassNames}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Selected date summary */}
            {summary && (
                <p className="text-[13px] text-[#1A1530]">
                    <span className="font-bold">Selected date:</span> {summary}
                </p>
            )}
        </div>
    );
}

// ─── FormShell ────────────────────────────────────────────────────────────────

/**
 * FormShell
 *
 * White card wrapper shared by both pages.
 * Header: title + subtitle on the left, ← Back link on the right.
 * `backHref` renders a Next.js <Link> — prefetched, right-click safe.
 */
export function FormShell({
                              title, subtitle, backHref, children, footer,
                          }: {
    title: string;
    subtitle: string;
    backHref?: string;
    children: React.ReactNode;
    footer: React.ReactNode;
}) {
    return (
        <div className="w-full overflow-hidden">
            <div className=" sm:px-8 pt-5 pb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-xl font-bold text-[#1A1530]">{title}</h2>
                    <p className="text-sm text-[#8A85A0] mt-1">{subtitle}</p>
                </div>
                {backHref && (
                    <Link
                        href={backHref}
                        className={cn(
                            "flex-shrink-0 flex items-center gap-1.5",
                            "px-3.5 py-2 rounded-xl text-sm font-semibold",
                            "text-[#6B6480] border border-[#E2E0E8]",
                            "hover:bg-[#F9F5FF] hover:text-[#9B5DE5] hover:border-[#9B5DE5]",
                            "transition-all"
                        )}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                )}
            </div>
            <div className="px-4 sm:px-8 py-6 flex flex-col gap-5">{children}</div>
            <div className="px-4 sm:px-8 py-5 border-t border-[#F0EDF8] flex justify-between items-center gap-3">
                {footer}
            </div>
        </div>
    );
}

// ─── SharedFormFields ─────────────────────────────────────────────────────────

export function SharedFormFields({
                                     slots, onPhotoChange, onPhotoRemove, form, set,
                                     selectedDuration, onDurationChange, rentalPrice, onRentalPriceChange,
                                     showBrandNameField,
                                 }: {
    slots: PhotoSlot[];
    onPhotoChange: (i: number, f: File) => void;
    onPhotoRemove: (i: number) => void;
    form: {
        itemName: string; category: string; size: string;
        brand: string; brandName: string; rrp: string;
    };
    set: (key: keyof typeof form) => (val: string) => void;
    selectedDuration: number | null;
    onDurationChange: (days: number) => void;
    rentalPrice: string;
    onRentalPriceChange: (val: string) => void;
    showBrandNameField?: boolean;
}) {
    return (
        <>
            {/* 1. Photos */}
            <div>
                <Field label="Photos">
                    <p className="text-[12px] text-[#8A85A0] -mt-1 mb-2">
                        Upload up to 6 photos in JPEG or PNG format. Min 1 required.
                    </p>
                    <div className="flex gap-3 flex-wrap justify-between">
                        {slots.map((slot, i) => (
                            <PhotoSlotButton
                                key={i}
                                label={slot.label}
                                preview={slot.preview}
                                onChange={(f) => onPhotoChange(i, f)}
                                onRemove={() => onPhotoRemove(i)}
                            />
                        ))}
                    </div>
                </Field>
            </div>

            {/* 2. Item Name */}
            <Field label="Item Name">
                <input
                    type="text"
                    className={inputCls}
                    placeholder="e.g. Silk Midi Dress"
                    value={form.itemName}
                    onChange={(e) => set("itemName")(e.target.value)}
                />
            </Field>

            {/* 3. Tags */}
            <div>
                <SectionLabel>Tags</SectionLabel>
                <div className="flex flex-col gap-3 mt-3">
                    <Field label="Category">
                        <StyledSelect placeholder="Select category" value={form.category} onValueChange={set("category")}>
                            <SelectItem value="dress">Dress</SelectItem>
                            <SelectItem value="skirt">Skirt</SelectItem>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="pants">Pants</SelectItem>
                            <SelectItem value="jacket">Jacket</SelectItem>
                            <SelectItem value="bag">Bag</SelectItem>
                            <SelectItem value="accessory">Accessory</SelectItem>
                        </StyledSelect>
                    </Field>

                    <Field label="Size (US)">
                        <StyledSelect placeholder="Select size" value={form.size} onValueChange={set("size")}>
                            {["XS", "S", "M", "L", "XL", "0", "2", "4", "6", "8", "10", "12"].map((s) => (
                                <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                            ))}
                        </StyledSelect>
                    </Field>

                    <Field label="Brand">
                        <StyledSelect placeholder="Select brand" value={form.brand} onValueChange={set("brand")}>
                            <SelectItem value="gucci">Gucci</SelectItem>
                            <SelectItem value="prada">Prada</SelectItem>
                            <SelectItem value="chanel">Chanel</SelectItem>
                            <SelectItem value="dior">Dior</SelectItem>
                            <SelectItem value="lv">Louis Vuitton</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </StyledSelect>
                    </Field>

                    {(showBrandNameField || form.brand === "other") && (
                        <Field label="Brand Name">
                            <input
                                type="text"
                                className={inputCls}
                                placeholder="Enter brand name"
                                value={form.brandName}
                                onChange={(e) => set("brandName")(e.target.value)}
                            />
                            {form.brand === "other" && (
                                <InlineAlert message="Listings with unlisted brands will be set to 'Pending' for review before going live." />
                            )}
                        </Field>
                    )}
                </div>
            </div>

            {/* 4. Pricing — Retail Price only */}
            <div>
                <SectionLabel>Pricing</SectionLabel>
                <div className="flex flex-col gap-1.5 mt-3">
                    <label className="text-[13px] font-semibold text-[#1A1530] tracking-wide uppercase">
                        Retail Price ($)
                    </label>
                    <p className="text-[12px] text-[#8A85A0] -mt-0.5">How much you paid for this item</p>
                    <input
                        type="number"
                        className={inputCls}
                        placeholder="0.00"
                        value={form.rrp}
                        onChange={(e) => set("rrp")(e.target.value)}
                        min={0}
                        step={0.01}
                    />
                </div>
            </div>

            {/* 5. Rental Price and Duration */}
            <RentalPriceAndDuration
                rrp={form.rrp}
                selectedDuration={selectedDuration}
                onDurationChange={onDurationChange}
                rentalPrice={rentalPrice}
                onRentalPriceChange={onRentalPriceChange}
            />

            {/* 6. Availability */}
            <AvailabilityCalendar />
        </>
    );
}