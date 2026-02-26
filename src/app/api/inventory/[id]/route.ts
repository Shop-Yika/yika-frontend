import { NextRequest, NextResponse } from 'next/server';

const AWS_API_URL = process.env.API_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!AWS_API_URL) {
            console.error('❌ API_URL environment variable is not set');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const { id } = params;

        const baseUrl = AWS_API_URL.endsWith('/') ? AWS_API_URL.slice(0, -1) : AWS_API_URL;
        const url = `${baseUrl}/inventory/${id}`;

        console.log('📡 Fetching product from AWS:', url);
        console.log('📋 Product ID:', id);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        console.log('📊 AWS Response Status:', response.status);

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
        console.log('✅ Product data received from AWS');

        // Return the data
        // If AWS already wraps in {data: ...}, return as-is
        // If AWS returns the item directly, wrap it
        if (data.data) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json({ data });
        }

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