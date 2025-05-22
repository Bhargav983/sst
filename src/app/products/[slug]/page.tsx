
"use client"; 

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/main-layout';
import { getProductBySlug } from '@/data/products';
import type { Product, ProductImage } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { QuantitySelector } from '@/components/quantity-selector';
import { AlertTriangle, ShoppingCart, Zap } from 'lucide-react'; // Added Zap for Buy Now
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ZOOM_PANE_WIDTH = 400; // Width of the zoomed image display area
const ZOOM_PANE_HEIGHT = 300; // Height of the zoomed image display area (maintaining 4:3 aspect ratio)
const ZOOM_LEVEL = 2.5; // How much to magnify the image

// Derived lens size based on zoom pane and zoom level
const LENS_WIDTH = ZOOM_PANE_WIDTH / ZOOM_LEVEL;
const LENS_HEIGHT = ZOOM_PANE_HEIGHT / ZOOM_LEVEL;

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [showZoom, setShowZoom] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 }); // For backgroundPosition of zoom pane
  const [lensPositionStyle, setLensPositionStyle] = useState({ top: 0, left: 0 }); // For lens element

  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      const foundProduct = getProductBySlug(slug);
      if (foundProduct && foundProduct.images && foundProduct.images.length > 0) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images[0]);
      } else {
        console.warn(`Product with slug "${slug}" not found or has no images.`);
        setProduct(null);
        setSelectedImage(null);
      }
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      const cartProductImage = product.images[0]?.url || 'https://placehold.co/100x100.png';
      addToCart(
        { ...product, imageUrl: cartProductImage },
        quantity
      );
      toast({
        title: "Added to cart!",
        description: `${product.name} (x${quantity}) has been added to your cart.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const cartProductImage = product.images[0]?.url || 'https://placehold.co/100x100.png';
      addToCart(
        { ...product, imageUrl: cartProductImage },
        quantity
      );
      // No toast here, directly redirect
      router.push('/checkout');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !selectedImage) return;

    const imgContainer = imageContainerRef.current;
    const rect = imgContainer.getBoundingClientRect();

    // Mouse position relative to the image container
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Calculate lens position
    let lensX = x - LENS_WIDTH / 2;
    let lensY = y - LENS_HEIGHT / 2;

    // Constrain lens within image bounds
    lensX = Math.max(0, Math.min(lensX, imgContainer.offsetWidth - LENS_WIDTH));
    lensY = Math.max(0, Math.min(lensY, imgContainer.offsetHeight - LENS_HEIGHT));
    setLensPositionStyle({ top: lensY, left: lensX });

    // Calculate backgroundPosition for zoom pane
    setZoomCoords({
      x: -lensX * ZOOM_LEVEL,
      y: -lensY * ZOOM_LEVEL,
    });
  };

  const handleMouseEnter = () => {
    if (product && product.images.length > 0) { // Only show zoom if there's an image
        setShowZoom(true);
    }
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  if (!product) { // Simplified loading/not found based on product only
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
  
  // Ensure selectedImage is valid before trying to use its URL for zoom pane
  const validSelectedImageUrl = selectedImage?.url;


  return (
    <MainLayout>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Section */}
        <div className="flex flex-col gap-4 md:sticky md:top-24 self-start">
           <div ref={imageContainerRef} className="relative"> {/* Container for main image card and zoom pane */}
            <Card className="overflow-hidden shadow-lg rounded-lg">
              <div
                className="aspect-[4/3] relative w-full cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {selectedImage && (
                  <Image
                    src={selectedImage.url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    data-ai-hint={selectedImage.dataAiHint || 'product image'}
                    className="rounded-t-lg object-cover"
                  />
                )}
                {showZoom && imageContainerRef.current && validSelectedImageUrl && ( // Lens
                  <div
                    className="absolute border-2 border-primary bg-white/30 pointer-events-none"
                    style={{
                      width: `${LENS_WIDTH}px`,
                      height: `${LENS_HEIGHT}px`,
                      top: `${lensPositionStyle.top}px`,
                      left: `${lensPositionStyle.left}px`,
                    }}
                  />
                )}
              </div>
            </Card>
            
            {/* Zoom Pane */}
            {showZoom && validSelectedImageUrl && imageContainerRef.current && (
              <div
                className="absolute border border-gray-300 shadow-lg hidden md:block bg-no-repeat pointer-events-none z-10"
                style={{
                  width: `${ZOOM_PANE_WIDTH}px`,
                  height: `${ZOOM_PANE_HEIGHT}px`,
                  backgroundImage: `url(${validSelectedImageUrl})`,
                  backgroundSize: `${imageContainerRef.current.offsetWidth * ZOOM_LEVEL}px ${imageContainerRef.current.offsetHeight * ZOOM_LEVEL}px`,
                  backgroundPosition: `${zoomCoords.x}px ${zoomCoords.y}px`,
                  top: `0px`,
                  left: `calc(100% + 1rem)`, // Position to the right of the image card container
                }}
              />
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={cn(
                    "aspect-square relative rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all",
                    selectedImage?.url === image.url ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border hover:border-primary/70'
                  )}
                  aria-label={`View image ${index + 1} of ${product.name}`}
                >
                  <Image
                    src={image.url} 
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="10vw"
                    data-ai-hint={image.dataAiHint || `product thumbnail ${index + 1}`}
                    className="rounded object-cover"
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
             <Button size="lg" onClick={handleAddToCart} className="w-full sm:w-auto shadow-md flex-1 sm:flex-none">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button size="lg" onClick={handleBuyNow} variant="default" className="w-full sm:w-auto shadow-md flex-1 sm:flex-none bg-accent hover:bg-accent/90 text-accent-foreground">
              <Zap className="mr-2 h-5 w-5" /> Buy Now
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
