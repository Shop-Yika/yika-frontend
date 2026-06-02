import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ListingStatus, OrderStatus, ShopperOrderStatus } from './ListingCards';

type BadgeConfig = { label: string; dot: string; badge: string };

const LISTING_STATUS_CONFIG: Record<ListingStatus, BadgeConfig> = {
    live: {
        label: 'Live',
        dot:   'bg-[#15803D]',
        badge: 'border border-[#15803D] bg-[#F0FDF4] text-[#15803D]',
    },
    pending: {
        label: 'Pending',
        dot:   'bg-[#B45309]',
        badge: 'border border-[#D97706] bg-[#FFFBEB] text-[#B45309]',
    },
    ended: {
        label: 'Listing ended',
        dot:   'bg-[#9CA3AF]',
        badge: 'border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]',
    },
};

const ORDER_STATUS_CONFIG: Record<OrderStatus, BadgeConfig> = {
    live: {
        label: 'Live',
        dot:   'bg-[#15803D]',
        badge: 'border border-[#15803D] bg-[#F0FDF4] text-[#15803D]',
    },
    pending: {
        label: 'Pending',
        dot:   'bg-[#B45309]',
        badge: 'border border-[#D97706] bg-[#FFFBEB] text-[#B45309]',
    },
    rented: {
        label: 'Rented',
        dot:   'bg-[#EA580C]',
        badge: 'border border-[#EA580C] bg-[#FFF7ED] text-[#EA580C]',
    },
    returned: {
        label: 'Returned',
        dot:   'bg-[#9CA3AF]',
        badge: 'border border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]',
    },
};

const SHOPPER_STATUS_CONFIG: Record<ShopperOrderStatus, BadgeConfig> = {
    Shipped: {
        label: 'Shipped',
        dot:   'bg-[#8C2D8B]',
        badge: 'border border-[#8C2D8B] bg-[#F5DBEA] text-[#8C2D8B]',
    },
    Delivered: {
        label: 'Delivered',
        dot:   'bg-[#414E32]',
        badge: 'border border-[#414E32] bg-[#F8FAE8] text-[#414E32]',
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
