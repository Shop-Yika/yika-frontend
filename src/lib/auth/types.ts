/**
 * Type augmentation for Auth.js (next-auth v5).
 *
 * The default Session.user only has { name, email, image }.
 * We extend it here to include the fields our AWS backend returns.
 *
 * Rules:
 *  - `accessToken` lives ONLY in the JWT cookie (server-side).
 *    It is NEVER exposed on the Session object the client can read.
 *  - `role` and `id` are safe to expose to the client via Session.
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface User {
        /** The sub claim from the AWS JWT (UUID) */
        id: string;
        /** Username from the AWS backend (distinct from email) */
        username: string;
        /** 'shopper' | 'merchant' | 'user' — stored in the AWS JWT */
        role: string;
        /** Raw JWT returned by POST /login — kept out of Session */
        accessToken: string;
        /** Unix timestamp of token expiry (from claims.exp) */
        tokenExp: number;
    }

    interface Session {
        user: {
            id: string;
            name: string;   // maps to username from AWS
            email: string;
            image?: string;
            role: string;
        };
        /** Present when the backend JWT has expired; triggers re-auth */
        error?: 'TokenExpired';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
        username: string;
        /** The raw AWS JWT — only accessible server-side via getToken() */
        accessToken: string;
        /** Unix expiry of the AWS JWT so we can detect expiry server-side */
        tokenExp: number;
        error?: 'TokenExpired';
    }
}
