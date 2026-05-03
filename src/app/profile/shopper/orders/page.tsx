import OrderCard, {OrderCardProps} from '@/components/dashboard/OrderCard';

const orders: OrderCardProps[] = [
    {
        image: '/assets/dashboard/shoe.jpg',
        alt: 'shoe',
        id: 'ADM-2026-001623',
        items: 4,
        user: 'hellokitty',
        total: '128.00',
        date: 'Mar 12, 2025',
        status: 'Delivered',
    },
    {
        image: '/assets/dashboard/glasses.jpg',
        alt: 'glasses',
        id: 'ADM-2024-001007',
        items: 3,
        user: 'kirby',
        total: '97.15',
        date: 'Mar 11, 2025',
        status: 'Shipped',
    },
    {
        image: '/assets/dashboard/pants.jpg',
        alt: 'pants',
        id: 'ADM-2025-005231',
        items: 2,
        user: 'yikaofficial',
        total: '58.59',
        date: 'Mar 6, 2025',
        status: 'Delivered',
    },
];

export default function OrdersPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[auto_4fr_100px_100px_auto_1fr] gap-4 mt-4 md:mt-0">
            <div className="hidden md:grid grid-cols-subgrid col-span-6 justify-items-center font-bold text-[#717182] mt-12">
                <span className="invisible">Image</span>
                <span className="invisible">Order</span>
                <span>Total</span>
                <span>Order date</span>
                <span>Status</span>
                <span className="invisible">Details</span>
            </div>
            {orders.map(order => (
                <OrderCard
                    key={order.id}
                    {...order}
                />
            ))}
        </div>
    );
}
