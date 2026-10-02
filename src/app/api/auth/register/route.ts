/**
 * POST /api/auth/register
 *
 * Server-side proxy for the AWS POST /create_user endpoint.
 * Keeps AUTH_API_URL server-side only (no NEXT_PUBLIC_ prefix).
 *
 * Request body:
 *   { username: string, password: string, email: string, role?: string }
 *
 * Forwards the response from AWS unchanged so the client can inspect
 * both success (201) and error shapes (400 / 409).
 */

import { NextRequest, NextResponse } from 'next/server';

const AUTH_API_URL = process.env.AUTH_API_URL;

export async function POST(request: NextRequest) {
    if (!AUTH_API_URL) {
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }

    const { username, password, email, role } = body as {
        username?: string;
        password?: string;
        email?: string;
        role?: string;
    };

    // Validate required fields before hitting the backend
    if (!username || !password || !email) {
        return NextResponse.json(
            { error: 'username, password, and email are required' },
            { status: 400 }
        );
    }

    try {
        const awsRes = await fetch(`${AUTH_API_URL}/create_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password,
                email,
                role: role ?? 'user',
            }),
            cache: 'no-store',
        });

        const data = await awsRes.json();

        // Mirror the exact status code from AWS (200, 400, 409, etc.)
        return NextResponse.json(data, { status: awsRes.status });

    } catch (error) {
        console.error('Registration proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
