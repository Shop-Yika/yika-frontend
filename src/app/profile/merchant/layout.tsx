import {ReactNode} from 'react';
import Tabs from '@/components/dashboard/tabs';

export default function MerchantLayout({children}: {children: ReactNode}) {
    return (
        <>
            <Tabs mode="merchant" />
            <div>{children}</div>
        </>
    );
}
