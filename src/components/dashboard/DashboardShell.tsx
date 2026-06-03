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
 * Provides the canonical container sizing (`max-w-5xl mx-auto px-8 py-12`)
 * so individual pages don't have to reimplement layout boilerplate.
 */
export function DashboardShell({ mode, children }: DashboardShellProps) {
    return (
        <div className="max-w-5xl mx-auto px-8 py-12">
            <ProfileHeader mode={mode} />
            <DashboardTabs mode={mode} />
            <main>{children}</main>
        </div>
    );
}

export default DashboardShell;
