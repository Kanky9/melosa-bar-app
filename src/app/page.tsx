import { mockCategories, mockProducts } from '@/lib/mockData';
import CategorySection from '@/components/public/CategorySection';
import type { Category, Product } from '@/types';

// Simulate fetching data. In a real app, this would be an async function.
function getCatalogData() {
  const categories: Category[] = mockCategories;
  const products: Product[] = mockProducts;
  return { categories, products };
}

export default function CatalogPage() {
  const { categories, products } = getCatalogData();

  return (
    <div className="space-y-12">
      <header className="text-center my-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
          Bienvenido a <span className="text-primary">Melosa Bar</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Descubre nuestro delicioso menú, preparado con los mejores ingredientes.
        </p>
      </header>
      
      {categories.map((category) => {
        const productsInCategory = products.filter(
          (product) => product.categoryId === category.id
        );
        return (
          <CategorySection
            key={category.id}
            category={category}
            products={productsInCategory}
          />
        );
      })}
    </div>
  );
}
