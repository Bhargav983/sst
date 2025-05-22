
"use client";

import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Keep if used directly, FormLabel is preferred
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
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
import { AlertCircle, UserCog } from 'lucide-react';

const profileSettingsSchema = z.object({
  displayName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format").or(z.literal("")).optional(),
});

type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;

export default function ProfileSettingsPage() {
  const { user, login, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login'); // Redirect to login if not authenticated
    }
    if (user) {
      form.reset({
        displayName: user.displayName || '',
        phone: user.phone || '',
      });
    }
  }, [user, loading, form, router]);

  const onSubmit = async (data: ProfileSettingsFormValues) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to update settings.", variant: "destructive" });
      return;
    }

    const updatedUser = {
      ...user,
      displayName: data.displayName,
      phone: data.phone || null, // Ensure phone is null if empty string
    };
    
    login(updatedUser); // This updates context and localStorage in our mock setup
    toast({
      title: "Profile Updated",
      description: "Your account details have been successfully updated.",
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-10">Loading account settings...</div>
      </MainLayout>
    );
  }

  if (!user) {
     // This case should ideally be handled by the useEffect redirect, but as a fallback:
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center text-center py-20">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your account settings.</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <UserCog className="w-8 h-8 text-primary" /> Account Settings
        </h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your personal information. Email address cannot be changed here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormItem>
                  <FormLabel>Email Address (Read-only)</FormLabel>
                  <FormControl>
                    <Input type="email" value={user.email || ''} readOnly disabled className="bg-muted/50 cursor-not-allowed" />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
