
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
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { products } from '@/data/products'; 
import type { ProductVariant } from '@/types';
import { Package, Mail, ChevronsUpDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Schema for product selections (checkboxes)
const productSelectionSchemaObject = products.reduce((acc, product) => {
  acc[product.id] = z.boolean().optional();
  return acc;
}, {} as Record<string, z.ZodOptional<z.ZodBoolean>>);

const productSelectionSchema = z.object(productSelectionSchemaObject)
  .refine(
    (data) => Object.values(data).some((isSelected) => isSelected),
    { message: "Please select at least one product." }
  );

// Schema for quantity input (must be a positive number string, or empty/undefined)
const quantityInputSchema = z.string()
  .optional()
  .refine(val => val === undefined || val === "" || /^[1-9]\d*$/.test(val), {
    message: "Quantity must be a positive number."
  });

const bulkInquirySchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  companyName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format"),
  productSelections: productSelectionSchema,
  quantitiesPerVariant: z.record(z.string(), quantityInputSchema), // Key: variant.sku, Value: quantity string
  shippingAddressCity: z.string().optional(),
  additionalMessage: z.string().max(500, { message: "Message cannot exceed 500 characters."}).optional(),
}).refine(data => {
  const selectedProductIds = Object.keys(data.productSelections).filter(id => data.productSelections[id]);
  if (selectedProductIds.length === 0) {
    return true; // No products selected, no quantities needed.
  }

  let atLeastOneQuantityEntered = false;
  for (const productId of selectedProductIds) {
    const product = products.find(p => p.id === productId);
    if (product) {
      for (const variant of product.variants) {
        const qtyValue = data.quantitiesPerVariant?.[variant.sku!];
        if (qtyValue && /^[1-9]\d*$/.test(qtyValue)) { // If quantity is a positive number string
          atLeastOneQuantityEntered = true;
          break;
        }
      }
    }
    if (atLeastOneQuantityEntered) break;
  }
  
  if (!atLeastOneQuantityEntered) {
    // This error will appear at the bottom of the form.
    // A specific FormMessage for the quantity section could be added manually if needed.
    return false;
  }
  return true;
}, { message: "For selected products, please enter a valid quantity for at least one weight/variant." });


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
      quantitiesPerVariant: {},
      shippingAddressCity: '',
      additionalMessage: '',
    },
  });

  const watchedProductSelections = form.watch("productSelections");
  const selectedProductsDetails = products.filter(p => watchedProductSelections[p.id]);

  const onSubmit = async (data: BulkInquiryFormValues) => {
    const selectedProductsOutput = products
      .filter(p => data.productSelections[p.id])
      .map(p => p.name);

    const quantitiesOutput = Object.entries(data.quantitiesPerVariant)
      .filter(([, qty]) => qty && /^[1-9]\d*$/.test(qty)) // Filter for valid, positive quantities
      .reduce((acc, [sku, qty]) => {
        const product = products.find(p => p.variants.some(v => v.sku === sku));
        const variant = product?.variants.find(v => v.sku === sku);
        if (product && variant) {
          if (!acc[product.name]) {
            acc[product.name] = [];
          }
          acc[product.name].push({ weight: variant.weight, quantity: qty! });
        }
        return acc;
      }, {} as Record<string, {weight: string, quantity: string}[]>);

    const submissionData = {
      fullName: data.fullName,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      productsOfInterest: selectedProductsOutput,
      quantitiesPerVariant: quantitiesOutput,
      shippingAddressCity: data.shippingAddressCity,
      additionalMessage: data.additionalMessage,
    };

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
                {/* Contact Information Fields */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="Your Full Name" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                      <FormItem><FormLabel>Company Name (Optional)</FormLabel><FormControl><Input placeholder="Your Company Name" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email Address <span className="text-destructive">*</span></FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone Number <span className="text-destructive">*</span></FormLabel><FormControl><Input type="tel" placeholder="Your Phone Number" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
                
                {/* Product Selection Checkboxes */}
                <FormField
                  control={form.control}
                  name="productSelections"
                  render={() => ( 
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Product(s) of Interest <span className="text-destructive">*</span></FormLabel>
                      <FormDescription>Select all products you are interested in.</FormDescription>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2">
                        {products.map((product) => (
                          <FormField
                            key={product.id}
                            control={form.control}
                            name={`productSelections.${product.id}`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md border border-transparent hover:border-muted-foreground/20 transition-colors">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id={`product-${product.id}`}/></FormControl>
                                <FormLabel htmlFor={`product-${product.id}`} className="font-normal text-sm cursor-pointer flex-grow">{product.name}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      {form.formState.errors.productSelections?.root?.message && (
                         <FormMessage className="pt-1">{form.formState.errors.productSelections.root.message}</FormMessage>
                      )}
                      {!form.formState.errors.productSelections?.root?.message && form.formState.errors.productSelections && (
                         <FormMessage className="pt-1">Please select at least one product.</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                {/* Dynamic Estimated Quantities Section */}
                {selectedProductsDetails.length > 0 && (
                  <Card className="p-4 pt-2 bg-muted/30">
                    <CardHeader className="p-2 mb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <ChevronsUpDown className="h-5 w-5 text-primary"/>
                            Estimated Quantities for Selected Products
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Enter the quantity for each specific weight/variant you need.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-2">
                      {selectedProductsDetails.map((product) => (
                        <div key={product.id} className="space-y-3 p-3 border rounded-md bg-background shadow-sm">
                          <h4 className="font-medium text-md text-primary">{product.name}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            {product.variants.map((variant: ProductVariant) => (
                              <FormField
                                key={variant.sku}
                                control={form.control}
                                name={`quantitiesPerVariant.${variant.sku!}`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel htmlFor={variant.sku!} className="text-sm font-normal text-muted-foreground">
                                      Quantity for: <span className="font-medium text-foreground">{variant.weight}</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        id={variant.sku!}
                                        type="text" // Using text to allow empty, validating for number pattern
                                        placeholder="e.g., 50"
                                        {...field}
                                        onChange={e => {
                                          const val = e.target.value;
                                          // Allow only numbers or empty string
                                          if (val === "" || /^\d*$/.test(val)) {
                                            field.onChange(val);
                                          }
                                        }}
                                        value={field.value || ""} // Ensure controlled component, default to empty string
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                     {/* Display global error for quantitiesPerVariant refine check */}
                    {form.formState.errors.root?.message && form.formState.errors.root.message.includes("quantity for at least one") && (
                        <p className="text-sm font-medium text-destructive p-2">{form.formState.errors.root.message}</p>
                    )}
                  </Card>
                )}
                
                {/* Other Fields */}
                <FormField control={form.control} name="shippingAddressCity" render={({ field }) => (
                    <FormItem><FormLabel>Shipping City/Region (Optional)</FormLabel><FormControl><Input placeholder="e.g., Bangalore, Karnataka" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="additionalMessage" render={({ field }) => (
                    <FormItem><FormLabel>Additional Message (Optional)</FormLabel><FormControl><Textarea placeholder="Any specific requirements or questions?" {...field} rows={4}/></FormControl><FormMessage /></FormItem>
                )}/>

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

    