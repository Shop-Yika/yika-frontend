import OrderCard from '@/components/dashboard/OrderCard';
import { SAMPLE_ORDERS } from '@/lib/data/sample-data';

export default function OrdersPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[auto_4fr_100px_100px_auto_1fr] gap-4 mt-4 md:mt-0">
            <div className="hidden md:grid grid-cols-subgrid col-span-6 justify-items-center text-[11px] font-semibold tracking-wider uppercase text-[#9CA3AF] mt-6 mb-2">
                <span className="invisible">Image</span>
                <span className="justify-self-start invisible">Order</span>
                <span>Total</span>
                <span>Order date</span>
                <span>Status</span>
                <span className="invisible">Details</span>
            </div>
            {SAMPLE_ORDERS.map(order => (
                <OrderCard key={order.id} item={order} />
            ))}
        </div>
    );
}
