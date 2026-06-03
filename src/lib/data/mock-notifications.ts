/**
 * Mock notifications for the bell-icon Notifications drawer.
 *
 * Coverage requirement (issue A2):
 *   - At least 5 entries
 *   - Mix of read / unread
 *   - Variety of timestamps
 */

import type { Notification } from './types';

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'n1',
        title: 'Yika',
        body: 'Your rental of the Silk Midi Dress has shipped — tracking is now available.',
        timestamp: '1m ago',
        read: false,
    },
    {
        id: 'n2',
        title: 'Yika',
        body: 'Maya Chen requested to rent your Oversized Wool Blazer for 7 days.',
        timestamp: '2h ago',
        read: false,
    },
    {
        id: 'n3',
        title: 'Yika',
        body: 'Order #YK-2026-003 has been marked as delivered. Enjoy!',
        timestamp: '1d ago',
        read: true,
    },
    {
        id: 'n4',
        title: 'Yika',
        body: 'Your earnings of $99.00 from order #YK-2026-001 are now available.',
        timestamp: '2d ago',
        read: true,
    },
    {
        id: 'n5',
        title: 'Yika',
        body: 'Reminder: please ship Maya Chen’s rental by tomorrow to keep your seller score.',
        timestamp: '3d ago',
        read: false,
    },
    {
        id: 'n6',
        title: 'Yika',
        body: 'Your listing of the Floral Maxi Dress has ended. View past listings to relist.',
        timestamp: '1w ago',
        read: true,
    },
];
