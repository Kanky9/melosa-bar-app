// src/components/public/ProductItemCard.tsx
'use client';

import type { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductItemCardProps {
  product: Product;
}

function formatPrice(price: number) {
  // Helper function to format price, e.g., $10.50
  return `$${price.toFixed(2)}`;
}

export default function ProductItemCard({ product }: ProductItemCardProps) {
  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-xl">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <p className="text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
        {/* Imagen y descripción omitidas intencionalmente */}
      </CardContent>
    </Card>
  );
}
