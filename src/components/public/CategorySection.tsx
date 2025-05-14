
import type { Category, Product } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CategorySectionProps {
  category: Category;
  products: Product[];
}

export default function CategorySection({ category, products }: CategorySectionProps) {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <section aria-labelledby={`category-${category.id}-heading`} className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 id={`category-${category.id}-heading`} className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6 md:mb-8 text-center sm:text-left">
          {category.name}
        </h2>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center sm:text-left">No hay productos en esta categoría por el momento.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={product.imageUrl || 'https://placehold.co/600x400.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={product.imageUrl ? product.name.toLowerCase().split(" ").slice(0,2).join(" ") : "food drink"}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl leading-tight">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  {product.description && (
                    <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-3">
                      {product.description}
                    </CardDescription>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-2 pb-4 px-6">
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(product.price)}
                  </p>
                  <Badge variant="secondary">{category.name}</Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
