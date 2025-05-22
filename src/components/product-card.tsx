
"use client"; 

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Zap, Heart } from 'lucide-react'; 
import { useCart } from '@/context/cart-context'; 
import { useToast } from '@/hooks/use-toast'; 
import { useWishlist } from '@/context/wishlist-context';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onItemAddedToCart?: (productId: string) => void;
}

export function ProductCard({ product, onItemAddedToCart }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist, isWishlistReady } = useWishlist();
  const router = useRouter();

  const defaultVariant = product.variants[product.defaultVariantIndex || 0] || product.variants[0];

  const firstImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : { url: 'https://placehold.co/600x400.png', dataAiHint: 'placeholder product' };

  const handleAddToCart = () => {
    if (!defaultVariant) {
        toast({
            title: "Error",
            description: "Product variant not available.",
            variant: "destructive"
        });
        return;
    }
    addToCart(
      { 
        ...product,
        price: defaultVariant.price, 
        weight: defaultVariant.weight,
        variants: product.variants,
        defaultVariantIndex: product.defaultVariantIndex,
      }, 
      1,
      defaultVariant 
    ); 
    toast({
      title: "Added to cart!",
      description: `${product.name} (${defaultVariant.weight}) (x1) has been added.`,
    });
    onItemAddedToCart?.(product.id);
  };

  const handleBuyNow = () => {
    if (!defaultVariant) {
        toast({
            title: "Error",
            description: "Product variant not available.",
            variant: "destructive"
        });
        return;
    }
    addToCart(
      { 
        ...product,
        price: defaultVariant.price, 
        weight: defaultVariant.weight,
        variants: product.variants,
        defaultVariantIndex: product.defaultVariantIndex,
      }, 
      1,
      defaultVariant 
    ); 
    toast({
      title: "Added to cart!",
      description: `${product.name} (${defaultVariant.weight}) (x1) added. Redirecting to checkout...`,
    });
    onItemAddedToCart?.(product.id);
    router.push('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!isWishlistReady || !product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} removed from your wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} added to your wishlist.`,
      });
    }
  };
  
  const isProductInWishlist = isWishlistReady && product ? isInWishlist(product.id) : false;

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} legacyBehavior passHref>
          <a className="block aspect-[4/3] relative overflow-hidden group">
            <Image
              src={firstImage.url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="transition-transform duration-300 group-hover:scale-105 object-cover"
              data-ai-hint={firstImage.dataAiHint || 'spice product'}
            />
          </a>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow"> 
        <div className="flex-grow"> 
          <Link href={`/products/${product.slug}`} legacyBehavior passHref>
            <a>
              <CardTitle className="text-lg font-semibold mb-1 hover:text-primary transition-colors line-clamp-2">{product.name}</CardTitle>
            </a>
          </Link>
          {defaultVariant && <p className="text-sm text-muted-foreground mb-1">{defaultVariant.weight}</p> }
          <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{product.description}</p>
        </div>
        
        <div className="mt-auto pt-2"> {/* Container for price and action buttons */}
          {defaultVariant ? (
            <p className="text-lg font-bold text-primary mb-2">
              {product.variants.length > 1 ? 'From ' : ''}₹{defaultVariant.price.toFixed(2)}
            </p>
          ) : (
            <p className="text-lg font-bold text-primary mb-2">N/A</p>
          )}

          <div className="flex items-center gap-2">
            <div className="flex-grow flex gap-2"> {/* For Add to Cart and Buy Now */}
              <Button
                variant="default"
                size="sm"
                onClick={handleAddToCart}
                disabled={!defaultVariant}
                className="flex-1"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart className="mr-1.5 h-4 w-4" /> Add
              </Button>
              <Button
                size="sm"
                onClick={handleBuyNow}
                disabled={!defaultVariant}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                aria-label={`Buy ${product.name} now`}
              >
                <Zap className="mr-1.5 h-4 w-4" /> Buy Now
              </Button>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleWishlistToggle}
              aria-label={isProductInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              disabled={!isWishlistReady}
              className="shrink-0 p-2" // Added p-2 for slightly larger icon tap target if needed
            >
              <Heart className={cn("h-4 w-4", isProductInWishlist ? "fill-destructive text-destructive" : "text-muted-foreground")} />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Link href={`/products/${product.slug}`} legacyBehavior passHref>
          <Button asChild variant="outline" className="w-full">
            <a>View Details <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
