import {ReactNode} from 'react';
import Tabs from '@/components/dashboard/tabs';
import RentalRequest from "@/components/dashboard/RentalRequest";

export default function MerchantLayout({children}: {children: ReactNode}) {
    return (
        <>
            <Tabs mode="merchant" />
            <div
            >{children}</div>
        </>
    );
}
