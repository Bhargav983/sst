
"use client";

import Link from 'next/link';
import { ShoppingBag, User, LogIn, LogOut, ChefHat, ShieldCheck, Settings, ListOrdered, Heart, Home } from 'lucide-react'; // Added Home
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-provider';
import { useWishlist } from '@/context/wishlist-context';
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
  const { getCartItemCount, isCartReady: isCartContextReady } = useCart();
  const { user, logout, loading: authLoading, role } = useAuth(); // Added role
  const { wishlistItems, isWishlistReady: isWishlistContextReady } = useWishlist();

  const isCartReady = isCartContextReady;
  const isWishlistReady = isWishlistContextReady;
  
  const cartItemCount = isCartReady ? getCartItemCount() : 0;
  const wishlistItemCount = isWishlistReady ? wishlistItems.length : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary">SutraCart</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors" aria-label="Home">
            <Home className="h-5 w-5" />
          </Link>
          <Link href="/products" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Products
          </Link>
          
          {user && (
            <Link href="/profile/orders" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors hidden md:flex items-center gap-1">
               <ListOrdered className="h-5 w-5 " />
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

          <Link href="/wishlist" className="relative flex items-center text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
            {isWishlistReady && wishlistItemCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-3 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full text-accent-foreground bg-accent">
                {wishlistItemCount}
              </Badge>
            )}
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
          
          {!authLoading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm font-medium flex items-center gap-1">
                    <User className="h-5 w-5" />
                    <span>{user.displayName || user.email?.split('@')[0]}</span>
                     {user.role && user.role !== 'retail' && (
                        <Badge variant="outline" className="ml-1 text-xs capitalize">
                          {user.role}
                        </Badge>
                      )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/profile/settings" passHref legacyBehavior>
                    <DropdownMenuItem asChild>
                      <a><Settings className="mr-2 h-4 w-4" />My Account</a>
                    </DropdownMenuItem>
                  </Link>
                   {/* My Orders link for mobile, visible in dropdown */}
                  <Link href="/profile/orders" passHref legacyBehavior>
                    <DropdownMenuItem asChild className="md:hidden">
                      <a><ListOrdered className="mr-2 h-4 w-4" />My Orders</a>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
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
          {authLoading && (
             <div className="h-8 w-20 bg-muted rounded animate-pulse"></div> 
          )}
        </nav>
      </div>
    </header>
  );
}
