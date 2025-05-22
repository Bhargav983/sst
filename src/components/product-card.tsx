
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} legacyBehavior passHref>
          <a className="block aspect-[4/3] relative overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.dataAiHint || 'spice product'}
            />
          </a>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.slug}`} legacyBehavior passHref>
          <a>
            <CardTitle className="text-lg font-semibold mb-1 hover:text-primary transition-colors">{product.name}</CardTitle>
          </a>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{product.weight}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Link href={`/products/${product.slug}`} legacyBehavior passHref>
          <Button asChild variant="outline" className="w-full">
            <a>View Details <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
