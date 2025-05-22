
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, User, MapPin, DollarSign, Clock, ArrowLeft, CheckCircle, ShoppingCart, AlertTriangle, Home, Download } from 'lucide-react';
import type { Order, StatusHistoryEntry, CartItem } from '@/types';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Helper function to generate a fallback order if not found in localStorage
const generateFallbackOrder = (orderId: string): Order => {
  const createdAt = new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000);
  const items: CartItem[] = [
    { id: 'prod1-fallback', name: 'Fallback Paste A', quantity: 1, price: 10.00, imageUrl: 'https://placehold.co/80x80.png', weight: '150g' },
    { id: 'prod2-fallback', name: 'Fallback Paste B', quantity: 2, price: 8.50, imageUrl: 'https://placehold.co/80x80.png', weight: '100g' },
  ];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 5.00;

  const statusHistory: StatusHistoryEntry[] = [
    { status: 'Pending', timestamp: new Date(createdAt.getTime() - 3600000 * 2) }, // 2 hours before creation
    { status: 'Processing', timestamp: createdAt },
    { status: 'Shipped', timestamp: new Date(createdAt.getTime() + 3600000 * 24 * 2) }, // 2 days after
  ];
  
  return {
    id: orderId,
    customerInfo: {
      fullName: 'Valued Customer',
      email: 'customer@example.com',
      phone: 'N/A',
      addressLine1: '123 Your Street',
      city: 'YourCity',
      state: 'YourState',
      postalCode: '00000',
      country: 'India',
    },
    items,
    itemSummary: items.map(item => `${item.name} (x${item.quantity})`).join(', '),
    subtotal,
    shippingCost,
    totalAmount: subtotal + shippingCost,
    status: 'Shipped',
    paymentStatus: 'Paid',
    createdAt,
    updatedAt: statusHistory[statusHistory.length -1].timestamp,
    statusHistory,
  };
};


