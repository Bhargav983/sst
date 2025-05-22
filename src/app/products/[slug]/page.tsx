
"use client"; 

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/main-layout';
import { getProductBySlug } from '@/data/products';
import type { Product, ProductImage, ProductVariant } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { QuantitySelector } from '@/components/quantity-selector';
import { AlertTriangle, ShoppingCart, Zap, Weight, Heart } from 'lucide-react'; // Added Heart
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useWishlist } from '@/context/wishlist-context'; // Added useWishlist

const ZOOM_PANE_WIDTH = 400;
const ZOOM_PANE_HEIGHT = 300;
const ZOOM_LEVEL = 2.5;
const LENS_WIDTH = ZOOM_PANE_WIDTH / ZOOM_LEVEL;
const LENS_HEIGHT = ZOOM_PANE_HEIGHT / ZOOM_LEVEL;

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist, isWishlistReady } = useWishlist(); // Destructure wishlist hooks

  const [showZoom, setShowZoom] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });
  const [lensPositionStyle, setLensPositionStyle] = useState({ top: 0, left: 0 });

  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      const foundProduct = getProductBySlug(slug);
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.images && foundProduct.images.length > 0) {
          setSelectedImage(foundProduct.images[0]);
        }
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          setSelectedVariant(foundProduct.variants[foundProduct.defaultVariantIndex || 0]);
        }
      } else {
        setProduct(null);
        setSelectedImage(null);
        setSelectedVariant(null);
      }
    }
  }, [slug]);

  const handleVariantChange = (variantSkuOrWeight: string) => {
    if (product && product.variants) {
      const newVariant = product.variants.find(v => v.weight === variantSkuOrWeight || v.sku === variantSkuOrWeight);
      if (newVariant) {
        setSelectedVariant(newVariant);
      }
    }
  };
  
  const handleCartAction = (isBuyNow: boolean) => {
    if (product && selectedVariant) {
      addToCart(
        { 
          ...product,
          price: selectedVariant.price, 
          weight: selectedVariant.weight, 
          variants: product.variants, 
          defaultVariantIndex: product.defaultVariantIndex,
        },
        quantity,
        selectedVariant 
      );
      if (!isBuyNow) {
        toast({
          title: "Added to cart!",
          description: `${product.name} (${selectedVariant.weight}) (x${quantity}) has been added.`,
        });
      } else {
        router.push('/checkout');
      }
    }
  };

  const handleWishlistToggle = () => {
    if (!product || !isWishlistReady) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !selectedImage) return;
    const imgContainer = imageContainerRef.current;
    const rect = imgContainer.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let lensX = x - LENS_WIDTH / 2;
    let lensY = y - LENS_HEIGHT / 2;
    lensX = Math.max(0, Math.min(lensX, imgContainer.offsetWidth - LENS_WIDTH));
    lensY = Math.max(0, Math.min(lensY, imgContainer.offsetHeight - LENS_HEIGHT));
    setLensPositionStyle({ top: lensY, left: lensX });
    setZoomCoords({ x: -lensX * ZOOM_LEVEL, y: -lensY * ZOOM_LEVEL });
  };

  const handleMouseEnter = () => { if (product && product.images.length > 0) setShowZoom(true); };
  const handleMouseLeave = () => setShowZoom(false);

  if (!product || !selectedVariant) {
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
  
  const validSelectedImageUrl = selectedImage?.url;
  const isProductInWishlist = isWishlistReady && product ? isInWishlist(product.id) : false;

  return (
    <MainLayout>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Section */}
        <div className="flex flex-col gap-4 md:sticky md:top-24 self-start">
           <div ref={imageContainerRef} className="relative">
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
                {showZoom && imageContainerRef.current && validSelectedImageUrl && (
                  <div
                    className="absolute border-2 border-primary bg-white/30 pointer-events-none"
                    style={{
                      width: `${LENS_WIDTH}px`, height: `${LENS_HEIGHT}px`,
                      top: `${lensPositionStyle.top}px`, left: `${lensPositionStyle.left}px`,
                    }}
                  />
                )}
              </div>
            </Card>
            {showZoom && validSelectedImageUrl && imageContainerRef.current && (
              <div
                className="absolute border border-gray-300 shadow-lg hidden md:block bg-no-repeat pointer-events-none z-10"
                style={{
                  width: `${ZOOM_PANE_WIDTH}px`, height: `${ZOOM_PANE_HEIGHT}px`,
                  backgroundImage: `url(${validSelectedImageUrl})`,
                  backgroundSize: `${imageContainerRef.current.offsetWidth * ZOOM_LEVEL}px ${imageContainerRef.current.offsetHeight * ZOOM_LEVEL}px`,
                  backgroundPosition: `${zoomCoords.x}px ${zoomCoords.y}px`,
                  top: `0px`, left: `calc(100% + 1rem)`,
                }}
              />
            )}
          </div>
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
                    src={image.url} alt={`${product.name} thumbnail ${index + 1}`}
                    fill sizes="10vw" data-ai-hint={image.dataAiHint || `product thumbnail ${index + 1}`}
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
          
          <div className="mb-4">
            <p className="text-2xl font-semibold text-foreground">₹{selectedVariant.price.toFixed(2)}</p>
            {selectedVariant.pricePerUnit && <p className="text-sm text-muted-foreground">{selectedVariant.pricePerUnit}</p>}
          </div>

          {product.variants.length > 1 && (
            <Card className="mb-6 shadow rounded-lg">
              <CardContent className="p-4">
                <Label className="text-md font-semibold mb-2 block flex items-center gap-2"><Weight className="h-5 w-5 text-muted-foreground" />Select Weight:</Label>
                <RadioGroup
                  value={selectedVariant.sku || selectedVariant.weight}
                  onValueChange={handleVariantChange}
                  className="flex flex-wrap gap-3"
                >
                  {product.variants.map((variant) => (
                    <Label
                      key={variant.sku || variant.weight}
                      htmlFor={variant.sku || variant.weight}
                      className={cn(
                        "flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium cursor-pointer transition-colors hover:bg-accent/80",
                        (selectedVariant.sku === variant.sku || selectedVariant.weight === variant.weight)
                          ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2"
                          : "bg-background hover:bg-accent"
                      )}
                    >
                      <RadioGroupItem value={variant.sku || variant.weight} id={variant.sku || variant.weight} className="sr-only" />
                      {variant.weight}
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}
          {!product.variants.length && selectedVariant.weight && (
             <p className="text-md text-muted-foreground mb-1">Weight: {selectedVariant.weight}</p>
          )}
          
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
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
             <Button size="lg" onClick={() => handleCartAction(false)} className="w-full sm:w-auto shadow-md flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button size="lg" onClick={() => handleCartAction(true)} variant="default" className="w-full sm:w-auto shadow-md flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Zap className="mr-2 h-5 w-5" /> Buy Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleWishlistToggle} 
              className="w-full sm:w-auto shadow-md flex-grow-0 sm:flex-grow-0" // Adjusted flex properties
              aria-label={isProductInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              disabled={!isWishlistReady}
            >
              <Heart className={cn("h-5 w-5", isProductInWishlist ? "fill-destructive text-destructive" : "text-muted-foreground")} />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
