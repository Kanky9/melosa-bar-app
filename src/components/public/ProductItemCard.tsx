import type { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image'; // Assuming you might want images later
import { Badge } from '@/components/ui/badge';

interface ProductItemCardProps {
  product: Product;
}

export default function ProductItemCard({ product }: ProductItemCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full rounded-lg">
      {/* Image section - currently commented out as per request */}
      {/* {product.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint="product drink"
          />
        </div>
      )} */}
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xl font-semibold tracking-tight truncate" title={product.name}>
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-4 pb-4 flex flex-col justify-between">
        {/* Description - currently commented out as per request */}
        {/* {product.description && (
          <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </CardDescription>
        )} */}
        {/* Spacer if no description to push price to bottom */}
        {/* {!product.description && <div className="flex-grow"></div>}  */}
        
        <div className="mt-auto"> {/* Ensures price is at the bottom if content above is sparse */}
          <p className="text-xl font-bold text-accent text-shadow-subtle">
            S/.{product.price.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
