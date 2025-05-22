
"use client";

import Link from 'next/link';
import { ShoppingBag, User, LogIn, LogOut, ChefHat } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { getCartItemCount, isCartReady } = useCart();
  const { user, logout, login } = useAuth(); // Using login to simulate for now
  const cartItemCount = isCartReady ? getCartItemCount() : 0;

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      // For now, simulate login. Later, this would redirect to /login or open a modal.
      login({ uid: 'test-user', email: 'test@example.com', displayName: 'Test User'});
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary">SutraCart</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Products
          </Link>
          <Link href="/cart" className="relative flex items-center text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            {isCartReady && cartItemCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-3 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                {cartItemCount}
              </Badge>
            )}
          </Link>
          {user ? (
            <>
              <Link href="/profile/orders" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="text-sm font-medium">
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                <LogIn className="h-5 w-5 mr-1" />
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
