import { OrderRow } from '@/components/dashboard/OrderRow';
import { orders } from '@/lib/data/repositories';

export default async function OrdersPage() {
    const shopperOrders = await orders.listShopperOrders();

    return (
        <div className="flex flex-col gap-4 mt-4 md:mt-0">
            {/* Column headers — desktop only.
                Widths mirror OrderRow's desktop grid (72px thumb, 1fr title block,
                100px total, 120px date, ~110px pill, ~28px chevron) so the labels
                land over the correct cells regardless of variable pill text. */}
            <div className="hidden md:grid grid-cols-[72px_minmax(0,1fr)_100px_120px_110px_28px] gap-4 px-4 pt-4 text-[11px] font-semibold tracking-wider uppercase text-text-faint">
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span className="text-center">Total</span>
                <span className="text-center">Order date</span>
                <span className="text-center">Status</span>
                <span aria-hidden="true" />
            </div>

            {shopperOrders.map((order) => (
                <OrderRow
                    key={order.id}
                    order={order}
                    hrefBase="/profile/shopper/orders/"
                    showHandle
                />
            ))}
        </div>
    );
}
