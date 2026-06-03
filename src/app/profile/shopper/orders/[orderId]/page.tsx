import Link from 'next/link';
import { ChevronRight, CreditCard } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { OrderStatusStepper, type StepKey } from '@/components/dashboard/OrderStatusStepper';
import { StatusPill, type StatusPillVariant } from '@/components/dashboard/StatusPill';
import { orders } from '@/lib/data/repositories';
import type { OrderStatus } from '@/lib/data/types';

/**
 * Shopper Order Detail page — `/profile/shopper/orders/[orderId]`.
 *
 * Renders three cards (matching Figma `5192:4647`):
 *   1. Order header + status pill + OrderStatusStepper
 *   2. Shipment Details (carrier, tracking, shipping address)
 *   3. Order Information (line item table, totals, payment method)
 *
 * Data comes from A2's `orders.getOrderDetail`. The route param is the
 * `orderNumber` (URL-safe, human-friendly). When the order isn't found we
 * render a friendly "Order not found" message inline rather than throwing
 * — Next 16 already covers true 404s separately if needed.
 *
 * The Phase A `<DashboardShell>` (ProfileHeader + DashboardTabs) wraps this
 * page via `src/app/profile/shopper/layout.tsx`; the page itself only
 * renders the content that lives inside `<main>`.
 */

// ─── Status mapping ──────────────────────────────────────────────────────────

/**
 * Maps A2's lifecycle `OrderStatus` to the visual variant rendered by
 * A4's `<StatusPill>`. Mirrors the mapping used in `OrderRow.tsx` so the
 * pill at the top of the detail page matches the pill on the list row.
 */
const ORDER_STATUS_TO_PILL: Record<OrderStatus, StatusPillVariant> = {
    OrderPlaced: 'pending',
    Processing: 'pending',
    Shipped: 'shipped',
    Delivered: 'delivered',
    Returned: 'returned',
};

/**
 * Maps A2's lifecycle `OrderStatus` to A8's stepper step key.
 *
 * The stepper has four progress steps: Order Placed → Processing →
 * Shipped → Delivered. `Returned` is a post-delivery terminal state that
 * doesn't correspond to its own step; we surface it via the StatusPill
 * (which renders the gray "Returned" variant) and treat the stepper as
 * fully advanced through Delivered.
 */
const ORDER_STATUS_TO_STEP: Record<OrderStatus, StepKey> = {
    OrderPlaced: 'OrderPlaced',
    Processing: 'Processing',
    Shipped: 'Shipped',
    Delivered: 'Delivered',
    Returned: 'Delivered',
};

// ─── Formatters ──────────────────────────────────────────────────────────────

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// ─── Card wrapper ────────────────────────────────────────────────────────────

/**
 * Local card wrapper used by all three sections.
 *
 * Uses the design-token border + warm-white surface from A1 instead of
 * the shadcn `Card` default tokens so the styling matches the Figma
 * `5192:4647` exactly (subtle gray border, white background, generous
 * internal padding).
 */
function SectionCard({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`rounded-2xl border border-border-default bg-surface p-4 md:p-8 ${className}`}
        >
            {children}
        </section>
    );
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────

function Breadcrumb({ orderNumber }: { orderNumber: string }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-[14px] text-text-muted">
                <li>
                    <Link
                        href="/profile/shopper/orders"
                        className="hover:text-text-primary transition-colors"
                    >
                        Your Orders
                    </Link>
                </li>
                <li aria-hidden="true" className="flex items-center">
                    <ChevronRight className="w-4 h-4" />
                </li>
                <li aria-current="page" className="text-text-muted">
                    Order #{orderNumber}
                </li>
            </ol>
        </nav>
    );
}

// ─── Not-found state ─────────────────────────────────────────────────────────

