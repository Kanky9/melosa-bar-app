
'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import type { Product, Category } from '@/types';
import { mockProducts, mockCategories } from '@/lib/mockData'; 
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Initialize allProducts with a copy of mockProducts to avoid direct mutation issues with React state
    // if mockProducts itself was a state from a higher component or context.
    // For this specific case where mockProducts is a global mutable array, 
    // this ensures allProducts starts fresh from the potentially mutated source.
    setAllProducts([...mockProducts]); 
    setCategories(mockCategories);
  }, []);

  const handleFormSubmit = async (values: Omit<Product, 'id'> & { price: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingProduct) {
      const updatedProduct = { ...editingProduct, ...values, price: Number(values.price) };
      setAllProducts(prev => 
        prev.map(prod => prod.id === editingProduct.id ? updatedProduct : prod)
      );
      // Also update the mockProducts array directly
      const productIndex = mockProducts.findIndex(p => p.id === editingProduct.id);
      if (productIndex !== -1) {
        mockProducts[productIndex] = updatedProduct;
      }
      toast({ title: "Producto Actualizado", description: `El producto "${values.name}" ha sido actualizado.` });
    } else {
      const newProduct: Product = { id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, ...values, price: Number(values.price) };
      setAllProducts(prev => [...prev, newProduct]);
      // Also update the mockProducts array directly
      mockProducts.push(newProduct);
      toast({ title: "Producto Creado", description: `El producto "${values.name}" ha sido creado.` });
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      setAllProducts(prev => prev.filter(prod => prod.id !== productId));
      // Also update the mockProducts array directly
      const productIndex = mockProducts.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        mockProducts.splice(productIndex, 1);
      }
      toast({ title: "Producto Eliminado", description: "El producto ha sido eliminado.", variant: 'destructive' });
    }
  };

  const openFormForNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const displayedAdminProducts = useMemo(() => {
    if (!adminSearchTerm.trim()) {
      return allProducts;
    }
    const lowerSearchTerm = adminSearchTerm.toLowerCase();
    return allProducts.filter(product => {
      const category = categories.find(cat => cat.id === product.categoryId);
      return (
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        (product.description && product.description.toLowerCase().includes(lowerSearchTerm)) ||
        (category && category.name.toLowerCase().includes(lowerSearchTerm))
      );
    });
  }, [allProducts, adminSearchTerm, categories]);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Gestión de Productos</CardTitle>
            <CardDescription>Añade, edita y elimina los productos de tu bar.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
             <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Buscar productos..."
                    value={adminSearchTerm}
                    onChange={(e) => setAdminSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 h-10" 
                    aria-label="Buscar productos en admin"
                />
            </div>
            <Button onClick={openFormForNew} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Producto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ProductTable products={displayedAdminProducts} categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Modifica los detalles del producto.' : 'Añade un nuevo producto al catálogo.'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            onSubmit={handleFormSubmit as any} 
            initialData={editingProduct}
            categories={categories}
            onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

