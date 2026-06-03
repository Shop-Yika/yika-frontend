import {ComponentType} from 'react';
import Link from 'next/link';
import {StatusPill} from '@/components/dashboard/StatusPill';
import OrderPlacedIcon from '@/components/dashboard/icons/OrderPlacedIcon';
import ProcessingIcon from '@/components/dashboard/icons/ProcessingIcon';
import ShippedIcon from '@/components/dashboard/icons/ShippedIcon';
import DeliveredIcon from '@/components/dashboard/icons/DeliveredIcon';
import type {ShopperOrderStatus} from '@/components/dashboard/ListingCards';

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
    status: ShopperOrderStatus;
};

const steps: Step[] = [
    {Icon: OrderPlacedIcon, label: 'Order Placed',  desc: 'Order has been placed'},
    {Icon: ProcessingIcon,  label: 'Processing',     desc: 'Your order is being prepared'},
    {Icon: ShippedIcon,     label: 'Shipped',        desc: 'Package is with the carrier'},
    {Icon: DeliveredIcon,   label: 'Delivered',      desc: 'Package has been delivered'},
];

const orderItems: OrderItem[] = [
    {product: 'Ray Bans Sunglasses',  sku: 'HSP-500-25', quantity: 10, unitPrice: 125,   status: 'Shipped'},
    {product: 'Lululemon Sweatpants', sku: 'FAF-300-15', quantity: 2,  unitPrice: 89.5,  status: 'Delivered'},
    {product: 'Navy Cocktail Dress',  sku: 'IC-750-40',  quantity: 3,  unitPrice: 73.25, status: 'Shipped'},
];

