
"use client";

import React, { createContext, ReactNode, useEffect } from 'react';
import type { Product, CartItem } from '@/types'; // Product type is needed for addToCart
import useLocalStorage from '@/hooks/use-local-storage';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product & { imageUrl: string }, quantity: number) => void; // Modified Product type
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isCartReady: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('sutraCart', []);
  const [isCartReady, setIsCartReady] = React.useState(false);

  useEffect(() => {
    setIsCartReady(true);
  }, []);

  // Product for addToCart now expects an imageUrl directly, 
  // as Product type itself might not have a single imageUrl after recent changes.
  const addToCart = (product: Product & { imageUrl: string }, quantity: number) => {
    if (quantity <= 0) return;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity, 
        imageUrl: product.imageUrl, // Use the passed imageUrl
        weight: product.weight
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  if (!isCartReady) {
    // You can return a loader here if needed, or null
    return null; 
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        isCartReady,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
