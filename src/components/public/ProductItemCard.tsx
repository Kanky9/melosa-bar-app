
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/types';

interface ProductItemCardProps {
  product: Product;
}

export default function ProductItemCard({ product }: ProductItemCardProps) {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-4 flex-grow">
        <CardTitle className="text-xl font-semibold text-foreground mb-1 leading-tight" title={product.name}>
          {product.name}
        </CardTitle>
        {product.description && (
          <CardDescription className="text-sm text-muted-foreground mt-2 break-words">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="mt-auto"> {/* Pushes price to the bottom of CardContent */}
          <div className="inline-block bg-black/75 px-3 py-1 rounded-md shadow-md">
            <p className="text-lg font-bold text-accent">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
