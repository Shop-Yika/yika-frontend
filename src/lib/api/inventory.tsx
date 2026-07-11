// API client for inventory operations
import { InventoryItem, ApiResponse, FilterOptions } from './types';

// ─── Normalize raw AWS item → InventoryItem ───────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeItem(raw: any, index: number): InventoryItem {
    // Sizes: [{size: "S", in_stock: 1}] → ["S"]
    const sizes: string[] = Array.isArray(raw.sizes)
        ? raw.sizes.map((s: { size: string }) => s.size)
        : raw.sizes ?? [];

    // Stock: sum of in_stock across all sizes
    const stock = Array.isArray(raw.sizes)
        ? String(raw.sizes.reduce((acc: number, s: { in_stock: number }) => acc + (s.in_stock ?? 0), 0))
        : raw.stock ?? '0';

    // Occasion: ["casual", "party"] → "casual" (take first)
    const occasion = Array.isArray(raw.occasion)
        ? raw.occasion[0]
        : raw.occasion ?? '';

    // ID: AWS uses "ItemID"
    const id = raw.ItemID ?? raw.id ?? raw.itemId ?? `item-${index}`;

    // Image: AWS uses "thumbnail" (may be null)
    const imageUrl = raw.thumbnail ?? raw.imageUrl ?? raw.image_url ?? '';

    // Color: some AWS items use capital "Color"
    const color = raw.color ?? raw.Color ?? '';

    return {
        id,
        name: raw.name ?? raw.ItemName ?? '',
        description: raw.description ?? '',
        price: typeof raw.price === 'string' ? parseFloat(raw.price) : (raw.price ?? 0),
        priceUnit: raw.priceUnit ?? 'day',
        category: raw.category ?? '',
        brand: raw.brand ?? '',
        imageUrl,
        images: raw.images ?? [],
        gender: raw.gender,
        occasion,
        color,
        sizes,
        stock,
        availability: raw.availability ?? true,
        contact:  raw.contact  ?? '',
        owner_id: raw.owner_id ?? '',
        tags: raw.tags ?? [],
        rating: raw.rating,
        reviews: raw.reviews,
        rentalCount: raw.rentalCount ?? raw.rental_count,
        createdAt: raw.createdAt ?? raw.created_at,
        updatedAt: raw.updatedAt ?? raw.updated_at,
    };
}

// ─── Direct AWS fetch (server-side only) ─────────────────────────────────────
async function fetchFromAWS<T>(
    path: string,
    normalize?: (data: unknown) => T
): Promise<T> {
    const AWS_API_URL = process.env.API_URL;

    if (!AWS_API_URL) {
        throw new Error('API_URL environment variable is not set');
    }

    const baseUrl = AWS_API_URL.endsWith('/') ? AWS_API_URL.slice(0, -1) : AWS_API_URL;
    const url = `${baseUrl}${path}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ AWS API Error:', response.status, errorText);
        throw new Error(`AWS API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Handle both {data: [...]} and [...] response shapes
    const payload = data?.data ?? data;
    return normalize ? normalize(payload) : payload as T;
}

// ─── API Client (client-side, routes through Next.js /api) ───────────────────
class ApiClient {
    private getBaseUrl(): string {
        if (typeof window !== 'undefined') {
            return '/api';
        }
        if (process.env.NEXT_PUBLIC_SITE_URL) {
            return `${process.env.NEXT_PUBLIC_SITE_URL}/api`;
        }
        if (process.env.VERCEL_URL) {
            return `https://${process.env.VERCEL_URL}/api`;
        }
        return 'http://localhost:3000/api';
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.getBaseUrl()}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: { 'Content-Type': 'application/json', ...options.headers },
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }

    async getInventory(filters?: FilterOptions): Promise<InventoryItem[]> {
        const queryParams = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, Array.isArray(value) ? value.join(',') : String(value));
                }
            });
        }
        const endpoint = `/inventory${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await this.request<any>(endpoint);
        // Handle both { data: [...] } and [...] response shapes, then normalize
        // each raw AWS item so field names match InventoryItem throughout the app.
        const raw: unknown[] = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
                ? response.data
                : [];
        return raw.map((item, i) => normalizeItem(item, i));
    }

    async getProductById(id: string): Promise<InventoryItem> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await this.request<any>(`/inventory/${id}`);
        // Unwrap { data: {...} } if present, then normalize AWS field names
        const raw: unknown = response?.data ?? response;
        return normalizeItem(raw, 0);
    }

    async getCategories(): Promise<string[]> {
        const response = await this.request<ApiResponse<string[]>>('/inventory/categories');
        return response.data;
    }

    async getBrands(): Promise<string[]> {
        const response = await this.request<ApiResponse<string[]>>('/inventory/brands');
        return response.data;
    }

    async getOccasions(): Promise<string[]> {
        const response = await this.request<ApiResponse<string[]>>('/inventory/occasions');
        return response.data;
    }
}

export const apiClient = new ApiClient();

// ─── Server-safe exported functions ──────────────────────────────────────────
// These are safe to call from server components — they go directly to AWS,
// skipping the internal /api hop that was causing 401s on Vercel.

export async function getInventory(filters?: FilterOptions): Promise<InventoryItem[]> {
    // Server-side: call AWS directly
    if (typeof window === 'undefined') {
        const queryParams = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, Array.isArray(value) ? value.join(',') : String(value));
                }
            });
        }
        const path = `/inventory${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return fetchFromAWS<InventoryItem[]>(path, (raw: any) =>
            Array.isArray(raw) ? raw.map(normalizeItem) : []
        );
    }
    // Client-side: go through Next.js API route
    return apiClient.getInventory(filters);
}

export async function getProductById(id: string): Promise<InventoryItem> {
    if (typeof window === 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return fetchFromAWS<InventoryItem>(`/inventory/${id}`, (raw: any) => {
            // AWS returns { item: { ...fields }, images: [ ...s3Urls ] }
            const item   = raw?.item   ?? raw;
            const images = raw?.images ?? [];
            return normalizeItem({ ...item, images }, 0);
        });
    }
    return apiClient.getProductById(id);
}

export async function getCategories(): Promise<string[]> {
    if (typeof window === 'undefined') {
        return fetchFromAWS<string[]>('/inventory/categories');
    }
    return apiClient.getCategories();
}

export async function getBrands(): Promise<string[]> {
    if (typeof window === 'undefined') {
        return fetchFromAWS<string[]>('/inventory/brands');
    }
    return apiClient.getBrands();
}

export async function getOccasions(): Promise<string[]> {
    if (typeof window === 'undefined') {
        return fetchFromAWS<string[]>('/inventory/occasions');
    }
    return apiClient.getOccasions();
}