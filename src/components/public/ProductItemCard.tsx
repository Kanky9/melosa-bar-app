
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types";

interface ProductItemCardProps {
  product: Product;
}

export default function ProductItemCard({ product }: ProductItemCardProps) {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card className="flex flex-col justify-between h-full shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-semibold text-foreground mb-1">{product.name}</CardTitle>
        {product.description && (
          <CardDescription className="text-sm text-muted-foreground whitespace-pre-line">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        {/* Content can be added here if needed in the future */}
      </CardContent>
      <CardFooter className="p-4 bg-card-foreground/5 flex justify-end">
        {product.price > 0 && (
           <div className="bg-black/75 text-accent font-bold py-1 px-3 rounded-md text-lg">
            {formatPrice(product.price)}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
