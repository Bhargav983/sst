
import { MainLayout } from '@/components/layout/main-layout';
import { ProductCard } from '@/components/product-card';
import { products } from '@/data/products';
import { HeroSlider, type Slide } from '@/components/hero-slider';
import { ReviewCard } from '@/components/review-card';
import { reviews } from '@/data/reviews';
import { Leaf, ScrollText, ShieldCheck, PackageCheck } from 'lucide-react'; // Added PackageCheck

const heroSlidesData: Slide[] = [
  {
    id: 1,
    imageUrl: 'https://placehold.co/1200x600.png',
    dataAiHint: 'spices variety',
    title: 'Discover Authentic Flavors',
    description: 'Handcrafted masala pastes made with the freshest ingredients and traditional South Indian recipes.',
    buttonText: 'Explore Our Pastes',
    buttonLink: '/products',
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/1200x600.png',
    dataAiHint: 'cooking meal',
    title: 'Elevate Your Culinary Creations',
    description: 'Unlock rich tastes and aromatic experiences that will transform your everyday meals.',
    buttonText: 'Shop All Products',
    buttonLink: '/products',
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/1200x600.png',
    dataAiHint: 'fresh ingredients',
    title: 'Pure Ingredients, Powerful Taste',
    description: 'We source only the best quality spices and natural ingredients for an unparalleled flavor profile.',
    buttonText: 'Learn About Quality',
    buttonLink: '/products', 
  },
  {
    id: 4,
    imageUrl: 'https://placehold.co/1200x600.png',
    dataAiHint: 'south indian dish',
    title: 'A Taste of South India, Delivered',
    description: 'Bring the authentic essence of South Indian kitchens to your home with SutraCart.',
    buttonText: 'View Collection',
    buttonLink: '/products',
  },
];

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSlider slides={heroSlidesData} />

      <section className="py-12 md:py-16">
        <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">Our Signature Masala Pastes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-10 text-center text-foreground">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.slice(0,3).map(review => ( // Displaying first 3 reviews for a cleaner look, can adjust
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-10 text-center text-foreground">Our Commitment to Quality</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center p-6 border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-card">
              <Leaf className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">100% Fresh Ingredients</h3>
              <p className="text-sm text-muted-foreground">Only the best, locally sourced spices and natural components.</p>
            </div>
            <div className="flex flex-col items-center p-6 border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-card">
              <ScrollText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Authentic Recipes</h3>
              <p className="text-sm text-muted-foreground">Traditional South Indian formulations passed down through generations.</p>
            </div>
            <div className="flex flex-col items-center p-6 border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-card">
              <ShieldCheck className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Quality Assured</h3>
              <p className="text-sm text-muted-foreground">Rigorous quality checks to ensure premium taste and safety.</p>
            </div>
            <div className="flex flex-col items-center p-6 border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-card">
              <PackageCheck className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Hygienically Packed</h3>
              <p className="text-sm text-muted-foreground">Carefully packed to preserve freshness and ensure product safety.</p>
            </div>
          </div>
        </div>
      </section>

    </MainLayout>
  );
}
