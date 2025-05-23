
"use client";

import type { AppUser, ShippingAddress } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (userToLogin: AppUser) => void;
  logout: () => void;
  addAddress: (newAddress: Omit<ShippingAddress, 'id'> & { label: string }) => void;
  // Future: updateAddress, deleteAddress
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('sutraCartUser');
    if (storedUser) {
      try {
        const parsedUser: AppUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          role: parsedUser.role === 'wholesale' ? 'retail' : parsedUser.role, // Convert old wholesale to retail
          addresses: parsedUser.addresses || [] 
        });
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('sutraCartUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (userToLogin: AppUser) => {
    const completeUser: AppUser = {
        uid: userToLogin.uid,
        email: userToLogin.email,
        displayName: userToLogin.displayName || null,
        phone: userToLogin.phone || null,
        isAdmin: userToLogin.isAdmin || false,
        role: userToLogin.role === 'wholesale' ? 'retail' : (userToLogin.role || 'retail'), // Ensure role is set, default to retail
        addresses: userToLogin.addresses || [],
    };
    setUser(completeUser);
    localStorage.setItem('sutraCartUser', JSON.stringify(completeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sutraCartUser');
  };

  const addAddress = (newAddressData: Omit<ShippingAddress, 'id'> & { label: string }) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const newAddressWithId: ShippingAddress = {
        ...newAddressData,
        id: `addr_${Date.now().toString()}` 
      };
      const updatedUser = {
        ...currentUser,
        addresses: [...(currentUser.addresses || []), newAddressWithId],
      };
      localStorage.setItem('sutraCartUser', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, addAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
