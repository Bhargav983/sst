
"use client";

import type { AppUser } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (mockUser?: AppUser) => void;
  logout: () => void;
  // Add other auth functions like signUp, signInWithGoogle etc. later
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true); // Initially true to simulate loading

  // Simulate fetching user state on mount
  useEffect(() => {
    // In a real app, you'd check Firebase Auth state here
    // For now, assume no user is logged in initially
    setLoading(false);
  }, []);

  const login = (mockUser?: AppUser) => {
    // Simulate login
    const defaultMockUser: AppUser = { uid: 'mock-user-uid', email: 'user@example.com', displayName: 'Mock User' };
    setUser(mockUser || defaultMockUser);
  };

  const logout = () => {
    // Simulate logout
    setUser(null);
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
