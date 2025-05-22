
import { MainLayout } from '@/components/layout/main-layout';
import { ProductCard } from '@/components/product-card';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <MainLayout>
      <section className="text-center mb-12 py-10 bg-secondary/50 rounded-lg shadow">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to SutraCart</h1>
        <p className="text-lg text-foreground/80 mb-6 max-w-2xl mx-auto">
          Experience the authentic flavors of South India with our handcrafted masala pastes. Made with the freshest ingredients and traditional recipes.
        </p>
        <Link href="/products">
            <Button size="lg">Explore Our Pastes</Button>
        </Link>
      </section>

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
