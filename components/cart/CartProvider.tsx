"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  key: string;
  productSlug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  color: string;
  quantity: number;
};

type AddItemInput = {
  productSlug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  color: string;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (input: AddItemInput) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "shop-cart-v2";

function makeKey(productSlug: string, size: string, color: string) {
  return `${productSlug}__${size}__${color}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load any previously saved cart once, on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupt or unavailable storage — start with an empty cart
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change, but only after the initial load above has run —
  // otherwise this would immediately overwrite a saved cart with [].
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or unavailable — cart still works for this session
    }
  }, [items, hydrated]);

  const addItem = useCallback((input: AddItemInput) => {
    const key = makeKey(input.productSlug, input.size, input.color);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, quantity: i.quantity + (input.quantity ?? 1) }
            : i,
        );
      }
      return [
        ...prev,
        {
          key,
          productSlug: input.productSlug,
          name: input.name,
          price: input.price,
          compareAtPrice: input.compareAtPrice,
          size: input.size,
          color: input.color,
          quantity: input.quantity ?? 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, itemCount }),
    [items, addItem, removeItem, updateQuantity, clearCart, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
