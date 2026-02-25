'use client';

import { useState, useEffect } from 'react';
import { FilterOptions, InventoryItem } from '@/lib/api/types';
import Image from 'next/image';

interface FilterSidebarProps {
    filters: FilterOptions;
    onFilterChange: (filters: Partial<FilterOptions>) => void;
    onApplyFilters: () => void;
    allProducts: InventoryItem[]; // 🆕 Add this prop to extract categories/brands
}

export default function FilterSidebar({
                                          filters,
                                          onFilterChange,
                                          onApplyFilters,
                                          allProducts // 🆕 Receive all products
                                      }: FilterSidebarProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 🆕 Extract categories and brands from products (no API call)
    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            console.log('📊 Extracting filters from', allProducts.length, 'products');

            // Extract unique categories
            const uniqueCategories = [...new Set(
                allProducts
                    .map(p => p.category)
                    .filter(Boolean)
            )].sort();

            // Extract unique brands
            const uniqueBrands = [...new Set(
                allProducts
                    .map(p => p.brand)
                    .filter(Boolean)
            )].sort();

            console.log('✅ Categories:', uniqueCategories);
            console.log('✅ Brands:', uniqueBrands);

            setCategories(uniqueCategories);
            setBrands(uniqueBrands);
        }
    }, [allProducts]);

    const clearAll = () => {
        onFilterChange({
            category: undefined,
            brand: undefined,
            gender: undefined,
            occasion: undefined,
            color: undefined,
            size: undefined,
            availability: undefined,
            sortBy: undefined,
        });
    };

    return (
        <aside className="absolute left-0 w-[363.84px] bg-white border-r-[0.62px] border-black/30 px-[33.7473px] pt-[81.99px] pb-[61.49px] box-border flex flex-col items-start">
            {/* Sort By */}
            <div className="border border-black/30 px-[20.5px] py-[15.37px] mb-6 bg-white cursor-pointer pr-10 flex flex-row">
                <select
                    value={filters.sortBy || ''}
                    onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] || undefined })}
                    className="appearance-none text-[17.93px] font-['Satoshi'] font-medium text-black leading-[24px]"
                >
                    <option value="">Sort by</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                </select>
                <Image
                    src="/assets/icons/Downward-Arrow.svg"
                    alt="Downward Caret"
                    width={12}
                    height={8}
                />
            </div>

            <section className="w-[312.6px] flex flex-col gap-6">
                {/* RENT BY Header */}
                <div className="flex items-center justify-between mb-6 w-full">
                    <h3 className="text-[21.77px] font-['Satoshi'] font-bold uppercase text-[#1E1E1E]">RENT BY</h3>
                    <button
                        onClick={clearAll}
                        className="text-[16.65px] font-['Satoshi'] underline font-medium text-[#1E1E1E] cursor-pointer"
                    >
                        Clear all
                    </button>
                </div>

                {/* Gender Filter */}
                <details className="w-full border-b border-black/30 pb-6">
                    <summary className="cursor-pointer font-medium flex items-center justify-between py-2 text-[16.65px] uppercase font-['Satoshi'] text-[#1E1E1E]">
                        GENDER
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="mt-2 space-y-2">
                        {['Women', 'Men', 'Unisex'].map((gender) => (
                            <label key={gender} className="text-[16.65px] font-['Satoshi'] text-[#1E1E1E] font-medium leading-[100%] tracking-[0%] flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="gender"
                                    value={gender}
                                    checked={filters.gender === gender}
                                    onChange={(e) => onFilterChange({ gender: e.target.value })}
                                    className="appearance-none w-[18px] h-[18px] border-[1.28px] border-[#1E1E1E] rounded-[2px] checked:bg-black checked:border-[#1E1E1E] focus:outline-none"
                                />
                                {gender}
                            </label>
                        ))}
                    </div>
                </details>

                {/* Category Filter */}
                <details className="w-full border-b border-black/30 pb-6" open>
                    <summary className="cursor-pointer font-medium flex items-center justify-between py-2 text-[16.65px] uppercase font-['Satoshi'] text-[#1E1E1E]">
                        CATEGORY
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="mt-2 space-y-2">
                        {categories.length === 0 ? (
                            <p className="text-xs text-gray-500">Loading categories...</p>
                        ) : (
                            categories.map((category) => (
                                <label key={category} className="text-[16.65px] font-['Satoshi'] text-[#1E1E1E] font-medium leading-[100%] tracking-[0%] flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category}
                                        checked={filters.category === category}
                                        onChange={(e) => onFilterChange({ category: e.target.value })}
                                        className="mr-2"
                                    />
                                    {category}
                                </label>
                            ))
                        )}
                    </div>
                </details>

                {/* Brand Filter */}
                <details className="w-full border-b border-black/30 pb-6" open>
                    <summary className="cursor-pointer font-medium flex items-center justify-between py-2 text-[16.65px] uppercase font-['Satoshi'] text-[#1E1E1E]">
                        BRAND
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                        {brands.length === 0 ? (
                            <p className="text-xs text-gray-500">Loading brands...</p>
                        ) : (
                            brands.map((brand) => (
                                <label key={brand} className="text-[16.65px] font-['Satoshi'] text-[#1E1E1E] font-medium leading-[100%] tracking-[0%] flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={brand}
                                        checked={filters.brand === brand}
                                        onChange={(e) => onFilterChange({ brand: e.target.checked ? brand : undefined })}
                                        className="mr-2"
                                    />
                                    {brand}
                                </label>
                            ))
                        )}
                    </div>
                </details>

                {/* Occasion Filter */}
                <details className="w-full border-b border-black/30 pb-6">
                    <summary className="cursor-pointer font-medium flex items-center justify-between py-2 text-[16.65px] uppercase font-['Satoshi'] text-[#1E1E1E]">
                        OCCASION
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="mt-2 space-y-2">
                        {['Casual', 'Work', 'Formal', 'Party', 'Wedding', 'Date Night'].map((occasion) => (
                            <label key={occasion} className="text-[16.65px] font-['Satoshi'] text-[#1E1E1E] font-medium leading-[100%] tracking-[0%] flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="occasion"
                                    value={occasion}
                                    checked={filters.occasion === occasion}
                                    onChange={(e) => onFilterChange({ occasion: e.target.value })}
                                    className="mr-2"
                                />
                                {occasion}
                            </label>
                        ))}
                    </div>
                </details>

                {/* Color Filter */}
                <details className="w-full border-b border-black/30 pb-6">
                    <summary className="cursor-pointer font-medium flex items-center justify-between py-2 text-[16.65px] uppercase font-['Satoshi'] text-[#1E1E1E]">
                        COLOR
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="mt-2 grid grid-cols-5 gap-2">
                        {[
                            { name: 'Black', hex: '#000000' },
                            { name: 'White', hex: '#FFFFFF' },
                            { name: 'Red', hex: '#EF4444' },
                            { name: 'Blue', hex: '#3B82F6' },
                            { name: 'Pink', hex: '#EC4899' },
                            { name: 'Green', hex: '#10B981' },
                            { name: 'Yellow', hex: '#F59E0B' },
                            { name: 'Purple', hex: '#8B5CF6' },
                        ].map((color) => (
                            <button
                                key={color.name}
                                onClick={() => onFilterChange({
                                    color: filters.color === color.name ? undefined : color.name
                                })}
                                className={`w-8 h-8 rounded-full border-2 ${
                                    filters.color === color.name ? 'border-black' : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </details>

                {/* Size Filter */}
                <details className="w-full border-b border-black/30 pb-6">
                    <summary className="cursor-pointer font-medium flex items-center justify-between py-2 text-[16.65px] uppercase font-['Satoshi'] text-[#1E1E1E]">
                        SIZE
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <button
                                key={size}
                                onClick={() => onFilterChange({
                                    size: filters.size === size ? undefined : size
                                })}
                                className={`px-3 py-2 text-xs border rounded ${
                                    filters.size === size
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-gray-300'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </details>

                {/* Availability Filter */}
                <details className="w-full border-b border-black/30 pb-6">
                    <summary className="cursor-pointer font-medium flex items-center justify-between py-2 text-[16.65px] uppercase font-['Satoshi'] text-[#1E1E1E]">
                        AVAILABILITY
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="mt-2">
                        <label className="flex items-center text-sm">
                            <input
                                type="checkbox"
                                checked={filters.availability || false}
                                onChange={(e) => onFilterChange({ availability: e.target.checked })}
                                className="mr-2"
                            />
                            In Stock
                        </label>
                    </div>
                </details>

                {/* Show Results Button */}
                <button
                    onClick={onApplyFilters}
                    className="w-full h-[46.12px] bg-black text-white mt-2 font-medium hover:bg-gray-800 transition-colors"
                >
                    <p className="text-[17.93px] uppercase font-['Satoshi'] font-bold text-[#FFFDF7]">
                        Show results
                    </p>
                </button>
            </section>
        </aside>
    );
}