
"use client";

import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, User, MapPin, DollarSign, Edit3 } from 'lucide-react';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId;

  // Mock order data - replace with actual data fetching
  const mockOrder = {
    id: orderId,
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 123 456 7890',
    shippingAddress: '123 Spice Lane, Flavor Town, CA 90210, USA',
    date: '2023-11-15',
    status: 'Processing',
    totalAmount: 75.99,
    items: [
      { id: '1', name: 'Andhra Chilli Paste', quantity: 2, price: 12.99 },
      { id: '2', name: 'Kerala Coconut Curry Paste', quantity: 1, price: 14.50 },
    ],
    paymentStatus: 'Paid',
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Order Details: #{mockOrder.id}</h1>
          <Button variant="outline"><Edit3 className="mr-2 h-4 w-4" />Update Status</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" />Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {mockOrder.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <p className="font-semibold">{item.name} (x{item.quantity})</p>
                    <p className="text-sm text-muted-foreground">Price: ₹{item.price.toFixed(2)} each</p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-end items-center text-lg font-bold mt-2">
                <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" /> Total: ₹{mockOrder.totalAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p><span className="font-semibold">Name:</span> {mockOrder.customerName}</p>
                <p><span className="font-semibold">Email:</span> {mockOrder.customerEmail}</p>
                <p><span className="font-semibold">Phone:</span> {mockOrder.customerPhone}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>{mockOrder.shippingAddress}</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                 <p>Current Status: <Badge variant={mockOrder.status === 'Processing' ? 'secondary' : 'default'}>{mockOrder.status}</Badge></p>
                 <p>Payment: <Badge variant={mockOrder.paymentStatus === 'Paid' ? 'default' : 'destructive'} className={mockOrder.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : ''}>{mockOrder.paymentStatus}</Badge></p>
                 <p className="text-sm text-muted-foreground">Order Date: {mockOrder.date}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
