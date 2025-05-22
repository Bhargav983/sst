
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, User, MapPin, DollarSign, Edit3, Clock, ArrowLeft } from 'lucide-react';
import type { Order, StatusHistoryEntry } from '@/types'; // Added StatusHistoryEntry
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';


// Function to find a specific order from the larger dummy dataset (simulating backend fetch)
// In a real app, this would be an API call to getOrderById(orderId)
const getOrderFromDummyData = (orderId: string | string[] | undefined, allOrders: Order[]): Order | undefined => {
  if (!orderId) return undefined;
  return allOrders.find(o => o.id === orderId);
};

// Re-using a simplified version of dummy order generation for initial state or if direct navigation.
// Ideally, this page would fetch the specific order.
const generateInitialOrderForDetail = (orderId: string | string[]): Order => {
    const idStr = Array.isArray(orderId) ? orderId[0] : orderId;
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000);
    const initialStatus: Order['status'] = 'Processing';
     const statusHistory: StatusHistoryEntry[] = [
        { status: 'Pending', timestamp: new Date(createdAt.getTime() - 60000 * 60 * 2) }, // 2 hours before
        { status: initialStatus, timestamp: createdAt }
    ];

    return {
        id: idStr,
        customerInfo: {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1 987 654 3210',
        addressLine1: '456 Market St',
        city: 'Sampleville',
        state: 'State',
        postalCode: '67890',
        country: 'India',
        },
        items: [
        { id: 'prod1', name: 'Sample Paste A', quantity: 1, price: 10.00, imageUrl: 'https://placehold.co/40x40.png', weight: '150g' },
        { id: 'prod2', name: 'Sample Paste B', quantity: 2, price: 8.50, imageUrl: 'https://placehold.co/40x40.png', weight: '100g' },
        ],
        itemSummary: "Sample Paste A (x1), Sample Paste B (x2)",
        subtotal: 27.00,
        shippingCost: 5.00,
        totalAmount: 32.00,
        status: initialStatus,
        paymentStatus: 'Paid',
        createdAt: createdAt,
        updatedAt: createdAt,
        statusHistory: statusHistory
    };
};


export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId;
  const { toast } = useToast();

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderStatuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    // Simulate fetching the order details
    // In a real app, you'd fetch this from your backend/Firebase using the orderId
    const fetchOrder = async () => {
      setIsLoading(true);
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Attempt to get from localStorage (where page.tsx might save it)
      // This part is a bit of a hack for purely client-side demo.
      // A robust solution would use a proper state management or server fetch.
      const storedOrdersRaw = localStorage.getItem('dummyOrders'); // Assuming AdminOrdersPage might save this
      let foundOrder: Order | undefined;
      if (storedOrdersRaw) {
          try {
              const allOrders: Order[] = JSON.parse(storedOrdersRaw);
              foundOrder = allOrders.find(o => o.id === orderId);
          } catch (e) {
              console.error("Error parsing orders from localStorage", e);
          }
      }

      if (foundOrder) {
        setCurrentOrder(foundOrder);
      } else {
        // Fallback to generating a basic one if not found (e.g., direct navigation)
        setCurrentOrder(generateInitialOrderForDetail(orderId));
      }
      setIsLoading(false);
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);


  const handleStatusUpdate = (newStatus: Order['status']) => {
    if (!currentOrder) return;

    const updatedOrder: Order = {
      ...currentOrder,
      status: newStatus,
      updatedAt: new Date(),
      statusHistory: [
        ...(currentOrder.statusHistory || []),
        { status: newStatus, timestamp: new Date() }
      ].sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()),
    };
    setCurrentOrder(updatedOrder);
    
    // Persist this change to localStorage if needed for demo consistency
    const storedOrdersRaw = localStorage.getItem('dummyOrders');
    if (storedOrdersRaw) {
        try {
            let allOrders: Order[] = JSON.parse(storedOrdersRaw);
            allOrders = allOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
            localStorage.setItem('dummyOrders', JSON.stringify(allOrders));
        } catch(e) { console.error("Error updating localStorage", e)}
    }


    toast({
      title: "Order Status Updated",
      description: `Order ${currentOrder.id} status changed to ${newStatus}.`,
    });
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
      <MainLayout><div className="text-center py-10">Loading order details...</div></MainLayout>
    );
  }

  if (!currentOrder) {
    return (
      <MainLayout><div className="text-center py-10 text-red-500">Order not found.</div></MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
           <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders</Link>
          </Button>
          <h1 className="text-3xl font-bold">Order: #{currentOrder.id}</h1>
          <div className="w-[200px]">
            <Select value={currentOrder.status} onValueChange={(value) => handleStatusUpdate(value as Order['status'])}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                    {orderStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" />Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {currentOrder.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <p className="font-semibold">{item.name} (x{item.quantity})</p>
                    <p className="text-sm text-muted-foreground">Price: ₹{item.price.toFixed(2)} each</p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between items-center text-lg font-bold mt-2">
                <span>Subtotal:</span>
                <span>₹{currentOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-md mt-1">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="text-muted-foreground">₹{currentOrder.shippingCost.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center text-xl font-bold">
                <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" /> Total:
                <span>₹{currentOrder.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" />Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p><span className="font-semibold">Name:</span> {currentOrder.customerInfo.fullName}</p>
                <p><span className="font-semibold">Email:</span> {currentOrder.customerInfo.email}</p>
                <p><span className="font-semibold">Phone:</span> {currentOrder.customerInfo.phone}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>{currentOrder.customerInfo.addressLine1}</p>
                {currentOrder.customerInfo.addressLine2 && <p>{currentOrder.customerInfo.addressLine2}</p>}
                <p>{currentOrder.customerInfo.city}, {currentOrder.customerInfo.state} - {currentOrder.customerInfo.postalCode}</p>
                <p>{currentOrder.customerInfo.country}</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                 <div className="flex items-center gap-1.5">Current Status: <Badge variant={getStatusBadgeVariant(currentOrder.status)} className={cn(getStatusBadgeClass(currentOrder.status))}>{currentOrder.status}</Badge></div>
                 <div className="flex items-center gap-1.5">Payment: <Badge variant={currentOrder.paymentStatus === 'Paid' ? 'default' : 'destructive'} className={cn(currentOrder.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white')}>{currentOrder.paymentStatus}</Badge></div>
                 <p className="text-muted-foreground">Order Date: {format(new Date(currentOrder.createdAt), 'PPpp')}</p>
                 <p className="text-muted-foreground">Last Updated: {format(new Date(currentOrder.updatedAt), 'PPpp')}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Order Status History</CardTitle>
            </CardHeader>
            <CardContent>
                {currentOrder.statusHistory && currentOrder.statusHistory.length > 0 ? (
                    <ul className="space-y-3">
                        {currentOrder.statusHistory.map((entry, index) => (
                            <li key={index} className="flex items-center justify-between pb-2 border-b last:border-b-0">
                                <div className="flex items-center gap-2">
                                     <Badge variant={getStatusBadgeVariant(entry.status)} className={cn('text-xs', getStatusBadgeClass(entry.status))}>
                                        {entry.status}
                                    </Badge>
                                    {entry.notes && <p className="text-xs text-muted-foreground italic">({entry.notes})</p>}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {format(new Date(entry.timestamp), 'dd MMM yyyy, HH:mm')}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">No status history available for this order.</p>
                )}
            </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}
