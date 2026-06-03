import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * EarningsSummaryCard
 *
 * One of the two summary cards on the merchant Your Earnings page
 * (`figma/4570-3922-earnings.png`). Renders a title, a large dollar
 * value, and a small subtitle (e.g. "Since Jan 1, 2026" or "From
 * Order #YK-2026-002").
 *
 * Layout (matches the Figma):
 *   ┌──────────────────────────────┐
 *   │ Total Earnings               │
 *   │                              │
 *   │ $1,820.00                    │
 *   │                              │
 *   │ Since Jan 1, 2026            │
 *   └──────────────────────────────┘
 *
 * Colors and radii come from the design tokens (`design-tokens.ts`)
 * exposed as Tailwind semantic classes — no hex literals live here.
 *
 * @example
 *   <EarningsSummaryCard
 *     title="Total Earnings"
 *     value={1820}
 *     subtitle="Since Jan 1, 2026"
 *   />
 */
export type EarningsSummaryCardProps = {
    /** Card label, e.g. "Total Earnings" / "Pending Earnings". */
    title: string;
    /** Dollar amount in USD. Rendered as `$X,XXX.XX`. */
    value: number;
    /** Small muted line below the value. */
    subtitle: string;
    /** Optional extra classes for the outer Card. */
    className?: string;
};

/**
 * Currency formatter — US locale, 2 fractional digits, grouped thousands.
 * Pulled out of the component so it isn't reallocated on every render.
 */
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export function EarningsSummaryCard({
    title,
    value,
    subtitle,
    className,
}: EarningsSummaryCardProps) {
    return (
        <Card
            className={cn(
                'p-5 gap-2 bg-surface rounded-2xl shadow-none border border-border-default min-h-[180px]',
                className,
            )}
        >
            <h3 className="font-bold text-[20px] text-text-primary">{title}</h3>
            <p className="font-semibold text-[40px] text-text-primary leading-tight">
                {CURRENCY_FORMATTER.format(value)}
            </p>
            <p className="text-[14px] text-text-faint">{subtitle}</p>
        </Card>
    );
}

export default EarningsSummaryCard;
