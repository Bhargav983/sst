
"use client";

import React, { createContext, ReactNode, useEffect } from 'react';
import type { Product, CartItem, ProductVariant } from '@/types';
import useLocalStorage from '@/hooks/use-local-storage';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, selectedVariant: ProductVariant) => void;
  removeFromCart: (productId: string, variantSku?: string) => void; // Allow removing specific variant if Sku is used
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
      // If variants have unique SKUs, use that for existing item check. Otherwise, product ID + weight.
      const itemIdentifier = selectedVariant.sku || `${product.id}-${selectedVariant.weight}`;
      const existingItem = prevItems.find(item => (item.variantSku || `${item.id}-${item.weight}`) === itemIdentifier);

      if (existingItem) {
        return prevItems.map(item =>
          (item.variantSku || `${item.id}-${item.weight}`) === itemIdentifier
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { 
        id: product.id, 
        variantSku: selectedVariant.sku,
        name: product.name, 
        price: selectedVariant.price, 
        quantity, 
        imageUrl: product.images[0]?.url || 'https://placehold.co/100x100.png', // Default image
        weight: selectedVariant.weight
      }];
    });
  };

  const removeFromCart = (productId: string, variantSku?: string) => {
    setCartItems(prevItems => prevItems.filter(item => {
      if (variantSku) return item.variantSku !== variantSku; // If Sku provided, match only Sku
      if (item.variantSku) return item.id !== productId; // If item has Sku but no Sku provided for removal, don't remove unless ID matches (should be more specific)
      return item.id !== productId; // Fallback for items without Sku (might remove all variants of a product)
      // For more precise removal without SKU, you'd need to pass weight or another identifier.
      // For now, this prioritizes SKU if available.
    }));
  };
  
  // Simplified updateQuantity for this iteration, might need SKU for more specific variant updates
  const updateQuantity = (productId: string, newQuantity: number, variantSku?: string) => {
     const itemIdentifier = variantSku || productId; // Simplified identifier
     if (newQuantity <= 0) {
      // This removal logic needs to be more precise if multiple variants of same product ID exist
      // For now, if SKU is passed, it will try to remove that specific SKU
      // Otherwise, it might remove all items matching productId if no SKU
      setCartItems(prevItems => prevItems.filter(item => 
          (variantSku && item.variantSku === variantSku) ? false :
          (!variantSku && item.id === productId) ? false :
          true
      ));
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        const currentItemIdentifier = item.variantSku || `${item.id}-${item.weight}`;
        const targetIdentifier = variantSku || `${productId}-${item.weight}`; // Attempt to match by sku or id+weight

        if (currentItemIdentifier === targetIdentifier) {
          return { ...item, quantity: newQuantity };
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
