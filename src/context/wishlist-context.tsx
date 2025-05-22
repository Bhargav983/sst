
"use client";

import React, { createContext, ReactNode, useEffect, useContext } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Product } from '@/types'; // Assuming Product type has an 'id'

interface WishlistContextType {
  wishlistItems: string[]; // Array of product IDs
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistReady: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useLocalStorage<string[]>('sutraWishlist', []);
  const [isWishlistReady, setIsWishlistReady] = React.useState(false);

  useEffect(() => {
    setIsWishlistReady(true);
  }, []);

  const addToWishlist = (productId: string) => {
    setWishlistItems(prevItems => {
      if (!prevItems.includes(productId)) {
        return [...prevItems, productId];
      }
      return prevItems;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => prevItems.filter(id => id !== productId));
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.includes(productId);
  };
  
  if (!isWishlistReady) {
    return null; 
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isWishlistReady,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
