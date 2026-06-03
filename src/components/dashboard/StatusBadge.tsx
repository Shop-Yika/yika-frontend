import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ListingStatus, OrderStatus, ShopperOrderStatus } from './ListingCards';

type BadgeConfig = { label: string; dot: string; badge: string };

const LISTING_STATUS_CONFIG: Record<ListingStatus, BadgeConfig> = {
    live: {
        label: 'Live',
        dot:   'bg-status-green-dot',
        badge: 'border border-status-green-border bg-status-green-bg text-status-green-text',
    },
    pending: {
        label: 'Pending',
        dot:   'bg-status-yellow-dot',
        badge: 'border border-status-yellow-border bg-status-yellow-bg text-status-yellow-text',
    },
    ended: {
        label: 'Listing ended',
        dot:   'bg-status-gray-dot',
        badge: 'border border-status-gray-border bg-status-gray-bg text-status-gray-text',
    },
};

const ORDER_STATUS_CONFIG: Record<OrderStatus, BadgeConfig> = {
    live: {
        label: 'Live',
        dot:   'bg-status-green-dot',
        badge: 'border border-status-green-border bg-status-green-bg text-status-green-text',
    },
    pending: {
        label: 'Pending',
        dot:   'bg-status-yellow-dot',
        badge: 'border border-status-yellow-border bg-status-yellow-bg text-status-yellow-text',
    },
    rented: {
        label: 'Rented',
        dot:   'bg-status-orange-dot',
        badge: 'border border-status-orange-border bg-status-orange-bg text-status-orange-text',
    },
    returned: {
        label: 'Returned',
        dot:   'bg-status-gray-dot',
        badge: 'border border-status-gray-border bg-status-gray-bg text-status-gray-text',
    },
};

const SHOPPER_STATUS_CONFIG: Record<ShopperOrderStatus, BadgeConfig> = {
    Shipped: {
        label: 'Shipped',
        dot:   'bg-status-magenta-dot',
        badge: 'border border-status-magenta-border bg-status-magenta-bg text-status-magenta-text',
    },
    Delivered: {
        label: 'Delivered',
        dot:   'bg-status-olive-dot',
        badge: 'border border-status-olive-border bg-status-olive-bg text-status-olive-text',
    },
};

type StatusBadgeProps =
    | { type: 'listing'; status: ListingStatus }
    | { type: 'order'; status: OrderStatus }
    | { type: 'shopper'; status: ShopperOrderStatus };

export function StatusBadge(props: StatusBadgeProps) {
    const config: BadgeConfig =
        props.type === 'listing'
            ? LISTING_STATUS_CONFIG[props.status]
            : props.type === 'order'
                ? ORDER_STATUS_CONFIG[props.status]
                : SHOPPER_STATUS_CONFIG[props.status];

    return (
        <Badge
            className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap',
                config.badge,
            )}
        >
            <span aria-hidden="true" className={cn('w-2 h-2 rounded-full flex-shrink-0', config.dot)} />
            {config.label}
        </Badge>
    );
}

export default StatusBadge;
