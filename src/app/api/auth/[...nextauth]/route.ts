/**
 * Auth.js route handler.
 *
 * This file MUST exist at this exact path for Auth.js to work with the
 * Next.js App Router. It simply re-exports the handlers created in src/auth.ts.
 *
 * Auth.js uses this to handle:
 *  POST /api/auth/callback/credentials  — processes the login form submission
 *  GET  /api/auth/session               — returns the current session
 *  POST /api/auth/signout               — clears the session cookie
 */

import { handlers } from '@/auth';

export const { GET, POST } = handlers;
