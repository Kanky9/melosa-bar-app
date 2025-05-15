import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// Removed Button as it's not used
import type { Product } from '@/types';

interface ProductItemCardProps {
  product: Product;
}

export default function ProductItemCard({ product }: ProductItemCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-semibold text-foreground truncate" title={product.name}>
          {product.name}
        </CardTitle>
        {/* Description is not shown as per user request */}
        {/* {product.description && (
          <CardDescription className="text-sm text-muted-foreground h-10 overflow-hidden text-ellipsis">
            {product.description}
          </CardDescription>
        )} */}
      </CardHeader>
      {/* Image is not shown as per user request */}
      {/* <CardContent className="p-4 flex-grow flex items-center justify-center">
        <Image
          src={product.imageUrl || 'https://placehold.co/300x200.png'}
          alt={product.name}
          width={300}
          height={200}
          className="rounded-md object-cover max-h-40 w-auto"
        />
      </CardContent> */}
      <CardContent className="p-4 flex-grow">
        {/* This space can be used for other minimal content if needed, or CardContent can be removed if header/footer are enough */}
        {product.description && (
           <p className="text-sm text-muted-foreground italic line-clamp-2">{product.description}</p>
        )}
      </CardContent>
      <CardFooter className="pt-3 pb-4 px-4 mt-auto bg-card-foreground/5">
        <div className="flex justify-end items-center w-full">
          <div className="text-lg font-semibold text-accent bg-black/20 px-3 py-1 rounded-md shadow">
            ${product.price.toFixed(2)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
