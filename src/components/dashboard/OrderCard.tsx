import Image from 'next/image';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

export type OrderStatus = 'Shipped' | 'Delivered';

export type OrderCardProps = {
    alt: string;
    image: string;
    id: string;
    items: number;
    user: string;
    total: string;
    date: string;
    status: OrderStatus;
};

export default function OrderCard({alt, image, id, items, user, total, date, status}: OrderCardProps) {
    return (
        <div className="grid grid-cols-subgrid md:col-span-6 justify-items-center md:justify-items-start items-center gap-y-4 border border-[#E4E4E7] rounded-lg p-6">
            <Image
                alt={alt}
                src={image}
                width={64}
                height={64}
                className="object-cover min-w-16"
            />
            <div>
                <p className="font-medium text-[1.25rem]">Order #{id}</p>
                <p className="text-center md:text-left text-[#717182]">
                    {items} items from <span className="text-[#8C2D8B]">@{user}</span>
                </p>
            </div>
            <div className="justify-self-center text-center">
                <p className="md:hidden font-bold text-[#717182]">Total</p>
                <p className="text-[#0A0A0A]">${total}</p>
            </div>
            <div className="justify-self-center text-center">
                <p className="md:hidden font-bold text-[#717182]">Order date</p>
                <p className="text-[#0A0A0A]">{date}</p>
            </div>
            <div className="flex items-center gap-x-8 md:contents">
                <StatusBadge status={status} />
                <Link
                    href={`/profile/shopper/orders/${id}`}
                    className="justify-self-end"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 8 21"
                        width="8"
                        height="21"
                        fill="none"
                    >
                        <path
                            d="M0.5 0.5L6.5 9.95455L0.5 20.5"
                            stroke="#717182"
                            strokeLinecap="round"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
