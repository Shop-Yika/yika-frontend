/**
 * Mock user profile — Tatiana, the persona shown in the Figma designs.
 *
 * Avatar path matches the file already shipped at
 * `public/assets/dashboard/profile-photo.jpg`.
 */

import type { UserProfile } from './types';

export const MOCK_USER: UserProfile = {
    firstName: 'Tatiana',
    lastName: 'Cole',
    email: 'tatiana.cole@example.com',
    avatarUrl: '/assets/dashboard/profile-photo.jpg',
    shippingAddress: {
        street: '1024 Magnolia Lane',
        city: 'Bozeman',
        state: 'MT',
        zip: '59715',
    },
};
