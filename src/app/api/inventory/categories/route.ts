import { NextRequest, NextResponse } from 'next/server';

const AWS_API_URL = process.env.API_URL;

export async function GET(request: NextRequest) {
    try {
        if (!AWS_API_URL) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const url = `${AWS_API_URL}/inventory/categories`;
        console.log('📡 Fetching categories from AWS:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ AWS API Error:', response.status, errorText);

            return NextResponse.json(
                { error: 'Failed to fetch categories' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}