
"use client";

import type { AppUser } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (userToLogin: AppUser) => void; // Changed to accept full AppUser object
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // Simulate checking auth state on mount
    // In a real app, this would involve Firebase Auth onAuthStateChanged listener
    // And potentially fetching user data from localStorage or an API
    const storedUser = localStorage.getItem('sutraCartUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('sutraCartUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (userToLogin: AppUser) => {
    setUser(userToLogin);
    localStorage.setItem('sutraCartUser', JSON.stringify(userToLogin));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sutraCartUser');
    // Also clear admin-specific things if any in future
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
