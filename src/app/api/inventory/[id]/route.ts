import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AWS_API_URL = process.env.API_URL;

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
        const url = `${baseUrl}/inventory/${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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
                { error: 'Failed to fetch product', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();

        // AWS returns { item: { ...fields }, images: [ ...s3Urls ] }
        // Flatten into { data: { ...fields, images } } so the client's
        // normalizeItem() can read all fields directly off the object.
        const { item, images = [] } = data;
        const normalized = item
            ? { ...item, images }
            : { ...data, images: data.images ?? [] };

        return NextResponse.json({ data: normalized });

    } catch (error) {
        console.error('❌ Error in product API route:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!AWS_API_URL) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const baseUrl = AWS_API_URL.endsWith('/') ? AWS_API_URL.slice(0, -1) : AWS_API_URL;

    try {
        const response = await fetch(`${baseUrl}/inventory/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.accessToken}`,
            },
            cache: 'no-store',
        });

        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}