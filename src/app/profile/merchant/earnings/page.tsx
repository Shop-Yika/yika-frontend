"use client";
import {Card} from "@/components/ui/card";

import { OrderTable, type OrderItem } from "@/components/dashboard/ListingCards";

// Hardcoded sample data — swap out for API data later
const SAMPLE_ORDERS: OrderItem[] = [
    {
        id: "o1",
        orderNumber: "YK-2026-001",
        itemCount: 2,
        renterName: "Maya Chen",
        total: 55,
        dueDate: "Mar 10, 2026",
        status: "live",
        imageUrls: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80",
        ],
        href: "#", // TODO: replace with real order detail route e.g. `/dashboard/orders/o1`
    },
    {
        id: "o2",
        orderNumber: "YK-2026-002",
        itemCount: 1,
        renterName: "Sophia Rodriguez",
        total: 110,
        dueDate: "Mar 10, 2026",
        status: "pending",
        imageUrls: [
            "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80",
        ],
        href: "#",
    },
    {
        id: "o3",
        orderNumber: "YK-2026-004",
        itemCount: 1,
        renterName: "Addie Johnson",
        total: 120,
        dueDate: "Mar 10, 2026",
        status: "rented",
        imageUrls: [
            "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=200&q=80",
        ],
        href: "#",
    },
    {
        id: "o4",
        orderNumber: "YK-2026-005",
        itemCount: 1,
        renterName: "Maryanne Zaheer",
        total: 55,
        dueDate: "Mar 10, 2026",
        status: "returned",
        imageUrls: [
            "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=200&q=80",
        ],
        href: "#",
    },
];


export default function Earnings() {
    return (
        <section className="flex flex-col gap-6  mt-10">
            {/*header & button*/}
            <div className="flex gap-5">

                {/*Total earnings*/}
                <Card className="p-5 gap-2 bg-white rounded-2xl shadow-none w-[321px] min-h-67">
                    <h1 className="font-bold text-[24px]" >Total earnings</h1>
                    <p className="font-medium text-[40px]">$162.03</p>
                    <p className="text-[16px]">since YYYY/MM/DD</p>
                </Card>

                {/*Available*/}
                <Card className="p-5 gap-2 bg-white rounded-2xl w-[321px] shadow-none min-h-67  flex flex-col">
                    <h1 className="font-bold text-[24px]" >Available</h1>
                    <p className="font-medium text-[40px]">$30.75</p>
                    <div>

                    <button  className="bg-[#8c2d8b] text-sm px-5 py-2 rounded-2xl text-white" >
                        Transfer Fund
                    </button>
                    </div>
                    <p className="text-[16px]">For amount under $25 contact us to receive your fund</p>
                </Card>

                {/*Pending*/}
                <Card className="p-5 gap-2 bg-white rounded-2xl w-[321px] min-h-67 shadow-none flex flex-col">
                    <h1 className="font-bold text-[24px]" >Total earnings</h1>
                    <p className="font-medium text-[40px]">$24.25</p>
                    <p className="text-[16px]">from order XYZ</p>
                </Card>


            </div>

            {/*  Listing Table */}

            <section className="flex flex-col gap-6 p-5 bg-white rounded-2xl shadow-none border border-[#E5E7EB]">

                {/* Header */}
                <div>
                    <h2 className="text-xl font-bold text-[#111827]">Earning History</h2>
                    <p className="text-[13px] text-[#6B7280] mt-0.5">{SAMPLE_ORDERS.length} orders</p>
                </div>

                {/* Order table with column headers + rows */}
                <OrderTable orders={SAMPLE_ORDERS} />
            </section>

        </section>
    );
}
