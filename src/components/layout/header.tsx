
"use client";

import Link from 'next/link';
import { ShoppingBag, User, LogIn, LogOut, ChefHat, ShieldCheck, ListOrdered } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { getCartItemCount, isCartReady } = useCart();
  const { user, logout, loading } = useAuth();
  const cartItemCount = isCartReady ? getCartItemCount() : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary">SutraCart</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Products
          </Link>
          
          {user && (
            <Link href="/profile/orders" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              My Orders
            </Link>
          )}
          
          {user && user.isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm font-medium flex items-center gap-1">
                  <ShieldCheck className="h-5 w-5" /> Admin
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/admin/dashboard" passHref legacyBehavior>
                  <DropdownMenuItem asChild><a>Dashboard</a></DropdownMenuItem>
                </Link>
                <Link href="/admin/orders" passHref legacyBehavior>
                  <DropdownMenuItem asChild><a>Orders</a></DropdownMenuItem>
                </Link>
                {/* Add more admin links here */}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link href="/cart" className="relative flex items-center text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            {isCartReady && cartItemCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-3 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                {cartItemCount}
              </Badge>
            )}
          </Link>
          
          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm font-medium flex items-center gap-1">
                    <User className="h-5 w-5" />
                    <span>{user.displayName || user.email?.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* My Orders link removed from here */}
                  {/* <Link href="/profile/settings" passHref legacyBehavior>
                    <DropdownMenuItem asChild><a><Settings className="mr-2 h-4 w-4" />Settings</a></DropdownMenuItem>
                  </Link> */}
                  {/* If other profile links were needed, they would go here or below the separator */}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-sm font-medium">
                  <LogIn className="h-5 w-5 mr-1" />
                  Login
                </Button>
              </Link>
            )
          )}
          {loading && (
             <div className="h-8 w-20 bg-muted rounded animate-pulse"></div> // Skeleton for user button
          )}
        </nav>
      </div>
    </header>
  );
}
