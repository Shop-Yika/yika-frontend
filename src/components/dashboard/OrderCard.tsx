import Image from 'next/image';
import Link from 'next/link';
import StatusBadge from './StatusBadge';
import type { OrderItem } from './ListingCards';

export default function OrderCard({item}: {item: OrderItem}) {
    const {orderNumber, itemCount, sellerHandle, total, orderDate, shopperStatus, imageUrls} = item;

    return (
        <div className="grid grid-cols-subgrid md:col-span-6 justify-items-center md:justify-items-start items-center gap-y-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
            <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-2xl overflow-hidden bg-[#F9FAFB]">
                <Image
                    alt=""
                    src={imageUrls[0]}
                    fill
                    className="object-cover"
                />
            </div>
            <div>
                <p className="font-semibold text-[20px] text-[#111827]">Order #{orderNumber}</p>
                <p className="text-center md:text-left text-[16px] text-[#6B7280]">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} from <span className="text-[#8C2D8B]">@{sellerHandle}</span>
                </p>
            </div>
            <div className="justify-self-center text-center">
                <p className="md:hidden text-[11px] font-semibold tracking-wider uppercase text-[#9CA3AF]">Total</p>
                <p className="text-[14px] font-medium text-[#111827]">${total.toFixed(2)}</p>
            </div>
            <div className="justify-self-center text-center">
                <p className="md:hidden text-[11px] font-semibold tracking-wider uppercase text-[#9CA3AF]">Order date</p>
                <p className="text-[14px] text-[#6B7280]">{orderDate}</p>
            </div>
            <div className="flex items-center gap-x-8 md:contents">
                <StatusBadge status={shopperStatus} type="shopper" />
                <Link
                    href={`/profile/shopper/orders/${orderNumber}`}
                    className="justify-self-end"
                    aria-label={`View order ${orderNumber}`}
                >
                    <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 8 21"
                        className="w-2 h-5"
                        fill="none"
                    >
                        <path
                            d="M0.5 0.5L6.5 9.95455L0.5 20.5"
                            stroke="#9CA3AF"
                            strokeLinecap="round"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