export default function UserOrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    // Simulate fetching the order details
    // In a real app, you'd fetch this from your backend/Firebase using the orderId
    const fetchOrder = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

      let foundOrder: Order | undefined;
      if (typeof window !== 'undefined') {
        const storedOrdersRaw = localStorage.getItem('userMockOrders');
        if (storedOrdersRaw) {
          try {
            const allOrders: Order[] = JSON.parse(storedOrdersRaw);
            // Ensure dates are parsed correctly from localStorage
            foundOrder = allOrders.map(o => ({
                ...o,
                createdAt: new Date(o.createdAt),
                updatedAt: new Date(o.updatedAt),
                statusHistory: o.statusHistory?.map(sh => ({...sh, timestamp: new Date(sh.timestamp)})) || []
            })).find(o => o.id === orderId);
          } catch (e) {
            console.error("Error parsing user orders from localStorage", e);
          }
        }
      }
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // If not found in localStorage (e.g., direct navigation or data wiped), generate a fallback
        console.warn(`Order ${orderId} not found in mock storage. Displaying fallback.`);
        setOrder(generateFallbackOrder(orderId));
      }
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const handleDownloadInvoice = () => {
    console.log(`Simulating invoice download for order: ${orderId}`);
    toast({
      title: "Invoice Download Started",
      description: `Your invoice for order #${orderId} is being prepared.`,
    });
    // In a real app, you would trigger the actual download here.
    // For example, by creating a hidden <a> element and clicking it,
    // or by calling a backend endpoint that returns the PDF.
  };

  const getStatusBadgeVariant = (status: Order['status'] | undefined) => {
    if (!status) return 'default';
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Processing': return 'default';
      case 'Shipped': return 'outline';
      case 'Delivered': return 'default';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  };
  
  const getStatusBadgeClass = (status: Order['status'] | undefined) => {
    if (!status) return '';
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50';
      case 'Processing': return 'bg-blue-500/20 text-blue-700 border-blue-500/50';
      case 'Shipped': return 'bg-indigo-500/20 text-indigo-700 border-indigo-500/50';
      case 'Delivered': return 'bg-green-500/20 text-green-700 border-green-500/50';
      case 'Cancelled': return 'bg-red-500/20 text-red-700 border-red-500/50';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-20">
            <ShoppingCart className="mx-auto h-12 w-12 animate-pulse text-primary mb-4" />
            <p className="text-xl text-muted-foreground">Loading order details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center text-center py-20">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">Sorry, we couldn't find the details for this order.</p>
            <div className="flex gap-4">
                <Button onClick={() => router.push('/profile/orders')} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> My Orders
                </Button>
                <Button onClick={() => router.push('/')}>
                    <Home className="mr-2 h-4 w-4" /> Go to Homepage
                </Button>
            </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/profile/orders')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
              <Download className="mr-2 h-4 w-4" /> Download Invoice
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mt-4 sm:mt-0">Order Details</h1>
          <Badge variant={getStatusBadgeVariant(order.status)} className={cn("text-sm self-center sm:self-auto", getStatusBadgeClass(order.status))}>
            Status: {order.status}
          </Badge>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Order ID: #{order.id}</span>
                <span className="text-sm font-normal text-muted-foreground">
                    Placed on: {format(new Date(order.createdAt), 'PPpp')}
                </span>
            </CardTitle>
            <CardDescription>
                Last updated: {format(new Date(order.updatedAt), 'PPpp')}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" />Order Items</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded-md border" data-ai-hint="product item" />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} &bull; {item.weight}</p>
                    <p className="text-sm text-muted-foreground">Price: ₹{item.price.toFixed(2)} each</p>
                  </div>
                  <p className="font-semibold text-md">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
             <CardFooter className="bg-muted/50 p-4 mt-4 rounded-b-lg">
                <div className="w-full space-y-2 text-right">
                    <div className="flex justify-between items-center text-md">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-md">
                        <span className="text-muted-foreground">Shipping:</span>
                        <span className="font-semibold">₹{order.shippingCost.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-semibold">{order.customerInfo.fullName}</p>
                <p>{order.customerInfo.addressLine1}</p>
                {order.customerInfo.addressLine2 && <p>{order.customerInfo.addressLine2}</p>}
                <p>{order.customerInfo.city}, {order.customerInfo.state} - {order.customerInfo.postalCode}</p>
                <p>{order.customerInfo.country}</p>
                <p className="mt-2">
                    <span className="text-muted-foreground">Email:</span> {order.customerInfo.email}
                </p>
                 <p>
                    <span className="text-muted-foreground">Phone:</span> {order.customerInfo.phone || 'N/A'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <div className="flex items-center gap-1.5">
                        Payment Status: 
                        <Badge 
                            variant={order.paymentStatus === 'Paid' ? 'default' : 'destructive'} 
                            className={cn(order.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white')}
                        >
                            {order.paymentStatus}
                        </Badge>
                    </div>
                    {/* Placeholder for more payment details if needed */}
                </CardContent>
            </Card>
          </div>
        </div>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Order Status History</CardTitle>
            </CardHeader>
            <CardContent>
                {order.statusHistory && order.statusHistory.length > 0 ? (
                    <div className="relative pl-6">
                         <div className="absolute left-[0.45rem] top-0 bottom-0 w-0.5 bg-border"></div>
                        {order.statusHistory.map((entry, index) => (
                           <div key={index} className="relative mb-6 pb-2 last:mb-0 last:pb-0">
                                <div className="absolute left-[-0.30rem] top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background"></div>
                                <div className="ml-4">
                                    <div className="flex items-center justify-between">
                                        <Badge variant={getStatusBadgeVariant(entry.status)} className={cn('text-xs', getStatusBadgeClass(entry.status))}>
                                            {entry.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(entry.timestamp), 'dd MMM yyyy, HH:mm')}
                                        </span>
                                    </div>
                                    {entry.notes && <p className="text-xs text-muted-foreground italic mt-1">({entry.notes})</p>}
                                </div>
                           </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No status history available for this order.</p>
                )}
            </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}

    

    