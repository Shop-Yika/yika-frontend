import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * StatusPill
 *
 * Unified status indicator for the dashboard. One pill shape, seven variants.
 * Colors come from the status tokens defined in `globals.css` (mirrored in
 * `src/lib/design-tokens.ts`). No hex literals live in this file — all colors
 * are token-backed Tailwind utility classes.
 *
 * Each variant maps to a token family (green / yellow / magenta / olive /
 * orange / gray) and a default label that can be overridden via the `label`
 * prop when the surrounding context needs a custom string.
 */

export type StatusPillVariant =
    | 'live'        // green
    | 'pending'     // yellow
    | 'shipped'     // brand magenta
    | 'delivered'   // olive green
    | 'rented'      // orange
    | 'returned'    // gray
    | 'ended';      // gray, label "Listing ended"

type VariantConfig = {
    label: string;
    dot: string;
    badge: string;
};

const VARIANT_CONFIG: Record<StatusPillVariant, VariantConfig> = {
    live: {
        label: 'Live',
        dot: 'bg-status-green-dot',
        badge: 'border border-status-green-border bg-status-green-bg text-status-green-text',
    },
    pending: {
        label: 'Pending',
        dot: 'bg-status-yellow-dot',
        badge: 'border border-status-yellow-border bg-status-yellow-bg text-status-yellow-text',
    },
    shipped: {
        label: 'Shipped',
        dot: 'bg-status-magenta-dot',
        badge: 'border border-status-magenta-border bg-status-magenta-bg text-status-magenta-text',
    },
    delivered: {
        label: 'Delivered',
        dot: 'bg-status-olive-dot',
        badge: 'border border-status-olive-border bg-status-olive-bg text-status-olive-text',
    },
    rented: {
        label: 'Rented',
        dot: 'bg-status-orange-dot',
        badge: 'border border-status-orange-border bg-status-orange-bg text-status-orange-text',
    },
    returned: {
        label: 'Returned',
        dot: 'bg-status-gray-dot',
        badge: 'border border-status-gray-border bg-status-gray-bg text-status-gray-text',
    },
    ended: {
        label: 'Listing ended',
        dot: 'bg-status-gray-dot',
        badge: 'border border-status-gray-border bg-status-gray-bg text-status-gray-text',
    },
};

export type StatusPillProps = {
    variant: StatusPillVariant;
    /** Optional override for the default label. */
    label?: string;
};

export function StatusPill({ variant, label }: StatusPillProps) {
    const config = VARIANT_CONFIG[variant];

    return (
        <Badge
            className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap',
                config.badge,
            )}
        >
            <span aria-hidden="true" className={cn('w-2 h-2 rounded-full flex-shrink-0', config.dot)} />
            {label ?? config.label}
        </Badge>
    );
}

export default StatusPill;
