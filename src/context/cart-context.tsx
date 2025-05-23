
"use client";

import React, { createContext, ReactNode, useEffect } from 'react';
import type { Product, CartItem, ProductVariant } from '@/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { useAuth } from './auth-provider'; // Removed import as it's not used directly here after wholesale removal

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, selectedVariant: ProductVariant) => void;
  removeFromCart: (productId: string, variantSku?: string) => void; 
  updateQuantity: (productId: string, newQuantity: number, variantSku?: string) => void;
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

  const addToCart = (product: Product, quantity: number, selectedVariant: ProductVariant) => {
    if (quantity <= 0 || !selectedVariant) return;

    setCartItems(prevItems => {
      const itemIdentifier = selectedVariant.sku || `${product.id}-${selectedVariant.weight}`;
      const existingItem = prevItems.find(item => (item.variantSku || `${item.id}-${item.weight}`) === itemIdentifier);
      
      const priceToUse = selectedVariant.price; // Always use retail price now

      if (existingItem) {
        return prevItems.map(item =>
          (item.variantSku || `${item.id}-${item.weight}`) === itemIdentifier
            ? { ...item, quantity: item.quantity + quantity, price: priceToUse } // Ensure price is updated if it could change
            : item
        );
      }
      return [...prevItems, { 
        id: product.id, 
        variantSku: selectedVariant.sku,
        name: product.name, 
        price: priceToUse, 
        quantity, 
        imageUrl: product.images[0]?.url || 'https://placehold.co/100x100.png',
        weight: selectedVariant.weight,
        originalRetailPrice: selectedVariant.price, // Store original retail for reference
      }];
    });
  };

  const removeFromCart = (productId: string, variantSku?: string) => {
    setCartItems(prevItems => prevItems.filter(item => {
      const itemIdentifier = item.variantSku || `${item.id}-${item.weight}`;
      const targetIdentifier = variantSku || `${productId}-${item.weight}`; // Construct similar identifier for target
      if(variantSku){
        return item.variantSku !== variantSku;
      }
      return itemIdentifier !== targetIdentifier;
    }));
  };
  
  const updateQuantity = (productId: string, newQuantity: number, variantSku?: string) => {
     if (newQuantity <= 0) {
      removeFromCart(productId, variantSku);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        const currentItemIdentifier = item.variantSku || `${item.id}-${item.weight}`;
        const targetIdentifier = variantSku || `${productId}-${item.weight}`; 

        if (currentItemIdentifier === targetIdentifier) {
          const priceToUse = item.originalRetailPrice || item.price; // Use stored original retail price
          return { ...item, quantity: newQuantity, price: priceToUse };
        }
        return item;
      })
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
