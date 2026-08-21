'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { InventoryItem, ItemAvailability } from '@/lib/api/types';
import { useLikedItems } from '@/lib/hooks/useLikedItems';
import { useCart } from '@/lib/hooks/useCart';
import { apiClient } from '@/lib/api/inventory';
import { Calendar } from '@/components/ui/calendar';
import { format, differenceInDays, addDays, eachDayOfInterval, isSameDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';

// Must stay >= the backend's 4-day minimum rental period.
const RENTAL_PERIODS = [4, 8, 16, 30] as const;

// Avoids the UTC-midnight parsing of new Date("YYYY-MM-DD"), which can land
// on the wrong local day.
function parseISODateLocal(isoDate: string): Date {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export default function ProductPage() {
    const params    = useParams();
    const router    = useRouter();
    const productId = params.id as string;

    const [product,          setProduct]          = useState<InventoryItem | null>(null);
    const [loading,          setLoading]          = useState(true);
    const [error,            setError]            = useState<string | null>(null);
    const [selectedImage,    setSelectedImage]    = useState(0);
    const [showLoginPrompt,  setShowLoginPrompt]  = useState(false);
    const [selectedSize,     setSelectedSize]     = useState<string | null>(null);
    const [fitExpanded,      setFitExpanded]      = useState(false);
    const [selectedPeriod,   setSelectedPeriod]   = useState<number | null>(null);

    // Rental dates
    const [dateRange,  setDateRange]  = useState<DateRange | undefined>(undefined);
    const [rentalDays, setRentalDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [dateError,  setDateError]  = useState<string | null>(null);

    // Rental availability
    const [itemAvailability,    setItemAvailability]    = useState<ItemAvailability | null>(null);
    const [loadingAvailability, setLoadingAvailability] = useState(true);

    const startDate = dateRange?.from;
    const endDate   = dateRange?.to;

    const { data: session } = useSession();
    const { addItem } = useCart();
    const { toggleLike, isLiked } = useLikedItems();

    // ── Fetch product using the dedicated /api/inventory/:id endpoint ──────────
    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                // apiClient.getProductById calls GET /api/inventory/:id and
                // runs normalizeItem — no duplicate mapping needed here.
                const data = await apiClient.getProductById(productId);
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Product not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    // ── Fetch rental availability (remaining capacity per size) ────────────────
    useEffect(() => {
        if (!productId) return;
        let cancelled = false;

        const fetchAvailability = async () => {
            try {
                setLoadingAvailability(true);
                const data = await apiClient.getItemAvailability(productId);
                if (!cancelled) setItemAvailability(data);
            } catch (err) {
                // Fail soft — treat as no availability rather than blocking the page.
                console.error('Failed to load availability:', err);
                if (!cancelled) setItemAvailability(null);
            } finally {
                if (!cancelled) setLoadingAvailability(false);
            }
        };

        fetchAvailability();
        return () => { cancelled = true; };
    }, [productId]);

    // ── Recalculate price when dates change ────────────────────────────────────
    useEffect(() => {
        if (dateRange?.from && dateRange?.to && product) {
            const days = differenceInDays(dateRange.to, dateRange.from) + 1;
            setRentalDays(days);
            setTotalPrice(product.price * days);
        } else {
            setRentalDays(0);
            setTotalPrice(0);
        }
    }, [dateRange, product]);

    // ── Rental-date availability helpers ────────────────────────────────────────
    const effectiveSize = selectedSize ?? product?.sizes?.[0] ?? null;
    const availabilityWindow = itemAvailability?.window ?? itemAvailability?.availability ?? null;

    // Expands the backend's compressed spans into a per-day units lookup.
    const perDayUnits = useMemo(() => {
        const map = new Map<string, number>();
        if (!itemAvailability || !effectiveSize) return map;
        const segments = itemAvailability.remaining[effectiveSize] ?? [];
        for (const seg of segments) {
            const end = parseISODateLocal(seg.end);
            for (let d = parseISODateLocal(seg.start); d <= end; d = addDays(d, 1)) {
                map.set(format(d, 'yyyy-MM-dd'), seg.units);
            }
        }
        return map;
    }, [itemAvailability, effectiveSize]);

    const isDayAvailable = (date: Date): boolean => {
        const units = perDayUnits.get(format(date, 'yyyy-MM-dd'));
        return typeof units === 'number' && units > 0;
    };

    const isValidPeriodStart = (date: Date, days: number): boolean => {
        for (let i = 0; i < days; i++) {
            if (!isDayAvailable(addDays(date, i))) return false;
        }
        return true;
    };

    const isRangeFullyAvailable = (from: Date, to: Date): boolean =>
        eachDayOfInterval({ start: from, end: to }).every(isDayAvailable);

    // Every valid start date per preset length. Built in calendar order, so
    // the first entry of each set is also its earliest valid start — relied
    // on by earliestStartFor below.
    const validStartsByPeriod = useMemo(() => {
        const result: Record<number, Set<string>> = {};
        for (const days of RENTAL_PERIODS) result[days] = new Set();
        if (!availabilityWindow || !effectiveSize) return result;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const windowStart = parseISODateLocal(availabilityWindow.start);
        const end = parseISODateLocal(availabilityWindow.end);
        for (let d = windowStart > today ? windowStart : today; d <= end; d = addDays(d, 1)) {
            for (const days of RENTAL_PERIODS) {
                if (isValidPeriodStart(d, days)) result[days].add(format(d, 'yyyy-MM-dd'));
            }
        }
        return result;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availabilityWindow, effectiveSize, perDayUnits]);

    const earliestStartFor = (days: number): Date | null => {
        const first = validStartsByPeriod[days]?.values().next().value;
        return first ? parseISODateLocal(first) : null;
    };

    // 4 is the minimum rental length, so any valid longer start is also a
    // valid 4-day start — this doubles as "can this item be rented at all".
    const canBookAnyDate = (validStartsByPeriod[4]?.size ?? 0) > 0;

    const isDateDisabled = (date: Date): boolean => {
        const day = new Date(date);
        day.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (day < today) return true;
        if (loadingAvailability || !effectiveSize) return true;

        if (selectedPeriod) {
            return !validStartsByPeriod[selectedPeriod]?.has(format(day, 'yyyy-MM-dd'));
        }
        return !isDayAvailable(day);
    };

    // ── Cart / rent actions ────────────────────────────────────────────────────
    const validateDates = (): boolean => {
        if (!startDate || !endDate) {
            setDateError('Please select your rental dates before continuing.');
            return false;
        }
        setDateError(null);
        return true;
    };

    const handleAddToCart = () => {
        if (!validateDates()) return;
        if (!session?.user) { setShowLoginPrompt(true); return; }
        addItem({
            productId:   product!.id,
            name:        product!.name,
            brand:       product!.brand,
            imageUrl:    product!.imageUrl,
            pricePerDay: product!.price,
            startDate:   startDate!.toISOString(),
            endDate:     endDate!.toISOString(),
            rentalDays,
            totalPrice,
        });
    };

    const handleRentNow = () => {
        if (!validateDates()) return;
        if (!session?.user) { setShowLoginPrompt(true); return; }
        addItem({
            productId:   product!.id,
            name:        product!.name,
            brand:       product!.brand,
            imageUrl:    product!.imageUrl,
            pricePerDay: product!.price,
            startDate:   startDate!.toISOString(),
            endDate:     endDate!.toISOString(),
            rentalDays,
            totalPrice,
        });
        router.push('/cart');
    };

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
        );
    }

    // ── Error / not found state ────────────────────────────────────────────────
    if (error || !product) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-3">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 font-semibold">Product Not Found</p>
                <p className="text-gray-500 text-sm">{error ?? 'The product you are looking for does not exist.'}</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-2 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                    Back to Shop
                </button>
            </div>
        );
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl ? [product.imageUrl] : [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* ── Login prompt modal ───────────────────────────────────────── */}
            {showLoginPrompt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-xl font-semibold mb-2">Sign in to continue</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Create an account or sign in to add items to your rental bag.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push(`/auth/login?callbackUrl=/product/${productId}`)}
                                className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router.push(`/auth/register`)}
                                className="flex-1 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                Create Account
                            </button>
                        </div>
                        <button
                            onClick={() => setShowLoginPrompt(false)}
                            className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
                <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
                    Shop
                </button>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-600">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* ── Left: images ────────────────────────────────────────── */}
                <div>
                    {/* Main image */}
                    <div className="relative mb-4 bg-gray-200 overflow-hidden aspect-[3/4]">
                        {images.length > 0 && images[selectedImage] ? (
                            <Image
                                src={images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                                <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-500">Image Coming Soon</p>
                            </div>
                        )}

                        {/* Navigation arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 z-10"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 z-10"
                                    aria-label="Next image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-6 gap-2">
                            {images.slice(0, 6).map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative aspect-square rounded overflow-hidden border-2 ${
                                        selectedImage === index ? 'border-black' : 'border-gray-200'
                                    }`}
                                    aria-label={`Image ${index + 1}`}
                                >
                                    <Image src={image} alt="" fill className="object-cover" sizes="100px" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Right: product details ───────────────────────────────── */}
                <div>
                    {/* Name + like */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                From <span className="underline">{product.brand}</span>
                            </p>
                            <h1 className="text-3xl font-normal">{product.name}</h1>
                        </div>
                        <button
                            onClick={() => toggleLike(product.id)}
                            className="p-2"
                            aria-label={isLiked(product.id) ? 'Unlike' : 'Like'}
                        >
                            <svg
                                className={`w-7 h-7 ${isLiked(product.id) ? 'fill-red-500 text-red-500' : 'fill-none text-gray-700'}`}
                                stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <p className="text-sm">
                            from{' '}
                            <span className="text-lg font-semibold">CAD$ {product.price.toFixed(2)}</span>
                            <span className="text-gray-500">/day</span>
                        </p>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Description</h2>
                            <p className="text-gray-700">{product.description}</p>
                        </div>
                    )}

                    {/* Seller notes */}
                    <div className="mb-6 border border-[#8C2D8B] rounded-sm p-4">
                        <h3 className="font-bold italic text-xs tracking-wide mb-3">SELLER&apos;S NOTES</h3>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {product.description && <li>{product.description}</li>}
                            <li>Brand: {product.brand}</li>
                            <li>Category: {product.category}</li>
                            {product.color    && <li>Colour: {product.color}</li>}
                            {product.occasion && <li>Occasion: <span className="capitalize">{product.occasion}</span></li>}
                        </ul>
                    </div>

                    {/* Fit details */}
                    <div className="mb-6 border-t border-b py-4">
                        <p className="text-sm font-medium mb-2">Fit details</p>
                        <span className="inline-block border border-black text-xs font-semibold tracking-wider px-3 py-1.5 rounded-sm">
                            TRUE TO SIZE
                        </span>
                    </div>

                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-2">
                            <h3 className="font-bold text-xs tracking-wide mb-3">SIZE</h3>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                                        className={`px-4 py-2 border text-sm font-medium transition-colors rounded-sm ${
                                            selectedSize === size
                                                ? 'bg-[#8C2D8B] border-[#8C2D8B] text-white'
                                                : 'border-gray-300 text-gray-800 hover:border-gray-600'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Questions about fit */}
                    <div className="mb-6">
                        <button
                            onClick={() => setFitExpanded((v) => !v)}
                            className="text-sm underline text-gray-700 flex items-center gap-1 mt-2"
                        >
                            Questions about fit?
                            <svg className={`w-4 h-4 transition-transform ${fitExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {fitExpanded && (
                            <div className="mt-3 bg-[#8C2D8B]/10 border border-[#8C2D8B]/30 text-gray-700 text-sm px-4 py-3 rounded-md">
                                Sizing varies by brand, see{' '}
                                <span className="underline cursor-pointer">brand&apos;s</span>{' '}
                                size guide for accurate measurements.
                            </div>
                        )}
                    </div>

                    {/* Rental period presets */}
                    <div className="mb-6 border-t pt-6">
                        <h3 className="font-bold text-xs tracking-wide mb-3">RENTAL PERIOD</h3>
                        <div className="flex items-start gap-2 bg-[#8C2D8B]/10 border border-[#8C2D8B]/30 rounded-sm px-3 py-2 mb-4 text-xs text-gray-700">
                            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8C2D8B]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A1 1 0 012.293 9.293L10 16.586l7.707-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Pick a length to see which dates it can start on — the calendar below
                            will highlight exactly those days.
                        </div>
                        {effectiveSize && product.sizes && product.sizes.length > 1 && !selectedSize && (
                            <p className="text-xs text-gray-500 mb-3">
                                Showing availability for size {effectiveSize} — select a size above to check another.
                            </p>
                        )}
                        {!effectiveSize && (
                            <p className="text-xs text-gray-500 mb-3">
                                Availability is not set up for this item yet.
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            {RENTAL_PERIODS.map((days) => {
                                const total = product.price * days;
                                const hasOpenDates = (validStartsByPeriod[days]?.size ?? 0) > 0;
                                const isDisabled = loadingAvailability || !effectiveSize || !hasOpenDates;
                                return (
                                    <button
                                        key={days}
                                        disabled={isDisabled}
                                        onClick={() => {
                                            setDateError(null);
                                            if (days === selectedPeriod) {
                                                setSelectedPeriod(null);
                                                setDateRange(undefined);
                                                return;
                                            }
                                            setSelectedPeriod(days);
                                            const start = earliestStartFor(days);
                                            setDateRange(start ? { from: start, to: addDays(start, days - 1) } : undefined);
                                        }}
                                        className={`border rounded-sm p-3 text-left transition-colors ${
                                            selectedPeriod === days
                                                ? 'border-[#8C2D8B] bg-[#8C2D8B]/5'
                                                : isDisabled
                                                    ? 'border-gray-100 opacity-40 cursor-not-allowed'
                                                    : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-gray-900">{days} days</p>
                                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                                            CAD$ {total.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {loadingAvailability
                                                ? 'Checking availability…'
                                                : effectiveSize && !hasOpenDates
                                                    ? 'No open dates'
                                                    : `CAD$ ${product.price.toFixed(2)}/day`}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Rental date picker */}
                    <div className="mb-6 border-t pt-6">
                        <h3 className="font-bold text-xs tracking-wide mb-1">SELECT RENTAL DATES</h3>
                        <p className="text-xs text-gray-400 mb-4">
                            {selectedPeriod
                                ? `Showing the earliest available ${selectedPeriod}-day rental — click a different day to move it.`
                                : 'Minimum 4-day rental'}
                        </p>

                        {/* Calendar + summary side by side */}
                        <div className="flex flex-col xl:flex-row gap-6 xl:items-stretch">

                            {/* Inline range calendar */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden w-full xl:w-auto xl:flex-shrink-0 xl:[--cell-size:--spacing(17)]">
                                {selectedPeriod ? (
                                    // mode="single" on purpose — react-day-picker's own
                                    // mode="range" click logic fights with disabled days here.
                                    <Calendar
                                        mode="single"
                                        selected={dateRange?.from}
                                        onSelect={(day) => {
                                            setDateError(null);
                                            if (!day) { setDateRange(undefined); return; }
                                            setDateRange({ from: day, to: addDays(day, selectedPeriod - 1) });
                                        }}
                                        disabled={isDateDisabled}
                                        numberOfMonths={1}
                                        className="p-5 w-full"
                                        classNames={{
                                            month: 'flex w-full flex-col gap-4',
                                            table: 'w-full border-collapse',
                                            week: 'mt-2 flex w-full gap-1',
                                            weekdays: 'flex gap-1',
                                            weekday: 'flex-1 rounded-md text-[0.75rem] font-semibold text-[#8A85A0] select-none',
                                            day: 'group/day relative aspect-square h-full w-full p-0 text-center select-none flex-1',
                                        }}
                                        modifiers={{
                                            range_start: (date) => !!dateRange?.from && isSameDay(date, dateRange.from),
                                            range_end: (date) => !!dateRange?.to && isSameDay(date, dateRange.to),
                                            range_middle: (date) =>
                                                !!dateRange?.from && !!dateRange?.to &&
                                                date > dateRange.from && date < dateRange.to,
                                        }}
                                    />
                                ) : (
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={(range) => {
                                            setDateError(null);

                                            if (range?.from && range?.to && !isRangeFullyAvailable(range.from, range.to)) {
                                                setDateError('That range includes dates that are already booked. Try different dates.');
                                                setDateRange({ from: range.from, to: undefined });
                                                return;
                                            }

                                            setDateRange(range);
                                        }}
                                        disabled={isDateDisabled}
                                        numberOfMonths={1}
                                        className="p-5 w-full"
                                        classNames={{
                                            month: 'flex w-full flex-col gap-4',
                                            table: 'w-full border-collapse',
                                            week: 'mt-2 flex w-full gap-1',
                                            weekdays: 'flex gap-1',
                                            weekday: 'flex-1 rounded-md text-[0.75rem] font-semibold text-[#8A85A0] select-none',
                                            day: 'group/day relative aspect-square h-full w-full p-0 text-center select-none flex-1',
                                        }}
                                        modifiers={{
                                            range_end_disabled: (date) => {
                                                if (!dateRange?.from || dateRange?.to) return false;
                                                const min = new Date(dateRange.from);
                                                min.setDate(min.getDate() + 3);
                                                return date > dateRange.from && date < min;
                                            },
                                        }}
                                        modifiersClassNames={{
                                            range_end_disabled: 'opacity-40 cursor-not-allowed',
                                        }}
                                    />
                                )}
                            </div>

                            {/* Rental summary — only shown when dates are selected */}
                            {startDate && endDate ? (
                                <div className="flex-1 bg-[#8C2D8B]/10 border border-[#8c2d8b] rounded-lg p-4">
                                    <p className="text-sm font-semibold text-[#8C2D8B] mb-3">Rental Summary</p>
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-600">Start</span>
                                        <span className="font-medium">{format(startDate, 'MMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-600">End</span>
                                        <span className="font-medium">{format(endDate, 'MMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-600">Duration</span>
                                        <span className="font-medium">{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4 text-sm">
                                        <span className="text-gray-600">Daily rate</span>
                                        <span className="font-medium">CAD$ {product.price.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-[#8c2d8b] pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900">Total</span>
                                            <span className="text-xl font-bold text-[#8C2D8B]">CAD$ {totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setDateRange(undefined); setDateError(null); }}
                                        className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        Clear dates
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-sm text-gray-400 text-center py-8">
                                    Select your start and end dates to see the rental total
                                </div>
                            )}
                        </div>

                        {/* Inline date error */}
                        {dateError && (
                            <p role="alert" className="text-sm text-red-600 mt-4 flex items-center gap-1.5">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {dateError}
                            </p>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 mb-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.availability || Number(product.stock) === 0 || loadingAvailability || !canBookAnyDate}
                            className="w-full px-6 py-3 border border-black text-black hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400 font-medium transition-colors"
                        >
                            Add to Bag
                        </button>
                        <button
                            onClick={handleRentNow}
                            disabled={!product.availability || Number(product.stock) === 0 || loadingAvailability || !canBookAnyDate}
                            className="w-full px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            Rent Now
                        </button>
                    </div>

                    {!loadingAvailability && product.availability && Number(product.stock) > 0 && !canBookAnyDate && (
                        <p className="text-xs text-gray-400 text-center mb-2">
                            This item has no open rental dates right now.
                        </p>
                    )}

                    {!session?.user && (
                        <p className="text-xs text-gray-400 text-center">
                            Sign in to add items to your cart and checkout
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
