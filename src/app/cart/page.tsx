
"use client";

import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { useCart } from '@/context/cart-context';
import { CartItemDisplay } from '@/components/cart-item-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { cartItems, getCartTotal, getCartItemCount, clearCart, isCartReady } = useCart();
  const cartTotal = getCartTotal();
  const itemCount = getCartItemCount();

  if (!isCartReady) {
     return (
      <MainLayout>
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">Loading cart...</p>
        </div>
      </MainLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any delicious pastes yet.</p>
          <Link href="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {cartItems.map(item => (
                <CartItemDisplay key={item.id} item={item} />
              ))}
            </CardContent>
            <CardFooter className="flex justify-end p-4">
               <Button variant="outline" onClick={clearCart} disabled={cartItems.length === 0}>
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 p-4">
              <Link href="/checkout" className="w-full">
                <Button size="lg" className="w-full">Proceed to Checkout</Button>
              </Link>
              <Link href="/products" className="w-full">
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
