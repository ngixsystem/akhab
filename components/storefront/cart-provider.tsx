"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  title: string;
  slug: string;
  quantity: number;
  price?: number | null;
  photo?: string | null;
  productType: string;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "planner-cart";

export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem: (incoming) =>
        setItems((current) => {
          const exists = current.find((item) => item.productId === incoming.productId);
          if (exists) {
            return current.map((item) =>
              item.productId === incoming.productId
                ? { ...item, quantity: item.quantity + incoming.quantity }
                : item
            );
          }
          return [...current, incoming];
        }),
      removeItem: (productId) =>
        setItems((current) => current.filter((item) => item.productId !== productId)),
      updateQuantity: (productId, quantity) =>
        setItems((current) =>
          current.map((item) =>
            item.productId === productId ? { ...item, quantity: Math.max(quantity, 1) } : item
          )
        ),
      clear: () => setItems([])
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider.");
  return context;
}
