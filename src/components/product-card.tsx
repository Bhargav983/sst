
"use client"; 

import Link from 'next/link';
import Image from 'next/image';
import type { Product, ProductVariant } from '@/types'; // Added ProductVariant
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react'; 
import { useCart } from '@/context/cart-context'; 
import { useToast } from '@/hooks/use-toast'; 

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

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
      { // Constructing a temporary object that matches Product type for addToCart
        ...product,
        price: defaultVariant.price, 
        weight: defaultVariant.weight,
        variants: product.variants,
        defaultVariantIndex: product.defaultVariantIndex,
      }, 
      1,
      defaultVariant // Pass selected variant for clarity
    ); 
    toast({
      title: "Added to cart!",
      description: `${product.name} (${defaultVariant.weight}) (x1) has been added.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} legacyBehavior passHref>
          <a className="block aspect-[4/3] relative overflow-hidden group">
            <Image
              src={firstImage.url}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
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
        
        <div className="mt-auto pt-2 flex justify-between items-center"> 
          {defaultVariant ? (
            <p className="text-lg font-bold text-primary">
              {product.variants.length > 1 ? 'From ' : ''}₹{defaultVariant.price.toFixed(2)}
            </p>
          ) : (
            <p className="text-lg font-bold text-primary">N/A</p>
          )}
          <Button variant="outline" size="sm" onClick={handleAddToCart} disabled={!defaultVariant}>
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
