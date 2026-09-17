"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string; 
  productId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    const id = `${newItem.productId}-${newItem.color}-${newItem.size}`;
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.id === id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...currentItems, { ...newItem, id }];
    });
    setIsCartOpen(true); 
  };

  const clearCart = () => setItems([]);

  const removeItem = (id: string) => {
    setItems(items => items.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems(items => items.map(item => item.id === id ? { ...item, quantity } : item));
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity,
    clearCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
