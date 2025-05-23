
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, ChefHat, FileText, Info, MessageSquare, Package } from 'lucide-react'; // Added Package

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 text-foreground">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: About SutraCart */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">SutraCart</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Authentic South Indian masala pastes, handcrafted with love and tradition. Bringing the taste of South India to your kitchen, one delicious meal at a time.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/about-us" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"><Info size={16}/>About Us</Link></li>
              <li><Link href="/contact-us" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"><MessageSquare size={16}/>Contact Us</Link></li>
              <li><Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">Your Cart</Link></li>
              <li><Link href="/profile/orders" className="text-muted-foreground hover:text-primary transition-colors">Order History</Link></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Login / Sign Up</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Contact Us</h3>
            <address className="not-italic text-sm space-y-2">
              <p className="flex items-start gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <a href="mailto:support@sutracart.com" className="hover:text-primary transition-colors">support@sutracart.com</a>
              </p>
              <p className="flex items-start gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a>
              </p>
              <div className="flex items-start gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <p>
                  123 Masala Lane, Spice Nagar,<br />
                  Bangalore, Karnataka 560001,<br />
                  India
                </p>
              </div>
            </address>
             <div className="pt-2">
                <Link href="/bulk-order-inquiry" className="text-sm text-primary hover:underline flex items-center gap-1.5">
                    <Package size={16}/> Bulk Order Inquiries
                </Link>
            </div>
          </div>

          {/* Column 4: Legal & Follow Us */}
          <div className="space-y-3">
             <h3 className="text-lg font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
                <li><Link href="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"><FileText size={16}/>Terms &amp; Conditions</Link></li>
                {/* Add Privacy Policy link here when page is created */}
                {/* <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li> */}
            </ul>
            <div className="pt-3">
                <h3 className="text-lg font-semibold text-foreground">Follow Us</h3>
                <p className="text-sm text-muted-foreground">Stay updated with our latest products and offers.</p>
                <div className="flex space-x-3 mt-2">
                <Link href="#" passHref legacyBehavior>
                    <a aria-label="Facebook" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Facebook className="h-5 w-5" />
                    </a>
                </Link>
                <Link href="#" passHref legacyBehavior>
                    <a aria-label="Instagram" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Instagram className="h-5 w-5" />
                    </a>
                </Link>
                <Link href="#" passHref legacyBehavior>
                    <a aria-label="Twitter" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Twitter className="h-5 w-5" />
                    </a>
                </Link>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SutraCart. All rights reserved.</p>
          <p className="mt-1">A venture by South Sutra culinary artisans. Made with ❤️ in India.</p>
        </div>
      </div>
    </footer>
  );
}
