
"use client";

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertCircle, UserCog, PlusCircle, Home, Edit2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { ShippingAddress } from '@/types';
import { Separator } from '@/components/ui/separator';

const profileSettingsSchema = z.object({
  displayName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format").or(z.literal("")).optional(),
});

type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;

// Schema for adding/editing an address
const addressSchema = z.object({
  label: z.string().min(2, { message: "Label must be at least 2 characters (e.g., Home, Work)." }),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format"),
  addressLine1: z.string().min(5, { message: "Address line 1 must be at least 5 characters." }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State/Province must be at least 2 characters." }),
  postalCode: z.string().min(3, { message: "Postal code must be at least 3 characters." }),
  country: z.string().min(2, { message: "Country must be at least 2 characters." }),
  // email is not part of address specific form as it's usually tied to account
});

type AddressFormValues = Omit<ShippingAddress, 'id' | 'email'>;


export default function ProfileSettingsPage() {
  const { user, login, addAddress, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);

  const profileForm = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      displayName: '',
      phone: '',
    },
  });

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (user) {
      profileForm.reset({
        displayName: user.displayName || '',
        phone: user.phone || '',
      });
      // If editing, prefill addressForm based on selected address
      // For adding, use default values
      addressForm.reset({
        label: '',
        fullName: user.displayName || '', // Pre-fill with user's name
        phone: user.phone || '', // Pre-fill with user's phone
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      });
    }
  }, [user, loading, profileForm, addressForm, router]);

  const onProfileSubmit = async (data: ProfileSettingsFormValues) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    const updatedUser = { ...user, displayName: data.displayName, phone: data.phone || null };
    login(updatedUser); // Updates context and localStorage
    toast({ title: "Profile Updated", description: "Your account details have been updated." });
  };

  const onAddressSubmit: SubmitHandler<AddressFormValues> = (data) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    // Construct the address object for addAddress context function
    const newAddressPayload: Omit<ShippingAddress, 'id'> & { label: string } = {
        ...data,
        email: user.email || '', // Add user's primary email to the address
    };
    addAddress(newAddressPayload);
    toast({ title: "Address Added", description: `Address "${data.label}" has been saved.` });
    setIsAddAddressDialogOpen(false); // Close dialog
    addressForm.reset(); // Reset form
  };


  if (loading) {
    return <MainLayout><div className="text-center py-10">Loading account settings...</div></MainLayout>;
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center text-center py-20">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Please log in.</p>
          <Link href="/login"><Button>Login</Button></Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Profile Settings Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCog className="w-6 h-6 text-primary" /> Your Profile</CardTitle>
            <CardDescription>Manage your personal information. Email address is read-only.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Enter full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Email Address (Read-only)</FormLabel>
                  <FormControl><Input type="email" value={user.email || ''} readOnly disabled className="bg-muted/50 cursor-not-allowed" /></FormControl>
                </FormItem>
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input type="tel" placeholder="Enter phone number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={profileForm.formState.isSubmitting}>
                  {profileForm.formState.isSubmitting ? "Saving..." : "Save Profile Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator />

        {/* Address Management Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Home className="w-6 h-6 text-primary" /> My Addresses</CardTitle>
              <CardDescription>Manage your saved shipping addresses.</CardDescription>
            </div>
            <Dialog open={isAddAddressDialogOpen} onOpenChange={setIsAddAddressDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add New Address</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Shipping Address</DialogTitle>
                  <DialogDescription>Enter the details for your new shipping address.</DialogDescription>
                </DialogHeader>
                <Form {...addressForm}>
                  <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                    <FormField control={addressForm.control} name="label" render={({ field }) => (
                      <FormItem><FormLabel>Address Label (e.g., Home, Work)</FormLabel><FormControl><Input placeholder="My Home Base" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={addressForm.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={addressForm.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="Phone Number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={addressForm.control} name="addressLine1" render={({ field }) => (
                      <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input placeholder="Street address, P.O. box" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={addressForm.control} name="addressLine2" render={({ field }) => (
                      <FormItem><FormLabel>Address Line 2 (Optional)</FormLabel><FormControl><Input placeholder="Apartment, suite, etc." {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={addressForm.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="City" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={addressForm.control} name="state" render={({ field }) => (
                        <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input placeholder="State" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={addressForm.control} name="postalCode" render={({ field }) => (
                        <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input placeholder="Postal Code" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={addressForm.control} name="country" render={({ field }) => (
                        <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="Country" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                    </div>
                     <DialogFooter className="pt-4">
                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={addressForm.formState.isSubmitting}>
                            {addressForm.formState.isSubmitting ? "Saving..." : "Save Address"}
                        </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {user.addresses && user.addresses.length > 0 ? (
              <div className="space-y-4">
                {user.addresses.map((address) => (
                  <Card key={address.id} className="p-4 bg-muted/30">
                    <CardHeader className="p-0 pb-2 flex flex-row justify-between items-start">
                        <div>
                            <CardTitle className="text-md">{address.label || 'Address'}</CardTitle>
                            <CardDescription className="text-xs">{address.fullName}</CardDescription>
                        </div>
                        {/* Placeholder for Edit/Delete buttons */}
                        {/* <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div> */}
                    </CardHeader>
                    <CardContent className="p-0 text-sm text-muted-foreground">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} {address.postalCode}</p>
                      <p>{address.country}</p>
                      <p>Phone: {address.phone}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">You have no saved addresses yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
