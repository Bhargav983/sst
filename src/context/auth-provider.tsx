
"use client";

import type { AppUser } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (userToLogin: AppUser) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // Simulate checking auth state on mount
    const storedUser = localStorage.getItem('sutraCartUser');
    if (storedUser) {
      try {
        const parsedUser: AppUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('sutraCartUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (userToLogin: AppUser) => {
    // Ensure all expected fields are present, even if optional in AppUser type for general use
    const completeUser: AppUser = {
        uid: userToLogin.uid,
        email: userToLogin.email,
        displayName: userToLogin.displayName || null,
        phone: userToLogin.phone || null,
        isAdmin: userToLogin.isAdmin || false,
    };
    setUser(completeUser);
    localStorage.setItem('sutraCartUser', JSON.stringify(completeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sutraCartUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
