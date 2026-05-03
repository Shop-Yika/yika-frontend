import {ComponentType} from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/dashboard/StatusBadge';
import OrderPlacedIcon from '@/components/dashboard/icons/OrderPlacedIcon';
import ProcessingIcon from '@/components/dashboard/icons/ProcessingIcon';
import ShippedIcon from '@/components/dashboard/icons/ShippedIcon';
import DeliveredIcon from '@/components/dashboard/icons/DeliveredIcon';
import type {OrderStatus} from '@/components/dashboard/OrderCard';

type Step = {
    Icon: ComponentType<{completed: boolean}>;
    label: string;
    desc: string;
};

type OrderItem = {
    product: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    status: OrderStatus;
};

const steps: Step[] = [
    {
        Icon: OrderPlacedIcon,
        label: 'Order Placed',
        desc: 'Order has been placed',
    },
    {
        Icon: ProcessingIcon,
        label: 'Processing',
        desc: 'Your order is being prepared',
    },
    {
        Icon: ShippedIcon,
        label: 'Shipped',
        desc: 'Package is with the carrier',
    },
    {
        Icon: DeliveredIcon,
        label: 'Delivered',
        desc: 'Package has been delivered',
    },
];

const orderItems: OrderItem[] = [
    {
        product: 'Ray Bans Sunglasses',
        sku: 'HSP-500-25',
        quantity: 10,
        unitPrice: 125,
        status: 'Shipped',
    },
    {
        product: 'Lululemon Sweatpants',
        sku: 'FAF-300-15',
        quantity: 2,
        unitPrice: 89.5,
        status: 'Delivered',
    },
    {
        product: 'Navy Cocktail Dress',
        sku: 'IC-750-40',
        quantity: 3,
        unitPrice: 73.25,
        status: 'Shipped',
    },
];

