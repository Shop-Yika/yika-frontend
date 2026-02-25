'use client';

import { useState, useEffect } from 'react';

const LIKED_ITEMS_KEY = 'likedItems';

/**
 * Custom hook for managing liked/favorited items
 *
 * Current: Uses localStorage for guest users
 * Future: Will sync with backend when user logs in
 */
export function useLikedItems() {
    const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
    const [isLoaded, setIsLoaded] = useState(false);

    // Load liked items from localStorage on mount
    useEffect(() => {
        loadFromLocalStorage();
    }, []);

    // Save to localStorage whenever likedItems changes
    useEffect(() => {
        if (isLoaded) {
            saveToLocalStorage();
        }
    }, [likedItems, isLoaded]);

    const loadFromLocalStorage = () => {
        try {
            const stored = localStorage.getItem(LIKED_ITEMS_KEY);
            if (stored) {
                const items = JSON.parse(stored);
                setLikedItems(new Set(items));
            }
        } catch (error) {
            console.error('Error loading liked items from localStorage:', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const saveToLocalStorage = () => {
        try {
            localStorage.setItem(
                LIKED_ITEMS_KEY,
                JSON.stringify(Array.from(likedItems))
            );
        } catch (error) {
            console.error('Error saving liked items to localStorage:', error);
        }
    };

    const toggleLike = (itemId: string) => {
        setLikedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const isLiked = (itemId: string): boolean => {
        return likedItems.has(itemId);
    };

    const getLikedItemsArray = (): string[] => {
        return Array.from(likedItems);
    };

    const clearAllLikes = () => {
        setLikedItems(new Set());
        localStorage.removeItem(LIKED_ITEMS_KEY);
    };

    // Get all liked items count
    const getLikedCount = (): number => {
        return likedItems.size;
    };

    return {
        likedItems: getLikedItemsArray(),
        likedCount: getLikedCount(),
        toggleLike,
        isLiked,
        clearAllLikes,
        isLoaded,
    };
}