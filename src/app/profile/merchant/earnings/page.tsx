import { Card } from "@/components/ui/card";
import { OrderTable } from "@/components/dashboard/ListingCards";
import { SAMPLE_ORDERS } from "@/lib/data/sample-data";

export default function Earnings() {
    return (
        <section className="flex flex-col gap-6 mt-10">
            <div className="flex gap-5 flex-wrap">
                <Card className="p-5 gap-2 bg-white rounded-2xl shadow-none w-[321px] min-h-67">
                    <h3 className="font-bold text-[24px]">Total Earnings</h3>
                    <p className="font-medium text-[40px]">$162.03</p>
                    <p className="text-[16px]">since YYYY/MM/DD</p>
                </Card>

                <Card className="p-5 gap-2 bg-white rounded-2xl w-[321px] shadow-none min-h-67 flex flex-col">
                    <h3 className="font-bold text-[24px]">Available</h3>
                    <p className="font-medium text-[40px]">$30.75</p>
                    <div>
                        <button className="bg-[#8c2d8b] text-sm px-5 py-2 rounded-2xl text-white">
                            Transfer Funds
                        </button>
                    </div>
                    <p className="text-[16px]">For amounts under $25 contact us to receive your funds</p>
                </Card>

                <Card className="p-5 gap-2 bg-white rounded-2xl w-[321px] min-h-67 shadow-none flex flex-col">
                    <h3 className="font-bold text-[24px]">Pending</h3>
                    <p className="font-medium text-[40px]">$24.25</p>
                    <p className="text-[16px]">from order XYZ</p>
                </Card>
            </div>

            <section className="flex flex-col gap-6 p-5 bg-white rounded-2xl shadow-none border border-[#E5E7EB]">
                <div>
                    <h2 className="text-xl font-bold text-[#111827]">Earning History</h2>
                    <p className="text-[13px] text-[#6B7280] mt-0.5">{SAMPLE_ORDERS.length} orders</p>
                </div>
                <OrderTable orders={SAMPLE_ORDERS} />
            </section>
        </section>
    );
}
