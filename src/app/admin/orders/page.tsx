
"use client";

import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order, ShippingAddress } from '@/types';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, PackageSearch, UserCircle, CalendarDays, FilterX } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // Added import for cn

const ITEMS_PER_PAGE = 10;

const generateDummyOrders = (count: number): Order[] => {
  const statuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentStatuses: Order['paymentStatus'][] = ['Pending', 'Paid', 'Failed'];
  const productNames = ['Andhra Chilli Paste', 'Kerala Coconut Curry Paste', 'Tamilian Tamarind Paste', 'Karnataka Garlic-Ginger Paste', 'Hyderabadi Biryani Masala'];
  const customerNames = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Reddy', 'Vijay Singh', 'Anjali Desai', 'Deepak Rao', 'Meera Iyer'];
  
  return Array.from({ length: count }, (_, i) => {
    const itemsCount = Math.floor(Math.random() * 3) + 1;
    const items = Array.from({length: itemsCount}, () => ({
      id: Math.random().toString(36).substring(7),
      name: productNames[Math.floor(Math.random() * productNames.length)],
      price: parseFloat((Math.random() * 20 + 5).toFixed(2)),
      quantity: Math.floor(Math.random() * 3) + 1,
      imageUrl: `https://placehold.co/40x40.png?text=${productNames[Math.floor(Math.random() * productNames.length)][0]}`,
      weight: `${Math.floor(Math.random() * 200) + 100}g`
    }));
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = 5.00;
    const totalAmount = subtotal + shippingCost;
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);

    return {
      id: `SUTRA-ADMIN-${1000 + i}`,
      customerInfo: {
        fullName: customerNames[Math.floor(Math.random() * customerNames.length)],
        email: `customer${i}@example.com`,
        phone: `98765432${String(i).padStart(2, '0')}`,
        addressLine1: `${100 + i} Main St`,
        city: ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai'][Math.floor(Math.random() * 4)],
        state: ['Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra'][Math.floor(Math.random() * 4)],
        postalCode: `${Math.floor(Math.random() * 800000) + 100000}`,
        country: 'India',
      },
      items: items,
      itemSummary: items.map(item => `${item.name} (x${item.quantity})`).join(', '),
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingCost: parseFloat(shippingCost.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      createdAt: randomDate,
      updatedAt: new Date(randomDate.getTime() + Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000),
    };
  });
};


export default function AdminOrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Order['status'] | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [productFilter, setProductFilter] = useState<string>('All');

  useEffect(() => {
    setAllOrders(generateDummyOrders(55)); // Generate 55 dummy orders
  }, []);

  const uniqueProducts = useMemo(() => {
    const products = new Set<string>();
    allOrders.forEach(order => order.items.forEach(item => products.add(item.name)));
    return ['All', ...Array.from(products)];
  }, [allOrders]);

  const filteredOrders = useMemo(() => {
    return allOrders
      .filter(order => {
        const matchesTab = activeTab === 'All' || order.status === activeTab;
        const matchesSearch = 
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProduct = productFilter === 'All' || order.items.some(item => item.name === productFilter);
        return matchesTab && matchesSearch && matchesProduct;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [allOrders, searchTerm, activeTab, productFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const handleTabChange = (value: string) => {
    setActiveTab(value as Order['status'] | 'All');
    setCurrentPage(1); 
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
  
  const handleProductFilterChange = (value: string) => {
    setProductFilter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveTab('All');
    setProductFilter('All');
    setCurrentPage(1);
  };


  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Processing': return 'default'; // using primary color
      case 'Shipped': return 'outline'; // could be a blue-ish
      case 'Delivered': return 'default'; // using green-ish
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
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2"><PackageSearch className="h-8 w-8 text-primary" /> Manage Orders</h1>
           <Button onClick={clearFilters} variant="outline" size="sm" className="flex items-center gap-1">
            <FilterX className="h-4 w-4" /> Clear Filters
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by Order ID, Customer..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-8 w-full"
                />
              </div>
              <Select value={productFilter} onValueChange={handleProductFilterChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by Product" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueProducts.map(product => (
                    <SelectItem key={product} value={product}>{product}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Pending">Pending</TabsTrigger>
                <TabsTrigger value="Processing">Processing</TabsTrigger>
                <TabsTrigger value="Shipped">Shipped</TabsTrigger>
                <TabsTrigger value="Delivered">Delivered</TabsTrigger>
                <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0"> {/* Use activeTab for all TabContent to render one */}
                {paginatedOrders.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <PackageSearch className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-xl">No orders found matching your criteria.</p>
                  </div>
                ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            <Link href={`/admin/orders/${order.id}`} className="hover:underline text-primary">
                              {order.id}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserCircle className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{order.customerInfo.fullName}</p>
                                <p className="text-xs text-muted-foreground">{order.customerInfo.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <CalendarDays className="h-4 w-4" /> {format(new Date(order.createdAt), 'dd MMM yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground/80">{format(new Date(order.createdAt), 'p')}</div>
                          </TableCell>
                           <TableCell className="max-w-[250px] truncate text-sm text-muted-foreground" title={order.itemSummary}>
                            {order.itemSummary}
                          </TableCell>
                          <TableCell className="text-right font-semibold">₹{order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(order.status)} className={cn("text-xs", getStatusBadgeClass(order.status))}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6">
                    <p className="text-sm text-muted-foreground">
                      Showing {Math.min(filteredOrders.length, ((currentPage - 1) * ITEMS_PER_PAGE) + 1)}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
