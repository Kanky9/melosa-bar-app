import type { Product } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Assuming you might want to use it later

export default function ProductItemCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      {/* Image container - maintains aspect ratio */}
      <div className="relative w-full aspect-[4/3] bg-muted">
        <Image
          src={product.imageUrl || 'https://placehold.co/600x400.png'}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="product item"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold text-foreground">{product.name}</CardTitle>
        {product.description && (
          <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardFooter className="p-4 mt-auto flex justify-end items-center">
        <div className="bg-black/75 px-3 py-1 rounded-md shadow-md">
          <span className="text-lg font-bold text-accent">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
