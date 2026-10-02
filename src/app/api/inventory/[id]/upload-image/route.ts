import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AWS_API_URL = process.env.API_URL;

export async function POST(
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

    // Forward the multipart form data directly to AWS
    const formData = await request.formData();

    try {
        const response = await fetch(`${baseUrl}/inventory/${id}/uploadImage`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.accessToken}`,
                // Do NOT set Content-Type — let fetch set it with the boundary for multipart
            },
            body: formData,
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
