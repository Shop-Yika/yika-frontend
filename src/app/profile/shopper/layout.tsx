import { ReactNode } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function ShopperLayout({ children }: { children: ReactNode }) {
    return <DashboardShell mode="shopper">{children}</DashboardShell>;
}
