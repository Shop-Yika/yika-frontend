// Rental pricing, using the same formula as the rental site (rent.shopyika.com).
// rrp = the item's retail price.
const BASE_RATE = 0.115;
const DURATION_POWER = 0.402;
const MAX_SHARE_OF_RRP = 0.5; // the fee never goes above 50% of the retail price

export function getRentalFee(rrp: number, days: number): number {
    if (rrp <= 0 || days <= 0) return 0;
    const fee = BASE_RATE * rrp * Math.pow(days, DURATION_POWER);
    const capped = Math.min(fee, rrp * MAX_SHARE_OF_RRP);
    return Math.round(capped * 100) / 100;
}

// How much cheaper per day a longer rental is, compared with the shortest one.
// Returns a whole number, for example 28 for "Save 28%".
export function getSavingsPct(rrp: number, days: number, baseDays: number): number {
    const perDay = getRentalFee(rrp, days) / Math.max(days, 1);
    const basePerDay = getRentalFee(rrp, baseDays) / Math.max(baseDays, 1);
    return basePerDay > 0 ? Math.round((1 - perDay / basePerDay) * 100) : 0;
}

// Fees copied from the rental site. Fixed for now; later they should come from the backend.
const SHIPPING = { Standard: 12, Express: 20, 'Local Pickup': 0 } as const;
const HST_PCT = 13; // tax, charged on rental + fulfilment
const DPF_PCT = 11; // damage protection fee, charged on the rental only

export type FulfilmentMethod = keyof typeof SHIPPING;

const round2 = (n: number) => Math.round(n * 100) / 100;

// The full charges breakdown for one rental, worked out the same way as the rental site.
export function getRentalEstimate(rrp: number, days: number, method: FulfilmentMethod = 'Standard') {
    const rental = getRentalFee(rrp, days);
    const shipping = SHIPPING[method];
    const subtotal = round2(rental + shipping);
    const hst = round2((subtotal * HST_PCT) / 100);
    const dpf = round2((rental * DPF_PCT) / 100);
    const total = round2(subtotal + hst + dpf);
    return { method, rental, shipping, hst, dpf, total, hstPct: HST_PCT, dpfPct: DPF_PCT };
}