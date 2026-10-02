import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Server-side only - never exposed to browser
const AWS_API_URL = process.env.API_URL;

export async function GET(request: NextRequest) {
    try {
        // Validate environment variable is set
        if (!AWS_API_URL) {
            console.error('❌ API_URL environment variable is not set');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Get query parameters from the client request
        const searchParams = request.nextUrl.searchParams;
        const queryString = searchParams.toString();

        // Build URL to AWS API
        const url = `${AWS_API_URL}/inventory${queryString ? `?${queryString}` : ''}`;

        // Make request to AWS API (server-side only)
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication headers here if your AWS API requires them
                // Example: 'x-api-key': process.env.AWS_API_KEY,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ AWS API Error:', response.status, errorText);

            return NextResponse.json(
                {
                    error: 'Failed to fetch inventory from AWS',
                    details: errorText,
                    status: response.status
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Return data to client
        return NextResponse.json(data);

    } catch (error) {
        console.error('❌ Error in inventory API route:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    if (!AWS_API_URL) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    try {
        const baseUrl = AWS_API_URL.endsWith('/') ? AWS_API_URL.slice(0, -1) : AWS_API_URL;
        const response = await fetch(`${baseUrl}/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`,
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}