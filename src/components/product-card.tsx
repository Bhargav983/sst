
"use client"; // Converted to client component

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react'; // Added ShoppingCart
import { useCart } from '@/context/cart-context'; // Added for cart functionality
import { useToast } from '@/hooks/use-toast'; // Added for notifications

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product, 1); // Add 1 unit of the product
    toast({
      title: "Added to cart!",
      description: `${product.name} (x1) has been added to your cart.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} legacyBehavior passHref>
          <a className="block aspect-[4/3] relative overflow-hidden group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.dataAiHint || 'spice product'}
            />
          </a>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow"> {/* Make CardContent a flex column and grow */}
        <div className="flex-grow"> {/* Wrapper for top content that should take available space */}
          <Link href={`/products/${product.slug}`} legacyBehavior passHref>
            <a>
              <CardTitle className="text-lg font-semibold mb-1 hover:text-primary transition-colors line-clamp-2">{product.name}</CardTitle>
            </a>
          </Link>
          <p className="text-sm text-muted-foreground mb-1">{product.weight}</p> {/* Weight displayed below name */}
          <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{product.description}</p> {/* Description with line clamping */}
        </div>
        
        <div className="mt-auto pt-2 flex justify-between items-center"> {/* This div is pushed to the bottom */}
          <p className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</p>
          <Button variant="outline" size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
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
