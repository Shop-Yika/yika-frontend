export type MerchantType = 'Brand Merchant' | 'Individual Merchant' | 'Dual Role';

export type ItemStatus = 'available' | 'rented' | 'in transit';

// Types for inventory and product data
// Types for inventory and product data

export interface InventoryItem {
  id: string;                    // "prod-001"
  name: string;                  // "Sunset Ombre Maxi Dress"
  description: string;           // Full product description
  price: number;                 // 20.89 (rental price per day/week)
  priceUnit?: string;            // "day" | "week" | "month"
  category: string;              // "Dresses" | "Tops" | "Bottoms" | "Outerwear"
  brand: string;                 // "GUCCI" | "CHANEL" | "DIOR" | "NIKE"
  imageUrl: string;              // Main product image URL
  images?: string[];             // Additional images for gallery

  // Fashion-specific fields
  gender?: 'Women' | 'Men' | 'Unisex';
  occasion?: string;             // "Casual" | "Formal" | "Party" | "Work"
  color?: string;                // "Pink" | "White" | "Black"
  sizes?: string[];              // ["S", "M", "L", "XL"]
  availability?: boolean;        // Is it available for rent?

  // Ownership
  contact?: string;  // owner's email ("contact" field in AWS)
  owner_id?: string; // owner's user ID from Auth.js session (sub claim)

  // Additional metadata
  tags?: string[];               // ["summer", "maxi", "ombre"]
  rating?: number;               // Average rating (0-5)
  reviews?: number;              // Number of reviews
  rentalCount?: number;          // How many times it's been rented
  createdAt?: string;            // ISO timestamp
  updatedAt?: string;            // ISO timestamp
  stock?: string;                // Total stock available (calculated from sizes)
}

export interface FilterOptions {
  // Basic filters
  category?: string;             // "Dresses"
  brand?: string[];              // ["GUCCI", "CHANEL"] — multi-select

  // Fashion-specific filters
  gender?: string;               // "Women" | "Men"
  occasion?: string;             // "Casual" | "Formal"
  color?: string[];              // ["Pink", "Black"] — multi-select
  size?: string[];               // ["S", "M"] — multi-select
  availability?: boolean;        // true = only show available items

  // Price range
  minPrice?: number;             // 10
  maxPrice?: number;             // 100

  // Search and tags
  searchQuery?: string;          // "pink dress"
  tags?: string[];               // ["summer", "party"]

  // Sorting
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest' | 'popular' | 'rating';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AvailabilityWindow {
  start: string; // "YYYY-MM-DD", inclusive
  end: string;
}

export interface RemainingSegment {
  start: string;
  end: string;
  units: number;
  bookable: boolean;
}

export interface ItemAvailability {
  itemId: string;
  availability: AvailabilityWindow | boolean | null; // legacy items echo back a bare boolean instead of a window
  window: AvailabilityWindow | null;       // range the `remaining` spans cover
  remaining: Record<string, RemainingSegment[]>; // keyed by size
}

export interface RentalEvent {
  renterName: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface InventoryFilters {
  merchantType?: MerchantType;
  status?: ItemStatus;
  categories?: string[];
  minRating?: number;
  dateFrom?: Date;
  dateTo?: Date;

  size?: string;
  color?: string;
  style?: string;
  occasion?: string;
  designer?: string;
}