export default async function OrderDetailsPage({params}: {params: Promise<{orderId: string}>}) {
    const {orderId} = await params;
    const currentStep = 3;
    const progressWidth = currentStep === steps.length ? 100 : ((currentStep - 0.5) / steps.length) * 100;
    const formatter = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    });

    return (
        <>
            <nav
                aria-label="Breadcrumb"
                className="mt-11 mb-7.5"
            >
                <ol className="flex items-center gap-3.5 text-[0.875rem] text-[#667085]">
                    <li>
                        <Link href="/profile/shopper/orders">Your Orders</Link>
                    </li>
                    <li aria-hidden="true">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="none"
                            width="16"
                            height="16"
                        >
                            <g>
                                <path
                                    d="M6 4L10 8L6 12"
                                    stroke="#667085"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                        </svg>
                    </li>
                    <li aria-current="page">Order #{orderId}</li>
                </ol>
            </nav>

            <section className="border border-black rounded-[10px] py-6 px-8 mb-7.5">
                <h2 className="font-bold text-[1.25rem] text-[#0A0A0A]">Order #{orderId}</h2>
                <div className="my-4">
                    <StatusBadge status="Shipped" />
                </div>
                <div className="relative">
                    <div
                        aria-hidden="true"
                        className="absolute w-full h-0.5 top-4.5 -z-1 bg-[#E5E7EB]"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute w-full h-0.5 top-4.5 -z-1 bg-black"
                        style={{width: `${progressWidth}%`}}
                    />
                    <div
                        role="progressbar"
                        aria-valuemin={1}
                        aria-valuenow={currentStep}
                        aria-valuemax={steps.length}
                        className="sr-only"
                    >
                        Step {currentStep} of {steps.length}
                    </div>
                    <ul className="grid grid-cols-4 gap-4 text-center">
                        {steps.map((step, index) => {
                            const Icon = step.Icon;
                            return (
                                <li
                                    key={step.label}
                                    className="flex flex-col items-center gap-y-3"
                                >
                                    <Icon completed={index < currentStep} />
                                    <p>{step.label}</p>
                                    <p className="text-[.75rem] text-[#717182]">{step.desc}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>

            <section className="border border-black rounded-[10px] py-6 px-8 mb-7.5">
                <h2 className="font-bold text-[1.25rem] text-[#0A0A0A] mb-1">Shipment Details</h2>
                <dl className="text-[0.875rem] text-[#717182] mb-6">
                    <div className="flex gap-1 mb-1">
                        <dt>Carrier:</dt>
                        <dd className="text-[#0A0A0A]">Fedex</dd>
                    </div>
                    <div className="flex gap-1">
                        <dt>Tracking Number:</dt>
                        <dd>1234 1234 1234 1234</dd>
                    </div>
                </dl>
                <h3 className="font-bold text-[#0A0A0A] mb-1">Shipping Address</h3>
                <address className="not-italic text-[0.875rem] text-[#717182]">
                    <p className="text-[1rem] text-[#0A0A0A]">Full Name</p>
                    <p className="my-1">1234 Agricultural Drive</p>
                    <p>Des Moines, IA 50309</p>
                </address>
            </section>

            <section className="border border-black rounded-[10px] py-6 px-8">
                <h2 className="font-bold text-[1.25rem] text-[#0A0A0A] mb-4">Order Information</h2>
                <table className="w-full text-[0.875rem] text-[#0A0A0A]">
                    <thead>
                        <tr className="border-b border-black/10">
                            <th
                                scope="col"
                                className="font-medium text-left p-2"
                            >
                                Product
                            </th>
                            <th
                                scope="col"
                                className="font-medium text-center p-2"
                            >
                                SKU
                            </th>
                            <th
                                scope="col"
                                className="font-medium text-center p-2"
                            >
                                Quantity
                            </th>
                            <th
                                scope="col"
                                className="font-medium text-center p-2"
                            >
                                Unit Price
                            </th>
                            <th
                                scope="col"
                                className="font-medium text-center p-2"
                            >
                                Total
                            </th>
                            <th
                                scope="col"
                                className="font-medium text-center p-2"
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {orderItems.map(({product, sku, quantity, unitPrice, status}) => {
                            const total = quantity * unitPrice;
                            return (
                                <tr
                                    key={sku}
                                    className="border-b border-black/10"
                                >
                                    <th
                                        scope="row"
                                        className="font-normal text-left p-2"
                                    >
                                        {product}
                                    </th>
                                    <td className="text-[#717182] p-2">{sku}</td>
                                    <td className="p-2">{quantity}</td>
                                    <td className="p-2">{formatter.format(unitPrice)}</td>
                                    <td className="p-2">{formatter.format(total)}</td>
                                    <td className="p-2">
                                        {status === 'Delivered' ? (
                                            <button className="bg-[#8C2D8B] text-white font-medium rounded-sm cursor-pointer px-6 py-1.5">
                                                Return
                                            </button>
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <dl className="mt-3">
                    <div className="flex justify-between">
                        <dt className="font-bold">Total Amount:</dt>
                        <dd>$2,847.50</dd>
                    </div>
                    <div className="flex justify-between mt-4 mb-3">
                        <dt className="text-[#717182]">Order Date:</dt>
                        <dd>November 19, 2025</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-[#717182]">Payment Method:</dt>
                        <dd className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="none"
                                width="16"
                                height="16"
                                aria-hidden="true"
                            >
                                <path
                                    d="M13.332 3.33398H2.66536C1.92898 3.33398 1.33203 3.93094 1.33203 4.66732V11.334C1.33203 12.0704 1.92898 12.6673 2.66536 12.6673H13.332C14.0684 12.6673 14.6654 12.0704 14.6654 11.334V4.66732C14.6654 3.93094 14.0684 3.33398 13.332 3.33398Z"
                                    stroke="#0A0A0A"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M1.33203 6.66602H14.6654"
                                    stroke="#0A0A0A"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span>xxx-1234</span>
                        </dd>
                    </div>
                </dl>
            </section>
        </>
    );
}
