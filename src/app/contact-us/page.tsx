
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have this component
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactUsPage() {
  // Placeholder for form handling
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here (e.g., send data to backend or email service)
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 md:py-12">
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-primary/10 p-6 md:p-8">
            <CardTitle className="text-3xl font-bold text-primary text-center">Get in Touch</CardTitle>
            <p className="text-center text-muted-foreground mt-2">We'd love to hear from you! Whether you have a question about our products, an order, or anything else, our team is ready to answer all your questions.</p>
          </CardHeader>
          <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
            {/* Contact Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground">Email Us</h3>
                  <a href="mailto:support@sutracart.com" className="text-primary hover:underline">support@sutracart.com</a>
                  <p className="text-xs text-muted-foreground">We typically respond within 24 hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground">Call Us</h3>
                  <a href="tel:+919876543210" className="text-primary hover:underline">+91 98765 43210</a>
                  <p className="text-xs text-muted-foreground">Mon-Fri, 9am - 6pm IST</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground">Our Address</h3>
                  <p className="text-muted-foreground">
                    SutraCart Headquarters<br />
                    123 Masala Lane, Spice Nagar,<br />
                    Bangalore, Karnataka 560001, India
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form Placeholder Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input id="name" name="name" type="text" placeholder="Your Full Name" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                  <Input id="subject" name="subject" type="text" placeholder="Reason for your message" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                  <Textarea id="message" name="message" placeholder="Write your message here..." required rows={5} className="mt-1" />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
