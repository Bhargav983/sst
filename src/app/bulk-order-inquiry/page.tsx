
"use client";

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
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
import { products } from '@/data/products'; // Import products
import { Package, Mail } from 'lucide-react';

// Create a dynamic schema for product selections
const productSelectionSchemaObject = products.reduce((acc, product) => {
  acc[product.id] = z.boolean().optional();
  return acc;
}, {} as Record<string, z.ZodOptional<z.ZodBoolean>>);

const productSelectionSchema = z.object(productSelectionSchemaObject)
  .refine(
    (data) => Object.values(data).some((isSelected) => isSelected),
    { message: "Please select at least one product." }
  );

const bulkInquirySchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  companyName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format"),
  productSelections: productSelectionSchema, // Changed from productsOfInterest
  estimatedQuantities: z.string().min(1, { message: "Please provide estimated quantities." }),
  shippingAddressCity: z.string().optional(),
  additionalMessage: z.string().max(500, { message: "Message cannot exceed 500 characters."}).optional(),
});

type BulkInquiryFormValues = z.infer<typeof bulkInquirySchema>;

export default function BulkOrderInquiryPage() {
  const { toast } = useToast();
  
  const defaultProductSelections = products.reduce((acc, product) => {
    acc[product.id] = false;
    return acc;
  }, {} as Record<string, boolean>);

  const form = useForm<BulkInquiryFormValues>({
    resolver: zodResolver(bulkInquirySchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      productSelections: defaultProductSelections,
      estimatedQuantities: '',
      shippingAddressCity: '',
      additionalMessage: '',
    },
  });

  const onSubmit = async (data: BulkInquiryFormValues) => {
    const selectedProductNames = products
      .filter(p => data.productSelections[p.id])
      .map(p => p.name);

    const submissionData = {
      ...data,
      productsOfInterest: selectedProductNames, // Add the array of names for logging/submission
    };
    delete (submissionData as any).productSelections; // Clean up the map

    console.log("Bulk Order Inquiry Submitted:", submissionData);
    
    toast({
        title: "Inquiry Submitted Successfully!",
        description: "Thank you for your interest. We will review your inquiry and get back to you shortly.",
        duration: 7000,
    });
    
    form.reset();
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center py-8 md:py-12">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <Package className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-2xl md:text-3xl font-bold">Bulk Order Inquiry</CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Interested in larger quantities for your business or event? Please fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Your Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Your Phone Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="productSelections"
                  render={() => ( // No 'field' needed here as individual checkboxes handle their own state via nested FormFields
                    <FormItem>
                      <FormLabel className="text-base">Product(s) of Interest <span className="text-destructive">*</span></FormLabel>
                      <FormDescription>Select all products you are interested in.</FormDescription>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2">
                        {products.map((product) => (
                          <FormField
                            key={product.id}
                            control={form.control}
                            name={`productSelections.${product.id}`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md border border-transparent hover:border-muted-foreground/20 transition-colors">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id={`product-${product.id}`}
                                  />
                                </FormControl>
                                <FormLabel htmlFor={`product-${product.id}`} className="font-normal text-sm cursor-pointer flex-grow">
                                  {product.name}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      {/* Manually render error message for the group if refine fails */}
                      {form.formState.errors.productSelections?.root?.message && (
                         <FormMessage className="pt-1">{form.formState.errors.productSelections.root.message}</FormMessage>
                      )}
                       {/* Fallback if root message isn't there but general error on productSelections */}
                      {!form.formState.errors.productSelections?.root?.message && form.formState.errors.productSelections && (
                         <FormMessage className="pt-1">Please select at least one product.</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="estimatedQuantities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Quantities <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Andhra Chilli Paste - 50 units (250g each), Kerala Paste - 20 units (500g each)" {...field} rows={2}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingAddressCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping City/Region (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bangalore, Karnataka" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any specific requirements or questions?" {...field} rows={4}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-lg py-6" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