export default async function OrderDetailsPage({params}: {params: Promise<{orderId: string}>}) {
    const {orderId} = await params;
    const currentStep = 3;
    const progressWidth = currentStep === steps.length ? 100 : ((currentStep - 0.5) / steps.length) * 100;
    const progressHeight = (currentStep - 1) * 33;
    const formatter = new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'});
    const totalAmount = orderItems.reduce((sum, {quantity, unitPrice}) => sum + quantity * unitPrice, 0);

    return (
        <>
            <nav aria-label="Breadcrumb" className="mt-4 md:mt-11 mb-4 md:mb-7.5">
                <ol className="flex items-center gap-3.5 text-[0.875rem] text-[#667085]">
                    <li>
                        <Link href="/profile/shopper/orders">Your Orders</Link>
                    </li>
                    <li aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                            <path d="M6 4L10 8L6 12" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </li>
                    <li aria-current="page">Order #{orderId}</li>
                </ol>
            </nav>

            {/* Order status */}
            <section className="border border-[#E5E7EB] rounded-xl py-6 px-4 md:px-8 mb-4 md:mb-7.5">
                <h2 className="font-bold text-[1.25rem] text-[#111827]">Order #{orderId}</h2>
                <div className="my-4">
                    <StatusPill variant="shipped" />
                </div>

                <div className="relative">
                    {/* Desktop: horizontal progress bar */}
                    <div aria-hidden="true" className="hidden md:block absolute w-full h-0.5 top-4.5 -z-1 bg-[#E5E7EB]" />
                    <div aria-hidden="true" className="hidden md:block absolute h-0.5 top-4.5 -z-1 bg-[#111827]" style={{width: `${progressWidth}%`}} />

                    <div
                        role="progressbar"
                        aria-valuemin={1}
                        aria-valuenow={currentStep}
                        aria-valuemax={steps.length}
                        className="sr-only"
                    >
                        Step {currentStep} of {steps.length}
                    </div>

                    {/* Mobile: vertical timeline */}
                    <div aria-hidden="true" className="md:hidden absolute left-6 top-px bottom-0 w-0.5 bg-[#E5E7EB]" />
                    <div aria-hidden="true" className="md:hidden absolute left-6 top-px w-0.5 bg-[#111827]" style={{height: `${progressHeight}%`}} />

                    <ul className="flex flex-col gap-15 md:grid md:grid-cols-4 md:gap-4 md:text-center mt-10 md:mt-0">
                        {steps.map((step, index) => {
                            const Icon = step.Icon;
                            return (
                                <li key={step.label} className="flex items-center gap-4 md:flex-col md:items-center md:gap-y-3">
                                    <div className="relative z-10 shrink-0">
                                        <Icon completed={index < currentStep} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#111827]">{step.label}</p>
                                        <p className="text-[.75rem] text-[#6B7280]">{step.desc}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>

            {/* Shipment details */}
            <section className="border border-[#E5E7EB] rounded-xl py-6 px-4 md:px-8 mb-4 md:mb-7.5">
                <h2 className="font-bold text-[1.25rem] text-[#111827] mb-1">Shipment Details</h2>
                <dl className="text-[0.875rem] text-[#6B7280] border-b border-[#E5E7EB] pb-4 mb-4">
                    <div className="flex gap-1 mb-1">
                        <dt>Carrier:</dt>
                        <dd className="text-[#111827]">FedEx</dd>
                    </div>
                    <div className="flex gap-1">
                        <dt>Tracking Number:</dt>
                        <dd>1234 1234 1234 1234</dd>
                    </div>
                </dl>
                <h3 className="font-bold text-[#111827] mb-1">Shipping Address</h3>
                <address className="not-italic text-[0.875rem] text-[#6B7280]">
                    <p className="text-[1rem] text-[#111827]">Full Name</p>
                    <p className="my-1">1234 Agricultural Drive</p>
                    <p>Des Moines, IA 50309</p>
                </address>
            </section>

            {/* Order information */}
            <section className="border border-[#E5E7EB] rounded-xl py-6 px-4 md:px-8">
                <h2 className="font-bold text-[1.25rem] text-[#111827] mb-4">Order Information</h2>

                {/* Mobile: stacked card per item */}
                <div className="md:hidden divide-y divide-[#E5E7EB] border-b border-[#E5E7EB]">
                    {orderItems.map(({product, sku, quantity, unitPrice, status}) => (
                        <div key={sku} className="py-4">
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-medium text-[#111827] text-[0.875rem]">{product}</p>
                                <p className="font-medium text-[#111827] text-[0.875rem]">{formatter.format(quantity * unitPrice)}</p>
                            </div>
                            <p className="text-[0.75rem] text-[#6B7280] mb-1">SKU: {sku}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-[0.75rem] text-[#6B7280]">Qty: {quantity}</p>
                                <p className="text-[0.75rem] text-[#6B7280]">Unit: {formatter.format(unitPrice)}</p>
                            </div>
                            {status === 'Delivered' && (
                                <div className="mt-3">
                                    <button className="bg-[#8C2D8B] text-white text-[0.875rem] font-medium rounded-sm cursor-pointer px-6 py-1.5">
                                        Return
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop: full table */}
                <table className="hidden md:table w-full text-[0.875rem] text-[#111827]">
                    <thead>
                        <tr className="border-b border-[#E5E7EB]">
                            <th scope="col" className="font-medium text-left p-2">Product</th>
                            <th scope="col" className="font-medium text-center p-2">SKU</th>
                            <th scope="col" className="font-medium text-center p-2">Quantity</th>
                            <th scope="col" className="font-medium text-center p-2">Unit Price</th>
                            <th scope="col" className="font-medium text-center p-2">Total</th>
                            <th scope="col" className="font-medium text-center p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {orderItems.map(({product, sku, quantity, unitPrice, status}) => (
                            <tr key={sku} className="border-b border-[#E5E7EB]">
                                <th scope="row" className="font-normal text-left p-2">{product}</th>
                                <td className="text-[#6B7280] p-2">{sku}</td>
                                <td className="p-2">{quantity}</td>
                                <td className="p-2">{formatter.format(unitPrice)}</td>
                                <td className="p-2">{formatter.format(quantity * unitPrice)}</td>
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
                        ))}
                    </tbody>
                </table>

                <dl className="mt-4">
                    <div className="flex justify-between border-t md:border-t-0 border-[#E5E7EB] pt-3 md:pt-0">
                        <dt className="font-bold text-[#111827]">Total Amount:</dt>
                        <dd className="font-bold text-[#111827]">{formatter.format(totalAmount)}</dd>
                    </div>
                    <div className="flex justify-between border-t md:border-t-0 border-[#E5E7EB] pt-4 md:pt-0 mt-4 mb-3">
                        <dt className="text-[#6B7280]">Order Date:</dt>
                        <dd>November 19, 2025</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-[#6B7280]">Payment Method:</dt>
                        <dd className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
                                <path d="M13.332 3.33398H2.66536C1.92898 3.33398 1.33203 3.93094 1.33203 4.66732V11.334C1.33203 12.0704 1.92898 12.6673 2.66536 12.6673H13.332C14.0684 12.6673 14.6654 12.0704 14.6654 11.334V4.66732C14.6654 3.93094 14.0684 3.33398 13.332 3.33398Z" stroke="#111827" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M1.33203 6.66602H14.6654" stroke="#111827" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>xxx-1234</span>
                        </dd>
                    </div>
                </dl>
            </section>
        </>
    );
}
