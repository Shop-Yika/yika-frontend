/**
 * Auth.js v5 (next-auth@beta) configuration.
 *
 * Architecture
 * ────────────
 * 1. User submits login form → signIn('credentials', { username, password })
 * 2. authorize() calls POST {AUTH_API_URL}/login → receives { token }
 * 3. authorize() calls POST {AUTH_API_URL}/verify → decodes claims (sub, username, email, role, exp)
 * 4. Auth.js encrypts the user + token into an httpOnly session cookie
 * 5. Every server-side API call that needs auth retrieves the token via
 *    getToken({ req }) — the raw token NEVER reaches the browser.
 *
 * Expiry handling
 * ───────────────
 * The AWS JWT has its own exp claim. We store it in the Auth.js JWT.
 * On each request the jwt() callback checks it; if expired we set
 * token.error = 'TokenExpired' so the middleware can redirect to /auth/login.
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Imported purely for side-effect type augmentation
import '@/lib/auth/types';

const AUTH_API_URL = process.env.AUTH_API_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;
                if (!AUTH_API_URL) {
                    console.error('AUTH_API_URL environment variable is not set');
                    return null;
                }

                // ── Step 1: Exchange credentials for a JWT ──────────────────
                let token: string;
                try {
                    const loginRes = await fetch(`${AUTH_API_URL}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                        cache: 'no-store',
                    });

                    if (!loginRes.ok) return null; // 401 Invalid credentials

                    const loginData = await loginRes.json();
                    token = loginData.token;
                } catch {
                    console.error('Auth: login request failed');
                    return null;
                }

                // ── Step 2: Verify the token → decode claims ────────────────
                try {
                    const verifyRes = await fetch(`${AUTH_API_URL}/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        cache: 'no-store',
                    });

                    if (!verifyRes.ok) return null;

                    const { claims } = await verifyRes.json();
                    // claims: { sub, username, email, role, iat, exp }

                    return {
                        id:          claims.sub,
                        username:    claims.username,
                        name:        claims.username, // Auth.js display name
                        email:       claims.email,
                        role:        claims.role ?? 'user',
                        accessToken: token,
                        tokenExp:    claims.exp,      // Unix timestamp
                    };
                } catch {
                    console.error('Auth: verify request failed');
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        /**
         * jwt() runs on every request that touches the session.
         * It is the ONLY place where accessToken is available and handled.
         * The token lives in an encrypted httpOnly cookie — never in the browser.
         */
        jwt({ token, user }) {
            // Fresh login — populate from the authorize() return value
            if (user) {
                token.id          = user.id;
                token.role        = user.role;
                token.username    = user.username;
                token.accessToken = user.accessToken;
                token.tokenExp    = user.tokenExp;
                token.error       = undefined;
                return token;
            }

            // Subsequent requests — check if the AWS JWT is still valid
            if (token.tokenExp && Date.now() / 1000 < token.tokenExp) {
                return token; // still valid, pass through unchanged
            }

            // AWS JWT has expired — mark the session so middleware redirects
            return { ...token, error: 'TokenExpired' as const };
        },

        /**
         * session() shapes what useSession() / auth() returns to the app.
         * Never include accessToken here — it would leak to the client.
         */
        session({ session, token }) {
            session.user.id   = token.id;
            session.user.role = token.role;
            session.user.name = token.username;  // override default
            if (token.error) {
                session.error = token.error;
            }
            return session;
        },
    },

    pages: {
        signIn:  '/auth/login',
        error:   '/auth/error',
    },

    session: {
        strategy: 'jwt',
    },
});
