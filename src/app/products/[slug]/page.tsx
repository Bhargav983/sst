
"use client"; 

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/main-layout';
import { getProductBySlug } from '@/data/products';
import type { Product, ProductImage } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { QuantitySelector } from '@/components/quantity-selector';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      const foundProduct = getProductBySlug(slug);
      if (foundProduct && foundProduct.images && foundProduct.images.length > 0) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images[0]); // Set initial selected image
      } else {
        console.warn(`Product with slug "${slug}" not found or has no images.`);
        setProduct(null);
        setSelectedImage(null);
      }
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      // For CartItem, we need a single imageUrl. We'll use the first one.
      const cartProductImage = product.images[0]?.url || 'https://placehold.co/100x100.png';
      
      addToCart(
        { ...product, imageUrl: cartProductImage }, // Spread product and add/override imageUrl for CartItem type
        quantity
      );
      toast({
        title: "Added to cart!",
        description: `${product.name} (x${quantity}) has been added to your cart.`,
      });
    }
  };

  if (!product || !selectedImage) {
    // Basic loading/not found state
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center text-center py-10">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">Sorry, we couldn't find the product you're looking for or it has no images.</p>
          <Button onClick={() => router.push('/')}>Go to Homepage</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Section */}
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden shadow-lg rounded-lg">
            <div className="aspect-[4/3] relative w-full">
              <Image
                src={selectedImage.url}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint={selectedImage.dataAiHint || 'product image'}
                className="rounded-t-lg"
              />
            </div>
          </Card>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={cn(
                    "aspect-square relative rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all",
                    selectedImage.url === image.url ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border hover:border-primary/70'
                  )}
                  aria-label={`View image ${index + 1} of ${product.name}`}
                >
                  <Image
                    src={image.url} 
                    alt={`${product.name} thumbnail ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={image.dataAiHint || `product thumbnail ${index + 1}`}
                    className="rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info Section */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3">{product.name}</h1>
          <p className="text-xl font-semibold text-foreground mb-3">₹{product.price.toFixed(2)}</p>
          <p className="text-md text-muted-foreground mb-1">Weight: {product.weight}</p>
          {product.category && <p className="text-sm text-accent mb-4">Category: {product.category}</p>}
          
          <Card className="bg-secondary/30 mb-6 shadow rounded-lg">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-foreground/80 leading-relaxed">{product.longDescription || product.description}</p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
            <Button size="lg" onClick={handleAddToCart} className="w-full sm:w-auto shadow-md">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
