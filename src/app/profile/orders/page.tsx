
"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-provider';
import { ListOrdered, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderHistoryPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">Loading orders...</p>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
       <MainLayout>
        <div className="flex flex-col items-center justify-center text-center py-20">
            <AlertCircle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">Please log in to view your order history.</p>
            <Link href="/login">
                <Button>Login</Button>
            </Link>
        </div>
      </MainLayout>
    );
  }
  
  // Placeholder data - replace with actual order fetching later
  const mockOrders = [
    { id: 'SUTRA-12345', date: '2023-10-26', total: 45.99, status: 'Delivered', items: 3 },
    { id: 'SUTRA-67890', date: '2023-11-05', total: 28.50, status: 'Shipped', items: 2 },
  ];


  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        {mockOrders.length === 0 ? (
          <Card className="text-center py-10 shadow">
            <CardHeader>
                <ListOrdered className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-2xl">No Orders Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">You haven't placed any orders with us yet. Ready to find your new favorite paste?</p>
                <Link href="/products">
                    <Button>Start Shopping</Button>
                </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {mockOrders.map(order => (
              <Card key={order.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">Placed on: {order.date}</p>
                  </div>
                   <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} 
                     className={order.status === 'Delivered' ? 'bg-green-500 text-white' : ''}>
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm">
                    <span>Items: {order.items}</span>
                    <span className="font-semibold">Total: ₹{order.total.toFixed(2)}</span>
                  </div>
                  {/* Later: Display items or link to order details */}
                </CardContent>
                <CardFooter>
                    <Button variant="link" className="p-0 h-auto">View Details</Button> 
                    {/* This will link to /profile/orders/[orderId] eventually */}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
