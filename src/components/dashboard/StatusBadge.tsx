import type {OrderStatus} from './OrderCard';

type StatusStyle = {
    border: string;
    dot: string;
    bg: string;
};

const statusStyles: Record<OrderStatus, StatusStyle> = {
    Shipped: {
        border: 'border-[#8C2D8B]',
        dot: 'bg-[#8C2D8B]',
        bg: 'bg-[#F5DBEA]',
    },
    Delivered: {
        border: 'border-[#414E32]',
        dot: 'bg-[#414E32]',
        bg: 'bg-[#F8FAE8]',
    },
};

export default function StatusBadge({status}: {status: OrderStatus}) {
    const styles = statusStyles[status];

    return (
        <div className={`flex items-center gap-2.5 border rounded-4xl w-fit px-2.5 py-1 ${styles.border} ${styles.bg}`}>
            <span
                aria-hidden="true"
                className={`block w-3.5 h-3.5 rounded-full ${styles.dot}`}
            />
            <p className="text-[#23250B]">{status}</p>
        </div>
    );
}
