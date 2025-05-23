
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, User, MapPin, DollarSign, Clock, ArrowLeft, CheckCircle, ShoppingCart, AlertTriangle, Home, Download, Loader2 } from 'lucide-react';
import type { Order, StatusHistoryEntry, CartItem, ShippingAddress } from '@/types';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import html2pdf from 'html2pdf.js';
import { createRoot } from 'react-dom/client'; // Changed import
import { InvoiceHTMLTemplate } from '@/components/invoice/invoice-html-template';


// Helper function to generate a fallback order if not found in localStorage
const generateFallbackOrder = (orderId: string): Order => {
  const createdAt = new Date(); 
  const items: CartItem[] = [
    { id: 'prod1-fallback', name: 'Fallback Paste A', quantity: 1, price: 10.00, imageUrl: 'https://placehold.co/80x80.png', dataAiHint: 'product item', weight: '150g' },
    { id: 'prod2-fallback', name: 'Fallback Paste B', quantity: 2, price: 8.50, imageUrl: 'https://placehold.co/80x80.png', dataAiHint: 'product item', weight: '100g' },
  ];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 5.00;

  const statusHistory: StatusHistoryEntry[] = [
    { status: 'Pending', timestamp: new Date(createdAt.getTime() - 3600000 * 2) },
    { status: 'Processing', timestamp: createdAt },
  ];
  
  return {
    id: orderId,
    customerInfo: {
      fullName: 'Valued Customer',
      email: 'customer@example.com',
      phone: 'N/A',
      addressLine1: '123 Your Street',
      addressLine2: '',
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
    status: 'Processing',
    paymentStatus: 'Paid',
    createdAt,
    updatedAt: statusHistory[statusHistory.length -1].timestamp,
    statusHistory,
    userId: 'fallback-user-id',
  };
};

const parseDateOrFallback = (dateInput: any, fallbackDate: Date = new Date()): Date => {
    if (!dateInput) return fallbackDate;
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? fallbackDate : date;
};

const getSafeOrderForPdf = (currentOrder: Order | null): Order => {
    if (!currentOrder || typeof currentOrder.id !== 'string' || currentOrder.id === 'N/A' || currentOrder.id.startsWith('emergency')) {
        return generateFallbackOrder('emergency-pdf-fallback-' + Date.now());
    }

    const safeCustomerInfo: ShippingAddress = {
        fullName: String(currentOrder.customerInfo?.fullName || 'N/A'),
        email: String(currentOrder.customerInfo?.email || 'N/A'),
        phone: String(currentOrder.customerInfo?.phone || 'N/A'),
        addressLine1: String(currentOrder.customerInfo?.addressLine1 || 'N/A'),
        addressLine2: String(currentOrder.customerInfo?.addressLine2 || ''),
        city: String(currentOrder.customerInfo?.city || 'N/A'),
        state: String(currentOrder.customerInfo?.state || 'N/A'),
        postalCode: String(currentOrder.customerInfo?.postalCode || 'N/A'),
        country: String(currentOrder.customerInfo?.country || 'India'),
    };
    
    const safeItems: CartItem[] = (Array.isArray(currentOrder.items) ? currentOrder.items : []).map(item => ({
        id: String(item?.id || `item-${Math.random().toString(36).substring(7)}`),
        name: String(item?.name || 'Unknown Item'),
        price: Number(item?.price || 0),
        quantity: Number(item?.quantity || 1),
        imageUrl: String(item?.imageUrl || 'https://placehold.co/80x80.png'),
        weight: String(item?.weight || 'N/A'),
        dataAiHint: String(item?.dataAiHint || 'product item'),
    }));

    const safeStatusHistory: StatusHistoryEntry[] = (Array.isArray(currentOrder.statusHistory) ? currentOrder.statusHistory : []).map(sh => ({
        status: sh?.status || 'Pending',
        timestamp: parseDateOrFallback(sh?.timestamp),
        notes: String(sh?.notes || ''),
    }));

    return {
        id: String(currentOrder.id), 
        customerInfo: safeCustomerInfo,
        items: safeItems,
        subtotal: Number(currentOrder.subtotal || 0),
        shippingCost: Number(currentOrder.shippingCost || 0),
        totalAmount: Number(currentOrder.totalAmount || 0),
        status: currentOrder.status || 'Pending',
        paymentStatus: currentOrder.paymentStatus || 'Pending',
        createdAt: parseDateOrFallback(currentOrder.createdAt),
        updatedAt: parseDateOrFallback(currentOrder.updatedAt, parseDateOrFallback(currentOrder.createdAt)),
        statusHistory: safeStatusHistory,
        itemSummary: String(currentOrder.itemSummary || safeItems.map(i => `${i.name} (x${i.quantity})`).join(', ')),
        userId: String(currentOrder.userId || ''),
    };
};


export default function UserOrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [orderForPdf, setOrderForPdf] = useState<Order | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);


  useEffect(() => {
    setIsClient(true); 
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300)); 

      let foundOrder: Order | undefined;
      if (typeof window !== 'undefined') {
        const storedOrdersRaw = localStorage.getItem('userMockOrders');
        if (storedOrdersRaw) {
          try {
            const parsedData = JSON.parse(storedOrdersRaw);
            
            if (Array.isArray(parsedData)) { 
              const allOrdersFromStorage: any[] = parsedData;
              
              const mappedOrders: Order[] = allOrdersFromStorage.map((o: any) => {
                if (!o || typeof o !== 'object') {
                  return generateFallbackOrder(`malformed-entry-${Math.random().toString(36).substring(7)}`); 
                }

                const customerInfo: ShippingAddress = {
                  fullName: String(o?.customerInfo?.fullName || 'N/A'),
                  email: String(o?.customerInfo?.email || 'N/A'),
                  phone: String(o?.customerInfo?.phone || 'N/A'),
                  addressLine1: String(o?.customerInfo?.addressLine1 || 'N/A'),
                  addressLine2: String(o?.customerInfo?.addressLine2 || ''),
                  city: String(o?.customerInfo?.city || 'N/A'),
                  state: String(o?.customerInfo?.state || 'N/A'),
                  postalCode: String(o?.customerInfo?.postalCode || 'N/A'),
                  country: String(o?.customerInfo?.country || 'India'),
                };

                const items: CartItem[] = (Array.isArray(o?.items) ? o.items : []).map((it: any) => ({
                  id: String(it?.id || `item-id-${Math.random().toString(36).substring(7)}`),
                  name: String(it?.name || 'Unknown Item'),
                  price: Number(it?.price || 0),
                  quantity: Number(it?.quantity || 1),
                  imageUrl: String(it?.imageUrl || 'https://placehold.co/80x80.png'),
                  weight: String(it?.weight || 'N/A'),
                  dataAiHint: String(it?.dataAiHint || 'product item'),
                }));

                const statusHistory: StatusHistoryEntry[] = (Array.isArray(o?.statusHistory) ? o.statusHistory : []).map((sh: any) => ({
                  status: sh?.status || 'Pending',
                  timestamp: parseDateOrFallback(sh?.timestamp),
                  notes: sh?.notes,
                }));
                
                return {
                  id: String(o?.id || `order-id-${Math.random().toString(36).substring(7)}`),
                  customerInfo,
                  items,
                  subtotal: Number(o?.subtotal || 0),
                  shippingCost: Number(o?.shippingCost || 0),
                  totalAmount: Number(o?.totalAmount || 0),
                  status: o?.status || 'Pending',
                  paymentStatus: o?.paymentStatus || 'Pending',
                  createdAt: parseDateOrFallback(o?.createdAt),
                  updatedAt: parseDateOrFallback(o?.updatedAt, parseDateOrFallback(o?.createdAt)),
                  statusHistory,
                  itemSummary: String(o?.itemSummary || items.map(item => `${item.name} (x${item.quantity})`).join(', ')),
                  userId: String(o?.userId || ''),
                };
              });
              foundOrder = mappedOrders.find(o => o.id === orderId);
            } else {
              console.warn("Data in 'userMockOrders' from localStorage was not an array. Using fallback.");
            }
          } catch (e) {
            console.error("Error parsing user orders from localStorage or mapping data", e);
          }
        }
      }
      
      const currentOrder = foundOrder || generateFallbackOrder(orderId);
      setOrder(currentOrder);
      setOrderForPdf(getSafeOrderForPdf(currentOrder)); 
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId]);


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

  const handleDownloadHtml2PdfInvoice = async () => {
    if (!orderForPdf || !isClient) return;
    setIsGeneratingPdf(true);
  
    const invoiceElementId = 'invoice-to-print-container';
    let invoiceContainer = document.getElementById(invoiceElementId);
  
    if (!invoiceContainer) {
      invoiceContainer = document.createElement('div');
      invoiceContainer.id = invoiceElementId;
      // Apply styles to keep it off-screen but renderable for html2pdf
      invoiceContainer.style.position = 'fixed'; // Use fixed to ensure it's out of flow but dimensions are respected
      invoiceContainer.style.left = '-200vw'; // Way off-screen to the left
      invoiceContainer.style.top = '0px';
      invoiceContainer.style.zIndex = '-1'; // Ensure it's behind everything
      invoiceContainer.style.width = '210mm'; // A4 width
      invoiceContainer.style.visibility = 'hidden'; // Keep it hidden but allows rendering
      document.body.appendChild(invoiceContainer);
    }
  
    const root = createRoot(invoiceContainer); // Changed usage
    root.render(<InvoiceHTMLTemplate order={orderForPdf} />);
  
    // Give React a moment to render the component into the hidden div
    await new Promise(resolve => setTimeout(resolve, 500)); 
  
    const opt = {
      margin: 5, // mm for all sides
      filename: `SutraCart-Invoice-${orderForPdf.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: false, useCORS: true, scrollY: 0, windowWidth: invoiceContainer.scrollWidth, windowHeight: invoiceContainer.scrollHeight },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'avoid-all'] }
    };
  
    try {
      // Ensure the element passed to html2pdf is the one containing the template
      const elementToPrint = invoiceContainer.firstChild; 
      if (elementToPrint) {
        await html2pdf().from(elementToPrint).set(opt).save();
      } else {
        console.error("Invoice template element not found for PDF generation.");
      }
    } catch (error) {
      console.error("Error generating PDF with html2pdf.js:", error);
      // Consider adding a user-facing toast notification for the error
    } finally {
      root.unmount();
      if (invoiceContainer && invoiceContainer.parentNode === document.body) {
        document.body.removeChild(invoiceContainer);
      }
      setIsGeneratingPdf(false);
    }
  };


  if (isLoading || !isClient) {
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
  
  const canDownloadPdf = isClient && orderForPdf && typeof orderForPdf.id === 'string' && orderForPdf.id && !orderForPdf.id.startsWith('emergency');

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/profile/orders')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadHtml2PdfInvoice}
              disabled={!canDownloadPdf || isGeneratingPdf}
            >
              {isGeneratingPdf ? 
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                <Download className="mr-2 h-4 w-4" />
              }
              {isGeneratingPdf ? 'Generating...' : (canDownloadPdf ? 'Download Invoice' : 'Invoice Unavailable')}
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mt-4 sm:mt-0">Order Details</h1>
          {order.status && 
            <Badge variant={getStatusBadgeVariant(order.status)} className={cn("text-sm self-center sm:self-auto", getStatusBadgeClass(order.status))}>
              Status: {order.status}
            </Badge>
          }
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Order ID: #{order.id || 'N/A'}</span>
                <span className="text-sm font-normal text-muted-foreground">
                    Placed on: {order.createdAt ? format(parseDateOrFallback(order.createdAt), 'PPpp') : 'N/A'}
                </span>
            </CardTitle>
            <CardDescription>
                Last updated: {order.updatedAt ? format(parseDateOrFallback(order.updatedAt), 'PPpp') : 'N/A'}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" />Order Items</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {(order.items || []).map(item => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded-md border" data-ai-hint={item.dataAiHint || "product item"} />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name || 'Unknown Item'}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity || 1} &bull; {item.weight || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Price: ₹{Number(item.price || 0).toFixed(2)} each</p>
                  </div>
                  <p className="font-semibold text-md">₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
             <CardFooter className="bg-muted/50 p-4 mt-4 rounded-b-lg">
                <div className="w-full space-y-2 text-right">
                    <div className="flex justify-between items-center text-md">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">₹{Number(order.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-md">
                        <span className="text-muted-foreground">Shipping:</span>
                        <span className="font-semibold">₹{Number(order.shippingCost || 0).toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span>₹{Number(order.totalAmount || 0).toFixed(2)}</span>
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
                <p className="font-semibold">{order.customerInfo?.fullName || 'N/A'}</p>
                <p>{order.customerInfo?.addressLine1 || 'N/A'}</p>
                {order.customerInfo?.addressLine2 && <p>{order.customerInfo.addressLine2}</p>}
                <p>{order.customerInfo?.city || 'N/A'}, {order.customerInfo?.state || 'N/A'} - {order.customerInfo?.postalCode || 'N/A'}</p>
                <p>{order.customerInfo?.country || 'N/A'}</p>
                <p className="mt-2">
                    <span className="text-muted-foreground">Email:</span> {order.customerInfo?.email || 'N/A'}
                </p>
                 <p>
                    <span className="text-muted-foreground">Phone:</span> {order.customerInfo?.phone || 'N/A'}
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
                        {order.paymentStatus &&
                          <Badge 
                              variant={order.paymentStatus === 'Paid' ? 'default' : 'destructive'} 
                              className={cn(order.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white')}
                          >
                              {order.paymentStatus}
                          </Badge>
                        }
                        {!order.paymentStatus && <Badge variant="secondary">N/A</Badge>}
                    </div>
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
                                        {entry.status && 
                                          <Badge variant={getStatusBadgeVariant(entry.status)} className={cn('text-xs', getStatusBadgeClass(entry.status))}>
                                              {entry.status}
                                          </Badge>
                                        }
                                        {!entry.status && <Badge variant="secondary" className="text-xs">N/A</Badge>}
                                        <span className="text-xs text-muted-foreground">
                                            {entry.timestamp ? format(parseDateOrFallback(entry.timestamp), 'dd MMM yyyy, HH:mm') : 'N/A'}
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

