import { InventoryItem, FilterOptions } from './api/types';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Filter products based on FilterOptions
export function filterInventory(
    items: InventoryItem[],
    filters: FilterOptions
): InventoryItem[] {
  let filtered = [...items];

  // Filter by category (e.g., "Dresses")
  if (filters.category) {
    filtered = filtered.filter(
        item => item.category.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  // Filter by brand (e.g., "GUCCI")
  if (filters.brand) {
    filtered = filtered.filter(
        item => item.brand.toLowerCase() === filters.brand?.toLowerCase()
    );
  }

  // Filter by gender (e.g., "Women")
  if (filters.gender) {
    filtered = filtered.filter(
        item => item.gender?.toLowerCase() === filters.gender?.toLowerCase()
    );
  }

  // Filter by occasion (e.g., "Formal")
  if (filters.occasion) {
    filtered = filtered.filter(
        item => item.occasion?.toLowerCase() === filters.occasion?.toLowerCase()
    );
  }

  // Filter by color (e.g., "Pink")
  if (filters.color) {
    filtered = filtered.filter(
        item => item.color?.toLowerCase() === filters.color?.toLowerCase()
    );
  }

  // Filter by size (e.g., "M")
  if (filters.size) {
    filtered = filtered.filter(
        item => item.sizes?.includes(filters.size!)
    );
  }

  // Filter by availability (only show available items)
  if (filters.availability !== undefined) {
    filtered = filtered.filter(
        item => filters.availability ? item.availability === true : true
    );
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(item => item.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(item => item.price <= filters.maxPrice!);
  }

  // Filter by search query (searches name and description)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(item =>
        item.tags?.some(tag =>
            filters.tags?.some(filterTag =>
                tag.toLowerCase().includes(filterTag.toLowerCase())
            )
        )
    );
  }

  return filtered;
}

// Sort products
export function sortInventory(
    items: InventoryItem[],
    sortBy: FilterOptions['sortBy']
): InventoryItem[] {
  const sorted = [...items];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    case 'popular':
      return sorted.sort((a, b) => (b.rentalCount || 0) - (a.rentalCount || 0));
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return sorted;
  }
}

// Apply both filters and sorting
export function applyFiltersAndSort(
    items: InventoryItem[],
    filters: FilterOptions
): InventoryItem[] {
  let result = filterInventory(items, filters);

  if (filters.sortBy) {
    result = sortInventory(result, filters.sortBy);
  }

  return result;
}