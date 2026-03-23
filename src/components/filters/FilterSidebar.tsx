'use client';

import { useState, useEffect } from 'react';
import { FilterOptions, InventoryItem } from '@/lib/api/types';
import Image from 'next/image';

interface FilterSidebarProps {
    filters: FilterOptions;
    onFilterChange: (filters: Partial<FilterOptions>) => void;
    onApplyFilters: () => void;
    allProducts: InventoryItem[];
}

type FilterCategory = 'Gender' | 'Category' | 'Brand' | 'Occasion' | 'Color' | 'Size' | 'Availability';

export default function FilterSidebar({
                                          filters,
                                          onFilterChange,
                                          onApplyFilters,
                                          allProducts
                                      }: FilterSidebarProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);

    // Track which sections are expanded
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        Gender: false,
        Category: false,
        Brand: false,
        Occasion: false,
        Color: false,
        Size: false,
        Availability: false,
    });

    // Extract categories and brands from products
    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            const uniqueCategories = [...new Set(
                allProducts.map(p => p.category).filter(Boolean)
            )].sort();

            const uniqueBrands = [...new Set(
                allProducts.map(p => p.brand).filter(Boolean)
            )].sort();

            setCategories(uniqueCategories);
            setBrands(uniqueBrands);
        }
    }, [allProducts]);

    // Toggle section expand/collapse
    const toggleSection = (label: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    // Clear all filters
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

    // Filter options configuration
    const filterOptionsConfig: Record<FilterCategory, any> = {
        Gender: {
            type: 'radio',
            options: ['Women', 'Men', 'Unisex'],
            filterKey: 'gender',
        },
        Category: {
            type: 'radio',
            options: categories,
            filterKey: 'category',
            loading: categories.length === 0,
        },
        Brand: {
            type: 'checkbox',
            options: brands,
            filterKey: 'brand',
            loading: brands.length === 0,
            scrollable: true,
        },
        Occasion: {
            type: 'radio',
            options: ['Casual', 'Work', 'Formal', 'Party', 'Wedding', 'Date Night'],
            filterKey: 'occasion',
        },
        Color: {
            type: 'color',
            options: [
                { name: 'Black', hex: '#000000' },
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Red', hex: '#EF4444' },
                { name: 'Blue', hex: '#3B82F6' },
                { name: 'Pink', hex: '#EC4899' },
                { name: 'Green', hex: '#10B981' },
                { name: 'Yellow', hex: '#F59E0B' },
                { name: 'Purple', hex: '#8B5CF6' },
            ],
            filterKey: 'color',
        },
        Size: {
            type: 'button',
            options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            filterKey: 'size',
        },
        Availability: {
            type: 'checkbox-single',
            options: ['In Stock'],
            filterKey: 'availability',
        },
    };

    // Handle filter changes based on type
    const handleFilterToggle = (category: FilterCategory, value: string) => {
        const config = filterOptionsConfig[category];
        const filterKey = config.filterKey as keyof FilterOptions;

        if (config.type === 'radio') {
            // Radio: set value or clear if same value clicked
            const currentValue = filters[filterKey];
            onFilterChange({ [filterKey]: currentValue === value ? undefined : value });
        } else if (config.type === 'checkbox') {
            // Checkbox: toggle value
            const currentValue = filters[filterKey];
            onFilterChange({ [filterKey]: currentValue === value ? undefined : value });
        } else if (config.type === 'button') {
            // Button: toggle value
            const currentValue = filters[filterKey];
            onFilterChange({ [filterKey]: currentValue === value ? undefined : value });
        } else if (config.type === 'checkbox-single') {
            // Single checkbox: toggle boolean
            onFilterChange({ [filterKey]: !filters[filterKey] });
        }
    };

    // Render filter options based on type
    const renderFilterOptions = (category: FilterCategory) => {
        const config = filterOptionsConfig[category];

        if (config.loading) {
            return <p className="text-xs text-gray-500">Loading...</p>;
        }

        // Color picker
        if (config.type === 'color') {
            return (
                <div className="pl-[10.25px] grid grid-cols-5 gap-2">
                    {config.options.map((color: { name: string; hex: string }) => (
                        <button
                            key={color.name}
                            onClick={() => handleFilterToggle(category, color.name)}
                            className={`w-8 h-8 rounded-full border-2 ${
                                filters.color === color.name
                                    ? 'border-black ring-2 ring-offset-1 ring-black'
                                    : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        />
                    ))}
                </div>
            );
        }

        // Size buttons
        if (config.type === 'button') {
            return (
                <div className="pl-[10.25px] grid grid-cols-3 gap-2">
                    {config.options.map((size: string) => (
                        <button
                            key={size}
                            onClick={() => handleFilterToggle(category, size)}
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
            );
        }

        // Single checkbox (Availability)
        if (config.type === 'checkbox-single') {
            return (
                <div className="pl-[10.25px] flex flex-col gap-4">
                    {config.options.map((option: string) => (
                        <label
                            key={option}
                            className="text-[16.65px] font-['Satoshi'] text-[#1E1E1E] font-medium leading-[100%] tracking-[0%] flex items-center gap-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={!!filters.availability}
                                onChange={() => handleFilterToggle(category, option)}
                                className="appearance-none w-[18px] h-[18px] border-[1.28px] border-[#1E1E1E] rounded-[2px] checked:bg-black checked:border-[#1E1E1E] focus:outline-none"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            );
        }

        // Radio or checkbox options
        const containerClass = config.scrollable
            ? "pl-[10.25px] flex flex-col gap-4 max-h-48 overflow-y-auto"
            : "pl-[10.25px] flex flex-col gap-4";

        return (
            <div className={containerClass}>
                {config.options.map((option: string) => {
                    const filterKey = config.filterKey as keyof FilterOptions;
                    const isChecked = filters[filterKey] === option;

                    return (
                        <label
                            key={option}
                            className="text-[16.65px] font-['Satoshi'] text-[#1E1E1E] font-medium leading-[100%] tracking-[0%] flex items-center gap-2 cursor-pointer"
                        >
                            <input
                                type={config.type === 'radio' ? 'radio' : 'checkbox'}
                                name={config.type === 'radio' ? config.filterKey : undefined}
                                checked={isChecked}
                                onChange={() => handleFilterToggle(category, option)}
                                className="appearance-none w-[18px] h-[18px] border-[1.28px] border-[#1E1E1E] rounded-[2px] checked:bg-black checked:border-[#1E1E1E] focus:outline-none"
                            />
                            {option}
                        </label>
                    );
                })}
            </div>
        );
    };

    return (
        <aside className="w-full lg:absolute lg:left-0 lg:w-[363.84px] h-screen bg-white lg:border-r-[0.62px] border-black/30 flex flex-col overflow-hidden">            {/* Fixed Top Section - Sort By + Header */}
            <div className="flex-shrink-0 px-[33.7473px] pt-[81.99px] pb-4 bg-white">
                {/* Sort By */}
                <div className="flex flex-row items-center gap-[41px] border border-black/30 px-[20.5px] py-[15.37px] w-[167.62px] h-[46.12px] mb-6">
                    <select
                        value={filters.sortBy || ''}
                        onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] || undefined })}
                        className="appearance-none text-[17.93px] font-['Satoshi'] font-medium text-black leading-[24px] bg-transparent w-full cursor-pointer"
                    >
                        <option value="">Sort by</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest</option>
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                    <div className="w-[25.62px] h-[21.78px] flex items-center flex-shrink-0">
                        <Image
                            src="/assets/icons/Downward-Caret.svg"
                            alt="Downward Caret"
                            width={12}
                            height={8}
                        />
                    </div>
                </div>

                {/* RENT BY Header */}
                <div className="flex justify-between items-center w-full">
                    <p className="text-[21.77px] font-['Satoshi'] font-bold uppercase text-[#1E1E1E]">
                        RENT BY
                    </p>
                    <p
                        className="text-[16.65px] font-['Satoshi'] underline font-medium text-[#1E1E1E] cursor-pointer"
                        onClick={clearAll}
                    >
                        Clear all
                    </p>
                </div>
            </div>

            {/* Scrollable Filters Section */}
            <div className="flex-1 overflow-y-auto px-[33.7473px]">
                <section className="w-[312.6px] flex flex-col gap-6 pb-6">
                    {/* Filters dynamically mapped */}
                    {Object.keys(expandedSections).map((label) => {
                        const category = label as FilterCategory;

                        return (
                            <div
                                key={label}
                                className="w-full border-b border-black/30 pb-6 flex flex-col gap-4"
                            >
                                {/* Section title */}
                                <div
                                    className="flex justify-between items-center w-full cursor-pointer"
                                    onClick={() => toggleSection(label)}
                                >
                                    <p className="text-[16.65px] uppercase font-['Satoshi'] font-medium text-[#1E1E1E]">
                                        {label}
                                    </p>
                                    <div className="w-[27.67px] h-[23.06px] flex items-center">
                                        <Image
                                            src={
                                                expandedSections[label]
                                                    ? "/assets/icons/Upward-Arrow.svg"
                                                    : "/assets/icons/Downward-Arrow.svg"
                                            }
                                            alt={`${label} Toggle Arrow`}
                                            width={12}
                                            height={8}
                                        />
                                    </div>
                                </div>

                                {/* Section options */}
                                {expandedSections[label] && renderFilterOptions(category)}
                            </div>
                        );
                    })}
                </section>
            </div>

            {/* Fixed Bottom Section - Show Results Button */}
            <div className="flex-shrink-0 px-[33.7473px] pb-[61.49px] pt-4 bg-white border-t border-black/10">
                <div
                    className="w-full h-[46.12px]  flex items-center justify-center cursor-pointer  mt-2 bg-[#8C2D8B] hover:bg-[#8C2D8B]/10 text-white hover:text-[#0e0e0e] hover:border hover:border-[#8c2d8b] text-sm font-semibold py-3.5 transition-all duration-200 hover:shadow-[#8c2d8b]"
                    onClick={onApplyFilters}
                >
                    <p className="text-[17.93px] uppercase font-['Satoshi'] font-bold text-[#FFFDF7]">
                        Show results
                    </p>
                </div>
            </div>
        </aside>
    );
}