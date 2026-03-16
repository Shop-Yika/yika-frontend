// API client for inventory operations
import { InventoryItem, ApiResponse, PaginatedResponse, FilterOptions } from './types';

class ApiClient {
    // Always use relative paths to Next.js API routes
    private getBaseUrl(): string {
        // Client-side: Use relative path
        if (typeof window !== 'undefined') {
            return '/api';
        }

        // This handles cases where the Next.js server needs to call its own API
        return process.env.NEXT_PUBLIC_SITE_URL
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/api`
            : 'http://localhost:3000/api';
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const baseUrl = this.getBaseUrl();
        const url = `${baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // GET /api/inventory - Get all inventory items with optional filters
    async getInventory(filters?: FilterOptions): Promise<InventoryItem[]> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        queryParams.append(key, value.join(','));
                    } else {
                        queryParams.append(key, String(value));
                    }
                }
            });
        }

        const endpoint = `/inventory${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await this.request<ApiResponse<InventoryItem[]>>(endpoint);
        return response.data;
    }

    // GET /api/inventory/:id - Get single product by ID
    async getProductById(id: string): Promise<InventoryItem> {
        const response = await this.request<ApiResponse<InventoryItem>>(`/inventory/${id}`);
        return response.data;
    }

    // GET /api/inventory/categories - Get all unique categories
    async getCategories(): Promise<string[]> {
        const response = await this.request<ApiResponse<string[]>>('/inventory/categories');
        return response.data;
    }

    // GET /api/inventory/brands - Get all unique brands
    async getBrands(): Promise<string[]> {
        const response = await this.request<ApiResponse<string[]>>('/inventory/brands');
        return response.data;
    }

    // GET /api/inventory/occasions - Get all unique occasions
    async getOccasions(): Promise<string[]> {
        const response = await this.request<ApiResponse<string[]>>('/inventory/occasions');
        return response.data;
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export function to get inventory (for backwards compatibility)
export async function getInventory(filters?: FilterOptions): Promise<InventoryItem[]> {
    return apiClient.getInventory(filters);
}