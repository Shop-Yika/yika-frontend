import { OrderTable } from "@/components/dashboard/ListingCards";
import { SAMPLE_ORDERS } from "@/lib/data/sample-data";

export default function Rentals() {
    return (
        <section className="flex flex-col gap-6 p-5 bg-white rounded-2xl shadow-none mt-10 border border-[#E5E7EB]">
            <div>
                <h2 className="text-xl font-bold text-[#111827]">Active Rentals</h2>
                <p className="text-[13px] text-[#6B7280] mt-0.5">{SAMPLE_ORDERS.length} orders</p>
            </div>
            <OrderTable orders={SAMPLE_ORDERS} />
        </section>
    );
}
