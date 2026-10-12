import { getRentalEstimate } from '@/lib/pricing';

const formatCad = (n: number) =>
    'CAD$ ' + n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ROW = 'flex justify-between py-[11px] border-b border-[#f6eef4] last:border-b-0';

interface RentalEstimateProps {
    rrp: number;           // the item's retail price
    days: number;          // the chosen rental length
    hasSelection: boolean; // false when no rental window is selected
}

// The charges breakdown under the calendar, same rows as the rental site.
export function RentalEstimate({ rrp, days, hasSelection }: RentalEstimateProps) {
    const estimate = getRentalEstimate(rrp, days);

    return (
        <div className="bg-[#FCF2F8] border border-[#ecdde8] rounded-xl py-1 px-3.5 mt-4 text-[13.5px] text-[#2a1f2b]">
            {!hasSelection ? (
                <div className={ROW}>
                    <span className="text-[12.5px] text-[#9a8b98]">
                        Pick a duration and window to see your estimate.
                    </span>
                </div>
            ) : (
                <>
                    <div className={ROW}>
                        <span>Rental ({days} days)</span>
                        <span>{formatCad(estimate.rental)}</span>
                    </div>
                    <div className={ROW}>
                        <span>{estimate.method} fulfilment</span>
                        <span>{formatCad(estimate.shipping)}</span>
                    </div>
                    <div className={ROW}>
                        <span>HST ({estimate.hstPct}%)</span>
                        <span>{formatCad(estimate.hst)}</span>
                    </div>
                    <div className={ROW}>
                        <span>Damage Protection ({estimate.dpfPct}%)</span>
                        <span>{formatCad(estimate.dpf)}</span>
                    </div>
                    <div className={ROW}>
                        <span><b className="text-[#662762]">Estimated total</b></span>
                        <span><b className="text-[#662762]">{formatCad(estimate.total)}</b></span>
                    </div>
                </>
            )}
        </div>
    );
}