function OrderNotFound({ orderNumber }: { orderNumber: string }) {
    return (
        <>
            <Breadcrumb orderNumber={orderNumber} />
            <SectionCard>
                <div className="py-8 text-center">
                    <h1 className="text-[20px] font-semibold text-text-primary">
                        Order not found
                    </h1>
                    <p className="mt-2 text-[14px] text-text-muted">
                        We couldn&apos;t find an order matching{' '}
                        <span className="text-text-primary">#{orderNumber}</span>.
                    </p>
                    <Link
                        href="/profile/shopper/orders"
                        className="mt-6 inline-block text-[14px] text-brand-magenta hover:underline"
                    >
                        Back to Your Orders
                    </Link>
                </div>
            </SectionCard>
        </>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const { orderId } = await params;
    const order = await orders.getOrderDetail(orderId);

    if (!order) {
        return <OrderNotFound orderNumber={orderId} />;
    }

    const pillVariant = ORDER_STATUS_TO_PILL[order.status];
    const stepKey = ORDER_STATUS_TO_STEP[order.status];
    const totalAmount = order.lineItems.reduce(
        (sum, { quantity, unitPrice }) => sum + quantity * unitPrice,
        0,
    );

    return (
        <div className="flex flex-col gap-4 md:gap-6">
            <Breadcrumb orderNumber={order.orderNumber} />

            {/* ─── Card 1: Order header + stepper ─────────────────────────── */}
            <SectionCard>
                <h1 className="text-[20px] font-semibold text-text-primary">
                    Order #{order.orderNumber}
                </h1>
                <div className="mt-3">
                    <StatusPill variant={pillVariant} />
                </div>
                <div className="mt-6 md:mt-8">
                    <OrderStatusStepper currentStep={stepKey} />
                </div>
            </SectionCard>

            {/* ─── Card 2: Shipment Details ───────────────────────────────── */}
            <SectionCard>
                <h2 className="text-[20px] font-semibold text-text-primary">
                    Shipment Details
                </h2>

                <dl className="mt-4 space-y-1 text-[14px]">
                    <div className="flex gap-2">
                        <dt className="text-text-muted">Carrier:</dt>
                        <dd className="text-text-primary">{order.shippingCarrier}</dd>
                    </div>
                    <div className="flex gap-2">
                        <dt className="text-text-muted">Tracking Number:</dt>
                        <dd className="text-text-muted">{order.trackingNumber}</dd>
                    </div>
                </dl>

                <div className="mt-6 border-t border-border-default pt-6">
                    <h3 className="text-[16px] font-semibold text-text-primary">
                        Shipping Address
                    </h3>
                    <address className="mt-2 not-italic text-[14px]">
                        <p className="text-text-primary">{order.shippingAddress.name}</p>
                        <p className="text-text-muted">{order.shippingAddress.street}</p>
                        <p className="text-text-muted">
                            {order.shippingAddress.cityStateZip}
                        </p>
                    </address>
                </div>
            </SectionCard>

            {/* ─── Card 3: Order Information ──────────────────────────────── */}
            <SectionCard>
                <h2 className="text-[20px] font-semibold text-text-primary">
                    Order Information
                </h2>

                {/* Desktop: shadcn <Table>. Hidden on mobile. */}
                <div className="mt-4 hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border-default hover:bg-transparent">
                                <TableHead className="text-[13px] text-text-muted font-medium">
                                    Product
                                </TableHead>
                                <TableHead className="text-[13px] text-text-muted font-medium">
                                    SKU
                                </TableHead>
                                <TableHead className="text-[13px] text-text-muted font-medium text-center">
                                    Quantity
                                </TableHead>
                                <TableHead className="text-[13px] text-text-muted font-medium text-right">
                                    Unit Price
                                </TableHead>
                                <TableHead className="text-[13px] text-text-muted font-medium text-right">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.lineItems.map((item) => (
                                <TableRow
                                    key={item.sku}
                                    className="border-border-subtle hover:bg-transparent"
                                >
                                    <TableCell className="text-[14px] text-text-primary py-3">
                                        {item.product}
                                    </TableCell>
                                    <TableCell className="text-[14px] text-text-muted py-3">
                                        {item.sku}
                                    </TableCell>
                                    <TableCell className="text-[14px] text-text-primary text-center py-3">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-[14px] text-text-primary text-right py-3">
                                        {currencyFormatter.format(item.unitPrice)}
                                    </TableCell>
                                    <TableCell className="text-[14px] text-text-primary text-right py-3">
                                        {currencyFormatter.format(
                                            item.quantity * item.unitPrice,
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile: stacked line items per the mobile Figma. */}
                <ul className="mt-4 md:hidden divide-y divide-border-default border-b border-border-default">
                    {order.lineItems.map((item) => (
                        <li key={item.sku} className="py-4">
                            <div className="flex justify-between items-start gap-3">
                                <p className="text-[14px] font-medium text-text-primary">
                                    {item.product}
                                </p>
                                <p className="text-[14px] font-medium text-text-primary whitespace-nowrap">
                                    {currencyFormatter.format(item.quantity * item.unitPrice)}
                                </p>
                            </div>
                            <p className="mt-1 text-[12px] text-text-muted">
                                SKU: {item.sku}
                            </p>
                            <div className="mt-1 flex justify-between text-[12px] text-text-muted">
                                <span>Qty: {item.quantity}</span>
                                <span>
                                    Unit: {currencyFormatter.format(item.unitPrice)}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Totals / order date / payment method */}
                <dl className="mt-4 space-y-3 text-[14px]">
                    <div className="flex justify-between">
                        <dt className="font-semibold text-text-primary">Total Amount:</dt>
                        <dd className="font-semibold text-text-primary">
                            {currencyFormatter.format(totalAmount)}
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-text-muted">Order Date:</dt>
                        <dd className="text-text-muted">{order.orderDate}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                        <dt className="text-text-muted">Payment Method:</dt>
                        <dd className="flex items-center gap-2 text-text-muted">
                            <CreditCard
                                className="w-4 h-4 text-text-primary"
                                aria-hidden="true"
                            />
                            <span>xxx-{order.paymentMethodLast4}</span>
                        </dd>
                    </div>
                </dl>
            </SectionCard>
        </div>
    );
}
