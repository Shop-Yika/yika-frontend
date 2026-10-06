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