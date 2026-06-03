import type { ReactNode } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { DashboardTabs } from './DashboardTabs';

export type DashboardShellProps = {
    mode: 'shopper' | 'merchant';
    children: ReactNode;
};

/**
 * Outer wrapper for every dashboard page.
 *
 * Composes:
 *   <ProfileHeader />   – greeting + mode-switch link
 *   <DashboardTabs />   – tab navigation row
 *   <main>{children}</main> – the page-specific content
 *
 * Provides the canonical container sizing (`max-w-5xl mx-auto`) so individual
 * pages don't have to reimplement layout boilerplate. Padding is tighter on
 * mobile (`px-4 py-6`) and opens up at the `md` breakpoint (`md:px-8 md:py-12`)
 * so iPhone-width screens (375px) don't waste horizontal real estate.
 */
export function DashboardShell({ mode, children }: DashboardShellProps) {
    return (
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-12">
            <ProfileHeader mode={mode} />
            <DashboardTabs mode={mode} />
            <main>{children}</main>
        </div>
    );
}

export default DashboardShell;
