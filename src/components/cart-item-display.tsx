
"use client";

import Image from 'next/image';
import type { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from '@/components/quantity-selector';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';
import { getProductById } from '@/data/products';


interface CartItemDisplayProps {
  item: CartItem;
}

export function CartItemDisplay({ item }: CartItemDisplayProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const productDetails = getProductById(item.id);


  return (
    <div className="flex items-start gap-4 py-4 border-b last:border-b-0">
      <Link href={`/products/${productDetails?.slug || item.id}`} className="shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={100}
          height={100}
          className="rounded-md object-cover aspect-square border"
          data-ai-hint={productDetails?.dataAiHint || 'cart item'}
        />
      </Link>
      <div className="flex-grow">
        <Link href={`/products/${productDetails?.slug || item.id}`}>
          <h3 className="text-lg font-semibold hover:text-primary transition-colors">{item.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">{item.weight}</p>
        <p className="text-md font-medium text-primary my-1">${item.price.toFixed(2)}</p>
        <div className="mt-2">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(newQuantity) => updateQuantity(item.id, newQuantity)}
          />
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full ml-auto">
        <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeFromCart(item.id)}
          className="text-muted-foreground hover:text-destructive"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
