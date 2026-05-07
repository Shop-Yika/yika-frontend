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
    allProducts,
}: FilterSidebarProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        Gender: false,
        Category: false,
        Brand: false,
        Occasion: false,
        Color: false,
        Size: false,
        Availability: false,
    });

    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            setCategories([...new Set(allProducts.map(p => p.category).filter(Boolean))].sort());
            setBrands([...new Set(allProducts.map(p => p.brand).filter(Boolean))].sort());
        }
    }, [allProducts]);

    const toggleSection = (label: string) => {
        setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
    };

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

    const filterOptionsConfig: Record<FilterCategory, any> = {
        Gender:       { type: 'radio',          options: ['Women', 'Men', 'Unisex'],                                                                    filterKey: 'gender' },
        Category:     { type: 'radio',          options: categories,                                                                                     filterKey: 'category', loading: categories.length === 0 },
        Brand:        { type: 'checkbox',       options: brands,                                                                                         filterKey: 'brand',    loading: brands.length === 0, scrollable: true },
        Occasion:     { type: 'radio',          options: ['Casual', 'Work', 'Formal', 'Party', 'Wedding', 'Date Night'],                                 filterKey: 'occasion' },
        Color:        { type: 'color',          options: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Red', hex: '#EF4444' }, { name: 'Blue', hex: '#3B82F6' }, { name: 'Pink', hex: '#EC4899' }, { name: 'Green', hex: '#10B981' }, { name: 'Yellow', hex: '#F59E0B' }, { name: 'Purple', hex: '#8B5CF6' }], filterKey: 'color' },
        Size:         { type: 'button',         options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],                                                            filterKey: 'size' },
        Availability: { type: 'checkbox-single', options: ['In Stock'],                                                                                   filterKey: 'availability' },
    };

    // Multi-select fields — toggling adds/removes from an array
    const MULTI_SELECT: FilterCategory[] = ['Brand', 'Color', 'Size'];

    const handleFilterToggle = (category: FilterCategory, value: string) => {
        const config = filterOptionsConfig[category];
        const filterKey = config.filterKey as keyof FilterOptions;

        if (MULTI_SELECT.includes(category)) {
            const current = (filters[filterKey] as string[] | undefined) ?? [];
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            onFilterChange({ [filterKey]: next.length > 0 ? next : undefined });
        } else if (config.type === 'radio') {
            const current = filters[filterKey];
            onFilterChange({ [filterKey]: current === value ? undefined : value });
        } else if (config.type === 'checkbox-single') {
            onFilterChange({ [filterKey]: !filters[filterKey] });
        }
    };

    const isSelected = (category: FilterCategory, option: string): boolean => {
        const config = filterOptionsConfig[category];
        const filterKey = config.filterKey as keyof FilterOptions;
        const value = filters[filterKey];

        if (MULTI_SELECT.includes(category)) {
            return Array.isArray(value) && value.includes(option);
        }
        return value === option;
    };

    const renderFilterOptions = (category: FilterCategory) => {
        const config = filterOptionsConfig[category];

        if (config.loading) {
            return <p className="text-xs text-gray-500">Loading...</p>;
        }

        if (config.type === 'color') {
            return (
                <div className="grid grid-cols-5 gap-2">
                    {config.options.map((color: { name: string; hex: string }) => {
                        const selected = isSelected(category, color.name);
                        return (
                            <button
                                key={color.name}
                                onClick={() => handleFilterToggle(category, color.name)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                    selected
                                        ? 'border-black ring-2 ring-offset-1 ring-black scale-110'
                                        : 'border-gray-300 hover:border-gray-500'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                                aria-pressed={selected}
                            />
                        );
                    })}
                </div>
            );
        }

        if (config.type === 'button') {
            return (
                <div className="grid grid-cols-3 gap-2">
                    {config.options.map((size: string) => {
                        const selected = isSelected(category, size);
                        return (
                            <button
                                key={size}
                                onClick={() => handleFilterToggle(category, size)}
                                aria-pressed={selected}
                                className={`px-3 py-2 text-xs border rounded transition-colors ${
                                    selected
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-gray-300 hover:border-gray-500'
                                }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            );
        }

        if (config.type === 'checkbox-single') {
            return (
                <div className="flex flex-col gap-4">
                    {config.options.map((option: string) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer text-[16px] font-medium text-[#1E1E1E]">
                            <input
                                type="checkbox"
                                checked={!!filters.availability}
                                onChange={() => handleFilterToggle(category, option)}
                                className="appearance-none w-[18px] h-[18px] border border-[#1E1E1E] rounded-sm checked:bg-black checked:border-[#1E1E1E] focus:outline-none flex-shrink-0"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            );
        }

        // Radio and multi-select checkbox
        const isMulti = MULTI_SELECT.includes(category);
        const containerClass = config.scrollable
            ? 'flex flex-col gap-4 max-h-48 overflow-y-auto pr-1'
            : 'flex flex-col gap-4';

        return (
            <div className={containerClass}>
                {config.options.map((option: string) => {
                    const checked = isSelected(category, option);
                    return (
                        <label key={option} className="flex items-center gap-2 cursor-pointer text-[16px] font-medium text-[#1E1E1E]">
                            <input
                                type={isMulti ? 'checkbox' : 'radio'}
                                name={!isMulti ? config.filterKey : undefined}
                                checked={checked}
                                onChange={() => handleFilterToggle(category, option)}
                                className="appearance-none w-[18px] h-[18px] border border-[#1E1E1E] rounded-sm checked:bg-black checked:border-[#1E1E1E] focus:outline-none flex-shrink-0"
                            />
                            {option}
                        </label>
                    );
                })}
            </div>
        );
    };

    return (
        <aside className="w-full h-full bg-white lg:border-r border-black/30 flex flex-col overflow-hidden">
            {/* Fixed top — Sort By + header */}
            <div className="flex-shrink-0 px-6 pt-10 pb-4 bg-white">
                {/* Sort By */}
                <div className="flex items-center gap-3 border border-black/30 px-4 py-2.5 w-fit mb-6">
                    <select
                        value={filters.sortBy || ''}
                        onChange={e => onFilterChange({ sortBy: (e.target.value as FilterOptions['sortBy']) || undefined })}
                        className="appearance-none text-[15px] font-medium text-black bg-transparent cursor-pointer"
                    >
                        <option value="">Sort by</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest</option>
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                    <Image src="/assets/icons/Downward-Caret.svg" alt="" aria-hidden width={12} height={8} />
                </div>

                {/* RENT BY header */}
                <div className="flex justify-between items-center">
                    <p className="text-[20px] font-bold uppercase text-[#1E1E1E]">RENT BY</p>
                    <button
                        onClick={clearAll}
                        className="text-[15px] underline font-medium text-[#1E1E1E] cursor-pointer"
                    >
                        Clear all
                    </button>
                </div>
            </div>

            {/* Scrollable filter list */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6">
                <div className="flex flex-col gap-6 pb-6">
                    {(Object.keys(expandedSections) as FilterCategory[]).map(category => (
                        <div key={category} className="border-b border-black/30 pb-6 flex flex-col gap-4">
                            <button
                                className="flex justify-between items-center w-full cursor-pointer"
                                onClick={() => toggleSection(category)}
                                aria-expanded={expandedSections[category]}
                            >
                                <span className="text-[15px] uppercase font-medium text-[#1E1E1E]">
                                    {category}
                                </span>
                                <Image
                                    src={expandedSections[category] ? '/assets/icons/Upward-Arrow.svg' : '/assets/icons/Downward-Arrow.svg'}
                                    alt=""
                                    aria-hidden
                                    width={12}
                                    height={8}
                                />
                            </button>
                            {expandedSections[category] && renderFilterOptions(category)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Fixed bottom — Show Results */}
            <div className="flex-shrink-0 px-6 pb-10 pt-4 bg-white border-t border-black/10">
                <button
                    onClick={onApplyFilters}
                    className="w-full h-[46px] flex items-center justify-center bg-black text-white hover:bg-gray-800 text-[15px] uppercase font-bold transition-colors"
                >
                    Show results
                </button>
            </div>
        </aside>
    );
}
