
"use client"; // This page needs client-side interactivity for adding to cart

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/main-layout';
import { getProductBySlug } from '@/data/products';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { QuantitySelector } from '@/components/quantity-selector';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      const foundProduct = getProductBySlug(slug);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Handle product not found, e.g., redirect or show 404 message
        // For now, just log and set product to null
        console.warn(`Product with slug "${slug}" not found.`);
        setProduct(null); 
      }
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart!",
        description: `${product.name} (x${quantity}) has been added to your cart.`,
      });
    }
  };

  if (!product) {
    // Basic loading/not found state
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center text-center py-10">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Button onClick={() => router.push('/')}>Go to Homepage</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <Card className="overflow-hidden shadow-lg">
          <div className="aspect-[4/3] relative w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint={product.dataAiHint || 'spice product detail'}
            />
          </div>
        </Card>
        
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3">{product.name}</h1>
          <p className="text-xl font-semibold text-foreground mb-3">${product.price.toFixed(2)}</p>
          <p className="text-md text-muted-foreground mb-1">Weight: {product.weight}</p>
          {product.category && <p className="text-sm text-accent mb-4">Category: {product.category}</p>}
          
          <Card className="bg-secondary/30 mb-6">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-foreground/80 leading-relaxed">{product.longDescription || product.description}</p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
            <Button size="lg" onClick={handleAddToCart} className="w-full sm:w-auto">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
