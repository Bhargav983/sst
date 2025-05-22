
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, User, MapPin, DollarSign, Clock, ArrowLeft, CheckCircle, ShoppingCart, AlertTriangle, Home, Download } from 'lucide-react';
import type { Order, StatusHistoryEntry, CartItem, ShippingAddress } from '@/types';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';


// Helper function to generate a fallback order if not found in localStorage
const generateFallbackOrder = (orderId: string): Order => {
  const createdAt = new Date(); // Use current date for simplicity in fallback
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

// Creates a deeply sanitized version of the order for PDF generation
const getSafeOrderForPdf = (currentOrder: Order | null): Order => {
    if (!currentOrder || typeof currentOrder.id !== 'string' || currentOrder.id === 'N/A' || currentOrder.id.startsWith('emergency')) {
        // Generate a more distinct ID for fallbacks to make debugging easier
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

  const handleDownloadJsPdfInvoice = () => {
    if (!orderForPdf) return;

    const doc = new jsPDF({
        orientation: 'p', // portrait
        unit: 'mm', // millimeters
        format: 'a4', // A4 size
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15; // mm
    const contentWidth = pageWidth - margin * 2;
    let y = margin;
    const primaryLineHeight = 7; // mm, for primary text like titles or main content lines
    const secondaryLineHeight = 5; // mm, for smaller text or sub-lines

    // Helper function to add text and move y, centralizing y updates
    const addTextAndAdvance = (text: string | string[], x: number, currentY: number, options: any = {}, customLineHeight?: number) => {
        doc.text(text, x, currentY, options);
        const lines = Array.isArray(text) ? text.length : 1;
        return currentY + (customLineHeight || primaryLineHeight) * lines;
    };
    
    const drawHorizontalLine = (currentY: number, customMargin?: number) => {
        const lineMargin = customMargin === undefined ? margin : customMargin; // Use customMargin if provided, else default margin
        doc.line(lineMargin, currentY, pageWidth - lineMargin, currentY);
        return currentY + 2; // Small gap after line
    };

    // --- Invoice Header ---
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    y = addTextAndAdvance('SutraCart', margin, y, {}, primaryLineHeight * 1.2);

    doc.setFontSize(18);
    y = addTextAndAdvance('Invoice', margin, y);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order ID: ${orderForPdf.id}`, margin, y);
    doc.text(`Date: ${format(parseDateOrFallback(orderForPdf.createdAt), 'PPP')}`, pageWidth - margin, y, { align: 'right' });
    y += primaryLineHeight;
    y = drawHorizontalLine(y);
    y += secondaryLineHeight;

    // --- Addresses ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    y = addTextAndAdvance('Shipping Address:', margin, y, {}, primaryLineHeight * 0.8);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const custInfo = orderForPdf.customerInfo;
    y = addTextAndAdvance(custInfo.fullName, margin, y, {}, secondaryLineHeight);
    y = addTextAndAdvance(custInfo.addressLine1, margin, y, {}, secondaryLineHeight);
    if (custInfo.addressLine2) {
      y = addTextAndAdvance(custInfo.addressLine2, margin, y, {}, secondaryLineHeight);
    }
    y = addTextAndAdvance(`${custInfo.city}, ${custInfo.state} - ${custInfo.postalCode}`, margin, y, {}, secondaryLineHeight);
    y = addTextAndAdvance(custInfo.country, margin, y, {}, secondaryLineHeight);
    y = addTextAndAdvance(`Email: ${custInfo.email}`, margin, y, {}, secondaryLineHeight);
    y = addTextAndAdvance(`Phone: ${custInfo.phone}`, margin, y, {}, secondaryLineHeight);
    y += primaryLineHeight * 0.5;
    y = drawHorizontalLine(y);
    y += primaryLineHeight * 0.5;

    // --- Items Table Header ---
    let tableHeaderY = y;
    const drawTableHeader = () => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        const col1X = margin; // Item Description
        const col2X = contentWidth * 0.60 + margin; // Quantity
        const col3X = contentWidth * 0.75 + margin; // Unit Price
        const col4X = pageWidth - margin; // Total (right aligned)
        
        doc.text('Item Description', col1X, tableHeaderY);
        doc.text('Qty', col2X, tableHeaderY, { align: 'center' });
        doc.text('Unit Price', col3X, tableHeaderY, { align: 'right' });
        doc.text('Total', col4X, tableHeaderY, { align: 'right' });
        tableHeaderY += secondaryLineHeight;
        tableHeaderY = drawHorizontalLine(tableHeaderY);
        tableHeaderY += secondaryLineHeight * 0.5;
        return tableHeaderY;
    };
    
    y = drawTableHeader();


    // --- Items Table Rows ---
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    (orderForPdf.items || []).forEach(item => {
      const itemDescriptionMaxWidth = contentWidth * 0.55; // Max width for item name column
      const itemNameLines = doc.splitTextToSize(`${item.name} (${item.weight || 'N/A'})`, itemDescriptionMaxWidth);
      
      const currentItemHeight = (itemNameLines.length * secondaryLineHeight * 0.8) + (secondaryLineHeight * 0.7) + 2; // Approx height with padding and line
      
      if (y + currentItemHeight > pageHeight - margin - 40) { // Check for page break (leave space for footer and totals)
        doc.addPage();
        y = margin;
        tableHeaderY = y; // Reset tableHeaderY for the new page
        y = drawTableHeader(); // Re-draw table headers on new page
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
      }

      let itemLineY = y;
      // Print item description lines
      itemNameLines.forEach((line: string, index: number) => {
        doc.text(line, margin, itemLineY + (index * secondaryLineHeight * 0.8) );
      });

      // Print other columns aligned with the first line of the item description
      const col2X = contentWidth * 0.60 + margin; 
      const col3X = contentWidth * 0.75 + margin;
      const col4X = pageWidth - margin; 
      doc.text(item.quantity.toString(), col2X, itemLineY, { align: 'center' });
      doc.text(`₹${item.price.toFixed(2)}`, col3X, itemLineY, { align: 'right' });
      doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, col4X, itemLineY, { align: 'right' });
      
      // Advance y by the height of the current item content (max lines in description) + padding for line
      y += Math.max(secondaryLineHeight * 0.8 * itemNameLines.length, secondaryLineHeight * 0.8); // Ensure at least one line height
      y = drawHorizontalLine(y, margin + 2); // Thinner line for items, slightly indented
      y += secondaryLineHeight * 0.7; // Padding after the line
    });

    // --- Totals ---
    const totalsBlockHeight = primaryLineHeight * 4 + 5; // Approximate height for totals section including lines
    if (y + totalsBlockHeight > pageHeight - margin - 15) { // Check if totals fit, -15 for footer space
        doc.addPage();
        y = margin;
    } else {
        // If there's a lot of space, push totals further down, but not too close to items
        y = Math.max(y + primaryLineHeight, pageHeight - margin - 15 - totalsBlockHeight);
    }
    
    y = drawHorizontalLine(y); 
    y += primaryLineHeight * 0.5;

    const totalsKeyX = contentWidth * 0.65 + margin; 
    const totalsValueX = pageWidth - margin;   

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', totalsKeyX, y, { align: 'right' });
    doc.text(`₹${orderForPdf.subtotal.toFixed(2)}`, totalsValueX, y, { align: 'right' });
    y += primaryLineHeight;

    doc.text('Shipping:', totalsKeyX, y, { align: 'right' });
    doc.text(`₹${orderForPdf.shippingCost.toFixed(2)}`, totalsValueX, y, { align: 'right' });
    y += primaryLineHeight * 0.5;
    
    const lineAboveTotalXStart = totalsKeyX - 10; // Start the line a bit before the text
    doc.line(lineAboveTotalXStart, y, pageWidth - margin, y); // Line above grand total
    y += primaryLineHeight * 0.5;    

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Grand Total:', totalsKeyX, y, { align: 'right' });
    doc.text(`₹${orderForPdf.totalAmount.toFixed(2)}`, totalsValueX, y, { align: 'right' });
    y += primaryLineHeight * 1.5;


    // --- Footer ---
    // Position footer text relative to the bottom of the page
    const footerStartY = pageHeight - margin - (secondaryLineHeight * 2); // Start position for footer text

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your business with SutraCart!', pageWidth / 2, footerStartY, { align: 'center' });

    // Add page numbers to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i); // Set current page to i
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        // Position page number slightly below the thank you message
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, footerStartY + secondaryLineHeight, { align: 'center' });
    }

    doc.save(`SutraCart-Invoice-${orderForPdf.id}.pdf`);
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
              onClick={handleDownloadJsPdfInvoice}
              disabled={!canDownloadPdf}
            >
              <Download className="mr-2 h-4 w-4" />
              {canDownloadPdf ? 'Download Invoice' : 'Invoice Unavailable'}
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
                  <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded-md border" data-ai-hint="product item" />
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
