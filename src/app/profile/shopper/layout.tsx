import {ReactNode} from 'react';
import Tabs from '@/components/dashboard/tabs';

export default function ShopperLayout({children}: {children: ReactNode}) {
    return (
        <>
            <Tabs mode="shopper" />
            <div>{children}</div>
        </>
    );
}
