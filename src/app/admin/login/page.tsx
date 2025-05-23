
"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    if (data.email === 'admin@example.com' && data.password === 'password') { 
      login({ 
        uid: 'admin-mock-uid', 
        email: data.email, 
        displayName: 'Admin User', 
        isAdmin: true,
        role: 'admin' 
      });
      toast({
          title: "Admin Login Successful",
          description: "Redirecting to dashboard...",
      });
      router.push('/admin/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>Access the SutraCart dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
