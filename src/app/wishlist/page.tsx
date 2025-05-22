
"use client";

import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { useWishlist } from '@/context/wishlist-context';
import { getProductById } from '@/data/products';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product-card'; 
import { Button } from '@/components/ui/button';
import { HeartOff, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isWishlistReady } = useWishlist();
  const { toast } = useToast(); // Initialize useToast
  
  if (!isWishlistReady) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">Loading wishlist...</p>
        </div>
      </MainLayout>
    );
  }

  const wishedProducts: Product[] = wishlistItems
    .map(productId => getProductById(productId))
    .filter((product): product is Product => product !== undefined);

  const handleItemAddedToCartFromWishlist = (productId: string) => {
    const product = getProductById(productId);
    removeFromWishlist(productId);
    if (product) {
      toast({
        title: "Moved to Cart",
        description: `${product.name} has been moved from your wishlist to your cart.`,
      });
    }
  };

  if (wishedProducts.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <HeartOff className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-semibold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any products to your wishlist yet.</p>
          <Link href="/products">
            <Button size="lg" className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Start Shopping
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-8">Your Wishlist ({wishedProducts.length})</h1>
      
      {wishedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishedProducts.map(product => (
            <Card key={product.id} className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full group/wishlist-item">
                <ProductCard 
                  product={product} 
                  onItemAddedToCart={() => handleItemAddedToCartFromWishlist(product.id)} // Pass the callback
                />
                <div className="p-4 border-t mt-auto">
                    <Button 
                        variant="outline" 
                        className="w-full text-destructive hover:bg-destructive/10 border-destructive/50 hover:text-destructive"
                        onClick={() => removeFromWishlist(product.id)}
                    >
                        <HeartOff className="mr-2 h-4 w-4" /> Remove from Wishlist
                    </Button>
                </div>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
