'use client';

import { useState, useEffect } from 'react';
import { mockCategories, mockProducts } from '@/lib/mockData';
import type { Category, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProductItemCard from '@/components/public/ProductItemCard';

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // null para "Todas"

  useEffect(() => {
    // Simular la carga de datos
    setCategories(mockCategories);
    setProducts(mockProducts);
    setSelectedCategoryId(null); // Por defecto, mostrar todas las categorías
  }, []);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  const displayedProducts = selectedCategoryId
    ? products.filter(product => product.categoryId === selectedCategoryId)
    : products;

  const selectedCategoryName = selectedCategoryId
    ? categories.find(cat => cat.id === selectedCategoryId)?.name
    : 'Nuestro Catálogo';

  return (
    <div className="space-y-8">
      <header className="text-center my-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
          Bienvenido a <span className="text-primary">Melosa Bar</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Descubre nuestro delicioso menú, preparado con los mejores ingredientes.
        </p>
      </header>

      {/* Filtros de Categoría */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center sr-only">Categorías</h2>
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 px-2 py-3 bg-muted rounded-lg shadow">
          <Button
            variant={selectedCategoryId === null ? 'default' : 'outline'}
            onClick={() => handleCategoryClick(null)}
            className="text-sm md:text-base h-10 px-4 rounded-md shadow-sm transition-all duration-150 ease-in-out hover:scale-105"
            aria-pressed={selectedCategoryId === null}
          >
            Todas
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategoryId === category.id ? 'default' : 'outline'}
              onClick={() => handleCategoryClick(category.id)}
              className="text-sm md:text-base h-10 px-4 rounded-md shadow-sm transition-all duration-150 ease-in-out hover:scale-105"
              aria-pressed={selectedCategoryId === category.id}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Lista de Productos en una Carta Principal */}
      <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-card-foreground/5 p-6">
          <CardTitle className="text-3xl font-bold text-center text-foreground">
            {selectedCategoryName}
          </CardTitle>
          {selectedCategoryId && products.length > 0 && displayedProducts.length > 0 && (
            <CardDescription className="text-center text-muted-foreground pt-1">
              {displayedProducts.length} {displayedProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {displayedProducts.map((product) => (
                <ProductItemCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-lg">
              No hay productos disponibles en esta categoría.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
