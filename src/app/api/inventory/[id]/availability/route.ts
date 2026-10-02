import { NextRequest, NextResponse } from 'next/server';

const AWS_API_URL = process.env.API_URL;

// No auth required — this is the one booking endpoint meant for public read.
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!AWS_API_URL) {
            console.error('❌ API_URL environment variable is not set');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const { id } = await params;
        const baseUrl = AWS_API_URL.endsWith('/') ? AWS_API_URL.slice(0, -1) : AWS_API_URL;

        const query = request.nextUrl.searchParams.toString();
        const url = `${baseUrl}/inventory/${id}/availability${query ? `?${query}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ AWS API Error:', response.status, errorText);

            if (response.status === 404) {
                return NextResponse.json(
                    { error: 'Product not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { error: 'Failed to fetch availability', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('❌ Error in availability API route:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
