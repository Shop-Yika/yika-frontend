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
        const url = `${AWS_API_URL}/inventory/${id}`;

        console.log('📡 Fetching product from AWS:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ AWS Response Status:', response.status);

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { error: 'Product not found' },
                    { status: 404 }
                );
            }

            const errorText = await response.text();
            console.error('❌ AWS API Error:', response.status, errorText);

            return NextResponse.json(
                { error: 'Failed to fetch product', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('❌ Error fetching product:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}