import OrderPlacedIcon from '@/components/dashboard/icons/OrderPlacedIcon';
import ProcessingIcon from '@/components/dashboard/icons/ProcessingIcon';
import ShippedIcon from '@/components/dashboard/icons/ShippedIcon';
import DeliveredIcon from '@/components/dashboard/icons/DeliveredIcon';
import { cn } from '@/lib/utils';

/**
 * OrderStatusStepper
 *
 * 4-step progress indicator for the shopper Order Detail page.
 * Renders Order Placed → Processing → Shipped → Delivered, with each step's
 * icon, label, and sublabel. Steps at or before `currentStep` render as
 * "completed" (filled, per-step accent color); steps after `currentStep`
 * render as "upcoming" (gray outline).
 *
 * Orientation switches at the `md` breakpoint (Tailwind 768px):
 *   - Mobile (< md): vertical — icon left, label/sublabel right, vertical
 *     connector between rows. Matches `figma/5193-5040-mobile-order-detail.png`.
 *   - Desktop (>= md): horizontal — icon centered, label/sublabel below,
 *     horizontal connector between columns.
 *
 * Color tokens for the completed states live inside the icon glyph components
 * themselves (`OrderPlacedIcon`, `ProcessingIcon`, `ShippedIcon`,
 * `DeliveredIcon`) — they accept a `completed` boolean. Connector lines and
 * text colors here use design tokens from A1 (`text-text-primary`,
 * `text-text-muted`, `bg-text-primary`, `bg-border-default`).
 */

export type StepKey = 'OrderPlaced' | 'Processing' | 'Shipped' | 'Delivered';

type StepConfig = {
    key: StepKey;
    label: string;
    sublabel: string;
    Icon: React.ComponentType<{ completed: boolean }>;
};

const STEPS: readonly StepConfig[] = [
    {
        key: 'OrderPlaced',
        label: 'Order Placed',
        sublabel: 'Order has been placed',
        Icon: OrderPlacedIcon,
    },
    {
        key: 'Processing',
        label: 'Processing',
        sublabel: 'Your order is being prepared',
        Icon: ProcessingIcon,
    },
    {
        key: 'Shipped',
        label: 'Shipped',
        sublabel: 'Package is with the carrier',
        Icon: ShippedIcon,
    },
    {
        key: 'Delivered',
        label: 'Delivered',
        sublabel: 'Package has been delivered',
        Icon: DeliveredIcon,
    },
] as const;

const STEP_INDEX: Record<StepKey, number> = {
    OrderPlaced: 0,
    Processing: 1,
    Shipped: 2,
    Delivered: 3,
};

export type OrderStatusStepperProps = {
    currentStep: StepKey;
};

export function OrderStatusStepper({ currentStep }: OrderStatusStepperProps) {
    const currentIndex = STEP_INDEX[currentStep];

    return (
        <>
            {/* Mobile (vertical) — visible below md */}
            <ol className="flex flex-col md:hidden">
                {STEPS.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isLastStep = index === STEPS.length - 1;
                    // Connector below this row is "completed" when the next
                    // step has been reached. The connector is rendered as a
                    // vertical bar in the icon column.
                    const isConnectorCompleted = index < currentIndex;
                    const { Icon } = step;

                    return (
                        <li key={step.key} className="flex gap-4">
                            {/* Icon column — fixed width so labels align */}
                            <div className="flex flex-col items-center">
                                <div className="flex-shrink-0">
                                    <Icon completed={isCompleted} />
                                </div>
                                {!isLastStep && (
                                    <div
                                        className={cn(
                                            'w-[2px] flex-1 min-h-[24px] my-1',
                                            isConnectorCompleted
                                                ? 'bg-text-primary'
                                                : 'bg-border-default',
                                        )}
                                    />
                                )}
                            </div>

                            {/* Label column — text-left, with bottom spacing
                                so consecutive rows don't bunch up */}
                            <div className={cn('flex-1', isLastStep ? '' : 'pb-6')}>
                                <div className="text-[14px] font-semibold text-text-primary">
                                    {step.label}
                                </div>
                                <div className="mt-1 text-[12px] text-text-muted">
                                    {step.sublabel}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>

            {/* Desktop (horizontal) — visible at md and up */}
            <div className="hidden md:block w-full">
                <div className="flex items-start">
                    {STEPS.map((step, index) => {
                        const isCompleted = index <= currentIndex;
                        // Connector between step `index` and `index + 1` is "completed"
                        // (dark) when the next step has also been reached.
                        const isConnectorCompleted = index < currentIndex;
                        const isLastStep = index === STEPS.length - 1;
                        const { Icon } = step;

                        return (
                            <div key={step.key} className="flex flex-1 flex-col items-center">
                                {/* Row 1: icon + connector */}
                                <div className="flex w-full items-center">
                                    {/* Left half-connector (transparent for first step) */}
                                    <div
                                        className={cn(
                                            'h-[2px] flex-1',
                                            index === 0
                                                ? 'bg-transparent'
                                                : isCompleted
                                                  ? 'bg-text-primary'
                                                  : 'bg-border-default',
                                        )}
                                    />
                                    <div className="flex-shrink-0 px-2">
                                        <Icon completed={isCompleted} />
                                    </div>
                                    {/* Right half-connector (transparent for last step) */}
                                    <div
                                        className={cn(
                                            'h-[2px] flex-1',
                                            isLastStep
                                                ? 'bg-transparent'
                                                : isConnectorCompleted
                                                  ? 'bg-text-primary'
                                                  : 'bg-border-default',
                                        )}
                                    />
                                </div>

                                {/* Row 2: label */}
                                <div className="mt-3 text-center text-[14px] font-semibold text-text-primary">
                                    {step.label}
                                </div>

                                {/* Row 3: sublabel */}
                                <div className="mt-1 text-center text-[12px] text-text-muted">
                                    {step.sublabel}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default OrderStatusStepper;
