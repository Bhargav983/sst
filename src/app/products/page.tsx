
import { MainLayout } from '@/components/layout/main-layout';
import { ProductCard } from '@/components/product-card';
import { products } from '@/data/products';

export default function ProductsPage() {
  return (
    <MainLayout>
      <section>
        <h1 className="text-3xl font-semibold mb-8 text-center text-foreground">All Masala Pastes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
