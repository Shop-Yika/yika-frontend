import { ReactNode } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function MerchantLayout({ children }: { children: ReactNode }) {
    return <DashboardShell mode="merchant">{children}</DashboardShell>;
}
