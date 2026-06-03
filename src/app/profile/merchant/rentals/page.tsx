import { OrderRow } from '@/components/dashboard/OrderRow';
import { rentals } from '@/lib/data/repositories';

/**
 * Merchant Active Rentals page.
 *
 * Renders inside the merchant `<DashboardShell>` (profile header + tabs are
 * applied by `src/app/profile/merchant/layout.tsx`). The page itself owns
 * only the card surface, the column headers, and the list of rows.
 *
 * Visual target: `docs/dashboard/figma/4570-3591-active-rentals.png`.
 */
export default async function RentalsPage() {
    const activeRentals = await rentals.listActive();
    const count = activeRentals.length;

    return (
        <section className="mt-10 rounded-2xl border border-border-default bg-surface p-5">
            {/* Card header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-text-primary">
                    Active Rentals
                </h2>
                <p className="mt-0.5 text-[13px] text-text-muted">
                    {count} {count === 1 ? 'order' : 'orders'}
                </p>
            </div>

            {count === 0 ? (
                <p className="py-12 text-center text-[14px] text-text-muted">
                    No active rentals
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {/* Column headers — desktop only.
                        Widths mirror OrderRow's desktop grid
                        (72px thumb, 1fr title block, 100px total, 120px date,
                        ~110px pill, ~28px chevron) so the labels land over the
                        correct cells. */}
                    <div className="hidden md:grid grid-cols-[72px_minmax(0,1fr)_100px_120px_110px_28px] gap-4 px-4 text-[11px] font-semibold tracking-wider uppercase text-text-faint">
                        <span aria-hidden="true" />
                        <span>Order</span>
                        <span className="text-center">Total</span>
                        <span className="text-center">Due date</span>
                        <span className="text-center">Status</span>
                        <span aria-hidden="true" />
                    </div>

                    {activeRentals.map((rental) => (
                        <OrderRow
                            key={rental.id}
                            rental={rental}
                            hrefBase="/profile/merchant/rentals/"
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
