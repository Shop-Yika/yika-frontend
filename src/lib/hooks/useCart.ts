'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    brand: string;
    imageUrl: string;
    pricePerDay: number;
    startDate: string; // ISO string
    endDate: string;   // ISO string
    rentalDays: number;
    totalPrice: number;
}

const STORAGE_KEY = 'yika_cart';

function loadCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCart(items: CartItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        setItems(loadCart());
    }, []);

    const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
        setItems((prev) => {
            const next = [...prev, { ...item, id: `${item.productId}-${Date.now()}` }];
            saveCart(next);
            return next;
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => {
            const next = prev.filter((i) => i.id !== id);
            saveCart(next);
            return next;
        });
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const itemCount = items.reduce((acc) => acc + 1, 0);
    const subtotal  = items.reduce((acc, i) => acc + i.totalPrice, 0);

    return { items, addItem, removeItem, clearCart, itemCount, subtotal };
}
