
"use client";

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-provider';
import { ListOrdered, AlertCircle, ShoppingBag, CalendarDays, Tag } from 'lucide-react';
import Link from 'next/link';
import type { Order, StatusHistoryEntry } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Enhanced mock orders with status history
const generateUserMockOrders = (): Order[] => {
  const baseDate = new Date();
  return [
    { 
      id: 'SUTRA-USER-12345', 
      createdAt: new Date(baseDate.setDate(baseDate.getDate() - 10)), 
      totalAmount: 45.99, 
      status: 'Delivered', 
      items: [
        { id: '1', name: 'Andhra Chilli Paste', price: 12.99, quantity: 1, imageUrl: 'https://placehold.co/40x40.png', weight: '250g' },
        { id: '2', name: 'Kerala Coconut Curry Paste', price: 14.50, quantity: 2, imageUrl: 'https://placehold.co/40x40.png', weight: '250g' },
      ],
      itemSummary: 'Andhra Chilli Paste (x1), Kerala Coconut Curry Paste (x2)',
      customerInfo: {
        fullName: 'Current User', email: 'user@example.com', phone: '9998887770', 
        addressLine1: '123 User Lane', city: 'UserCity', state: 'UserState', postalCode: '10001', country: 'India'
      },
      subtotal: 42.49, shippingCost: 3.50, paymentStatus: 'Paid',
      updatedAt: new Date(baseDate.setDate(baseDate.getDate() - 2)),
      statusHistory: [
        { status: 'Pending', timestamp: new Date(baseDate.setDate(baseDate.getDate() - 10)) },
        { status: 'Processing', timestamp: new Date(baseDate.setDate(baseDate.getDate() - 9)) },
        { status: 'Shipped', timestamp: new Date(baseDate.setDate(baseDate.getDate() - 5)) },
        { status: 'Delivered', timestamp: new Date(baseDate.setDate(baseDate.getDate() - 2)) },
      ]
    },
    { 
      id: 'SUTRA-USER-67890', 
      createdAt: new Date(baseDate.setDate(baseDate.getDate() - 5)), 
      totalAmount: 28.50, 
      status: 'Shipped', 
      items: [
         { id: '3', name: 'Tamilian Tamarind Paste', price: 10.99, quantity: 1, imageUrl: 'https://placehold.co/40x40.png', weight: '200g' },
         { id: '4', name: 'Karnataka Garlic-Ginger Paste', price: 9.99, quantity: 1, imageUrl: 'https://placehold.co/40x40.png', weight: '200g' },
      ],
      itemSummary: 'Tamilian Tamarind Paste (x1), Karnataka Garlic-Ginger Paste (x1)',
      customerInfo: {
        fullName: 'Current User', email: 'user@example.com', phone: '9998887770',
        addressLine1: '123 User Lane', city: 'UserCity', state: 'UserState', postalCode: '10001', country: 'India'
      },
      subtotal: 20.98, shippingCost: 7.52, paymentStatus: 'Paid',
      updatedAt: new Date(baseDate.setDate(baseDate.getDate() - 1)),
      statusHistory: [
        { status: 'Pending', timestamp: new Date(baseDate.setDate(baseDate.getDate() - 5)) },
        { status: 'Processing', timestamp: new Date(baseDate.setDate(baseDate.getDate() - 4)) },
        { status: 'Shipped', timestamp: new Date(baseDate.setDate(baseDate.getDate() - 1)) },
      ]
    },
  ];
};


export default function OrderHistoryPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      // In a real app, fetch orders for 'user.uid' from a backend.
      // For now, using mock data and storing it for detail page access.
      const userOrders = generateUserMockOrders();
      setOrders(userOrders);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userMockOrders', JSON.stringify(userOrders));
      }
    }
  }, [user]);

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
  
  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Processing': return 'default';
      case 'Shipped': return 'outline';
      case 'Delivered': return 'default'; // Will use custom green bg
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  };
  
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50';
      case 'Processing': return 'bg-blue-500/20 text-blue-700 border-blue-500/50';
      case 'Shipped': return 'bg-indigo-500/20 text-indigo-700 border-indigo-500/50';
      case 'Delivered': return 'bg-green-500/20 text-green-700 border-green-500/50';
      case 'Cancelled': return 'bg-red-500/20 text-red-700 border-red-500/50';
      default: return '';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-primary" /> My Orders
        </h1>
        {orders.length === 0 ? (
          <Card className="text-center py-10 shadow-lg">
            <CardHeader>
                <ListOrdered className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-2xl">No Orders Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">You haven't placed any orders with us yet. Ready to find your new favorite paste?</p>
                <Link href="/products">
                    <Button size="lg">Start Shopping</Button>
                </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary"/> Order #{order.id}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <CalendarDays className="w-4 h-4"/> Placed on: {format(new Date(order.createdAt), 'PP')}
                    </p>
                  </div>
                   <Badge 
                     variant={getStatusBadgeVariant(order.status)} 
                     className={cn('text-sm mt-2 sm:mt-0', getStatusBadgeClass(order.status))}
                    >
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm space-y-2 sm:space-y-0">
                    <span className="text-muted-foreground">Items: {order.items.length}</span>
                    <span className="font-semibold text-lg">Total: ₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 truncate" title={order.itemSummary}>
                    {order.itemSummary}
                  </p>
                </CardContent>
                <CardFooter>
                    <Link href={`/profile/orders/${order.id}`}>
                        <Button variant="outline">View Details</Button> 
                    </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

    