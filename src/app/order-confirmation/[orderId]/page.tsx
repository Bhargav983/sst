
"use client";

import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-lg text-center shadow-xl">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Thank You For Your Order!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-foreground/80">
              Your order has been placed successfully.
            </p>
            <p className="text-md text-muted-foreground">
              Your Order ID is: <span className="font-semibold text-foreground">{orderId}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly with your order details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/products" legacyBehavior passHref>
                <Button asChild size="lg">
                  <a>Continue Shopping</a>
                </Button>
              </Link>
              <Link href="/profile/orders" legacyBehavior passHref>
                 <Button asChild variant="outline" size="lg">
                  <a>View My Orders</a>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
