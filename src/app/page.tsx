
'use client';

import { useState, useEffect, useMemo } from 'react';
import { mockCategories, mockProducts } from '@/lib/mockData';
import type { Category, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProductItemCard from '@/components/public/ProductItemCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface GroupedProducts {
  category: Category;
  products: Product[];
}

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCategories(mockCategories);
    setProducts(mockProducts);
    setSelectedCategoryId(null);
  }, []);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    // Optionally reset search term when category changes, or let search apply to new category
    // setSearchTerm(''); 
  };

  const productsToDisplay = useMemo(() => {
    let filtered = [...products]; // Create a new array to avoid mutating the original state

    if (selectedCategoryId) {
      filtered = filtered.filter(product => product.categoryId === selectedCategoryId);
    }

    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        (product.description && product.description.toLowerCase().includes(lowerSearchTerm))
      );
    }
    return filtered;
  }, [products, selectedCategoryId, searchTerm]);

  const groupedAndFilteredProducts = useMemo(() => {
    if (selectedCategoryId === null && searchTerm.trim() !== '') {
      // We are searching across ALL categories
      const groups: Record<string, { category: Category; products: Product[] }> = {};
      productsToDisplay.forEach(product => {
        const category = categories.find(cat => cat.id === product.categoryId);
        if (category) {
          if (!groups[category.id]) {
            groups[category.id] = { category, products: [] };
          }
          groups[category.id].products.push(product);
        }
      });
      return Object.values(groups).filter(group => group.products.length > 0);
    }
    return null; // Not grouping, or no search term
  }, [productsToDisplay, categories, selectedCategoryId, searchTerm]);


  const getPageTitle = () => {
    if (searchTerm.trim() !== '') {
      if (selectedCategoryId) {
        const catName = categories.find(cat => cat.id === selectedCategoryId)?.name;
        return `Resultados para "${searchTerm}" en ${catName || 'esta categoría'}`;
      }
      return `Resultados de la búsqueda para: "${searchTerm}"`;
    }
    return selectedCategoryId
      ? categories.find(cat => cat.id === selectedCategoryId)?.name || 'Categoría Desconocida'
      : 'Nuestro Catálogo';
  };
  
  const pageTitle = getPageTitle();

  const searchPlaceholder = selectedCategoryId
  ? `Buscar en ${categories.find(c => c.id === selectedCategoryId)?.name || 'esta categoría'}...`
  : "Buscar en todo el catálogo...";


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

      {/* Search Input */}
      <div className="mb-6 px-2">
        <div className="relative w-full md:w-3/4 lg:w-1/2 mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 h-11 text-base rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            aria-label="Buscar productos"
          />
        </div>
      </div>

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
            {pageTitle}
          </CardTitle>
          {!(selectedCategoryId === null && searchTerm.trim() !== '') && productsToDisplay.length > 0 && (
             <CardDescription className="text-center text-muted-foreground pt-1">
                {productsToDisplay.length} {productsToDisplay.length === 1 ? 'producto encontrado' : 'productos encontrados'}
             </CardDescription>
          )}
           {groupedAndFilteredProducts && groupedAndFilteredProducts.reduce((sum, group) => sum + group.products.length, 0) > 0 && (
             <CardDescription className="text-center text-muted-foreground pt-1">
                {groupedAndFilteredProducts.reduce((sum, group) => sum + group.products.length, 0)} {groupedAndFilteredProducts.reduce((sum, group) => sum + group.products.length, 0) === 1 ? 'producto encontrado' : 'productos encontrados'} en {groupedAndFilteredProducts.length} {groupedAndFilteredProducts.length === 1 ? 'categoría' : 'categorías'}
             </CardDescription>
           )}
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {groupedAndFilteredProducts ? (
            // Render grouped products if searching across all categories
            groupedAndFilteredProducts.length > 0 ? (
              <div className="space-y-6">
                {groupedAndFilteredProducts.map((group) => (
                  <div key={group.category.id}>
                    <h3 className="text-2xl font-semibold mb-3 text-primary border-b pb-2">{group.category.name}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {group.products.map((product) => (
                        <ProductItemCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8 text-lg">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
            )
          ) : (
            // Render flat list if specific category selected or no search term
            productsToDisplay.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {productsToDisplay.map((product) => (
                  <ProductItemCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8 text-lg">
                {searchTerm.trim() !== '' ? 'No se encontraron productos que coincidan con tu búsqueda en esta categoría.' : 'No hay productos disponibles en esta categoría.'}
              </p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
