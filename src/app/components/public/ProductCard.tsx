import type { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          src={product.imageUrl || 'https://placehold.co/600x400.png'}
          alt={product.name}
          width={600}
          height={400}
          className="object-cover w-full h-48"
          data-ai-hint={product.categoryId === 'cat1' ? "cocktail drink" : product.categoryId === 'cat2' ? "refreshing beverage" : product.categoryId === 'cat3' ? "appetizer food" : product.categoryId === 'cat4' ? "delicious meal" : "sweet dessert"}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-semibold mb-1">{product.name}</CardTitle>
        {product.description && (
          <CardDescription className="text-sm text-muted-foreground mb-2 h-12 overflow-hidden text-ellipsis">
            {product.description}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <Badge variant="secondary" className="text-lg font-bold text-accent-foreground bg-accent px-3 py-1">
          {formatPrice(product.price)}
        </Badge>
      </CardFooter>
    </Card>
  );
}
