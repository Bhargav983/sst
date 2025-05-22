
"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { ShippingAddress } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-provider';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription, // Added FormDescription here
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label'; // Use ShadCN Label for consistency


const shippingAddressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format"),
  addressLine1: z.string().min(5, { message: "Address line 1 must be at least 5 characters." }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State/Province must be at least 2 characters." }),
  postalCode: z.string().min(3, { message: "Postal code must be at least 3 characters." }),
  country: z.string().min(2, { message: "Country must be at least 2 characters." }),
  saveAddress: z.boolean().optional(), // For logged-in users saving new address
  newAddressLabel: z.string().optional(), // Label for new address if saveAddress is true
});

type CheckoutFormValues = z.infer<typeof shippingAddressSchema>;

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart, isCartReady } = useCart();
  const { user, addAddress, loading: authLoading } = useAuth();
  const cartTotal = getCartTotal();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new');

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      saveAddress: false,
      newAddressLabel: '',
    },
  });

  useEffect(() => {
    if (isCartReady && cartItems.length === 0) {
      toast({ title: "Your cart is empty!", description: "Redirecting...", variant: "destructive" });
      router.push('/products');
    }
  }, [isCartReady, cartItems, router, toast]);

  useEffect(() => {
    if (user) {
      form.setValue('email', user.email || '');
      form.setValue('fullName', user.displayName || '');
      form.setValue('phone', user.phone || '');
      // If user has addresses, pre-select the first one by default
      if (user.addresses && user.addresses.length > 0) {
        const firstAddress = user.addresses[0];
        if (firstAddress.id) {
          setSelectedAddressId(firstAddress.id);
          form.reset({
            ...form.getValues(), // keep existing values like saveAddress
            fullName: firstAddress.fullName,
            // email: firstAddress.email, // Keep user's primary email
            phone: firstAddress.phone,
            addressLine1: firstAddress.addressLine1,
            addressLine2: firstAddress.addressLine2 || '',
            city: firstAddress.city,
            state: firstAddress.state,
            postalCode: firstAddress.postalCode,
            country: firstAddress.country,
          });
        }
      } else {
          setSelectedAddressId('new'); // No saved addresses, default to new
      }
    }
  }, [user, form, isCartReady]); // Added isCartReady dependency

  const handleAddressSelectionChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === 'new') {
      form.reset({
        // Reset to user's details or blank for a truly new address
        fullName: user?.displayName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        saveAddress: false,
        newAddressLabel: '',
      });
    } else if (user?.addresses) {
      const selected = user.addresses.find(addr => addr.id === addressId);
      if (selected) {
        form.reset({
          ...form.getValues(), // Keep existing values like email, saveAddress
          fullName: selected.fullName,
          // email: selected.email, // User's primary email is usually better here
          phone: selected.phone,
          addressLine1: selected.addressLine1,
          addressLine2: selected.addressLine2 || '',
          city: selected.city,
          state: selected.state,
          postalCode: selected.postalCode,
          country: selected.country,
        });
      }
    }
  };

  const onSubmit: SubmitHandler<CheckoutFormValues> = (data) => {
    const orderDetailsForToast = `Order with ${cartItems.length} items, Total: ₹${cartTotal.toFixed(2)}`;

    // If user is logged in, saveAddress is checked, and it's a new address entry
    if (user && data.saveAddress && selectedAddressId === 'new') {
      if (!data.newAddressLabel || data.newAddressLabel.trim() === '') {
        toast({ title: "Missing Label", description: "Please provide a label for the new address if you want to save it.", variant: "destructive" });
        form.setError("newAddressLabel", { type: "manual", message: "Label is required to save address." });
        return;
      }
      const addressToSave: Omit<ShippingAddress, 'id'> & { label: string } = {
        label: data.newAddressLabel,
        fullName: data.fullName,
        email: data.email, // Use form email for the address entry
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
      };
      addAddress(addressToSave);
      toast({ title: "Address Saved", description: `Address "${data.newAddressLabel}" added to your account.` });
    }

    // Simulate order placement
    const mockOrderId = `SUTRA-${Date.now()}`;
    console.log('Order Placed with Shipping Address:', data);
    
    clearCart();
    toast({ title: "Order Placed Successfully!", description: `Your order ${mockOrderId} is confirmed. ${orderDetailsForToast}` });
    router.push(`/order-confirmation/${mockOrderId}`);
  };
  
  if (!isCartReady || authLoading || cartItems.length === 0 && isCartReady) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">
            {!isCartReady || authLoading ? "Loading checkout..." : (cartItems.length === 0 ? "Your cart is empty. Redirecting..." : "Preparing checkout...")}
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {user && user.addresses && user.addresses.length > 0 && (
              <Card className="shadow-md">
                <CardHeader><CardTitle>Select Shipping Address</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelectionChange} className="space-y-3">
                    {user.addresses.map((addr) => (
                      <Label key={addr.id} htmlFor={addr.id} className="flex items-start p-4 border rounded-md hover:bg-accent/50 cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                        <RadioGroupItem value={addr.id!} id={addr.id!} className="mr-3 mt-1" />
                        <div>
                          <p className="font-semibold">{addr.label} <span className="font-normal text-sm text-muted-foreground">- {addr.fullName}</span></p>
                          <p className="text-sm text-muted-foreground">{addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}</p>
                        </div>
                      </Label>
                    ))}
                    <Label htmlFor="new-address-option" className="flex items-start p-4 border rounded-md hover:bg-accent/50 cursor-pointer has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground">
                      <RadioGroupItem value="new" id="new-address-option" className="mr-3 mt-1" />
                      <div>
                        <p className="font-semibold">Use a new address</p>
                        <p className="text-sm text-muted-foreground">Enter shipping details below.</p>
                      </div>
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>{selectedAddressId === 'new' || !user || user.addresses?.length === 0 ? "Enter Shipping Information" : "Confirm Shipping Information"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full name" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="Email" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="Phone number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="addressLine1" render={({ field }) => (
                  <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input placeholder="Street address, P.O. box" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="addressLine2" render={({ field }) => (
                  <FormItem><FormLabel>Address Line 2 (Optional)</FormLabel><FormControl><Input placeholder="Apartment, suite, unit" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="City" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input placeholder="State or province" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="postalCode" render={({ field }) => (
                    <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input placeholder="Postal code" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="Country" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
                {user && selectedAddressId === 'new' && (
                  <div className="space-y-4 pt-4 border-t mt-4">
                     <FormField
                        control={form.control}
                        name="saveAddress"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Save this address to my account</FormLabel>
                                <FormDescription>For faster checkout next time.</FormDescription>
                            </div>
                            </FormItem>
                        )}
                        />
                    {form.watch('saveAddress') && (
                         <FormField
                            control={form.control}
                            name="newAddressLabel"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Label for this address (e.g., Home, Work)</FormLabel>
                                <FormControl>
                                    <Input placeholder="My Primary Address" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                       <div className="flex items-center gap-2">
                        <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded" data-ai-hint="cart item" />
                        <div>
                          <p className="font-medium">{item.name} (x{item.quantity})</p>
                          <p className="text-xs text-muted-foreground">{item.weight}</p>
                        </div>
                      </div>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>Free</span></div>
                  <Separator className="my-3" />
                  <div className="flex justify-between text-lg font-bold"><span>Total</span><span>₹{cartTotal.toFixed(2)}</span></div>
                </div>
              </CardContent>
              <CardFooter className="p-4">
                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting || cartItems.length === 0}>
                  {form.formState.isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </MainLayout>
  );
}
