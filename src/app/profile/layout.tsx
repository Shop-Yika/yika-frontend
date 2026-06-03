import { ReactNode } from 'react';

/**
 * Passthrough layout for /profile/*.
 *
 * The header + tabs are owned by <DashboardShell>, which is applied inside
 * the mode-specific layouts (`/profile/shopper/layout.tsx` and
 * `/profile/merchant/layout.tsx`). They know the active mode; this outer
 * layout doesn't.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
