import type { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image'; // Import next/image

interface ProductItemCardProps {
  product: Product;
}

export default function ProductItemCard({ product }: ProductItemCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      {/* Image section removed as per request */}
      {/* 
      {product.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <Image 
            src={product.imageUrl} 
            alt={product.name} 
            width={400} 
            height={225} 
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      */}
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground">{product.name}</CardTitle>
        {/* Description removed as per request */}
        {/* 
        {product.description && (
          <p className="text-sm text-muted-foreground mt-1 truncate">{product.description}</p>
        )}
        */}
      </CardHeader>
      <CardContent className="flex-grow px-4 pb-3 pt-1">
        {/* Content can be added here if needed in the future */}
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-2 bg-muted/50">
        <p className="text-foreground font-semibold text-lg text-glow-primary">
          ${product.price.toFixed(2)}
        </p>
      </CardFooter>
    </Card>
  );
}
