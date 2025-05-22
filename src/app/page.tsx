
import { MainLayout } from '@/components/layout/main-layout';
import { ProductCard } from '@/components/product-card';
import { products } from '@/data/products';
import { HeroSlider, type Slide } from '@/components/hero-slider'; // Import HeroSlider and Slide type

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
    buttonLink: '/products', // Placeholder, could be an 'About Us' or specific quality page
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

      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">Our Signature Masala Pastes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
