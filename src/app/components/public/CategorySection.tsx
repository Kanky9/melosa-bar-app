import type { Category, Product } from '@/types';
import ProductCard from './ProductCard';

interface CategorySectionProps {
  category: Category;
  products: Product[];
}

export default function CategorySection({ category, products }: CategorySectionProps) {
  if (products.length === 0) {
    return null; // Don't render section if no products in this category
  }

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-primary mb-6 pb-2 border-b-2 border-primary">{category.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
