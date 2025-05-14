'use client';

import { useState, useEffect } from 'react';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Product, Category } from '@/types';
import { mockProducts, mockCategories } from '@/lib/mockData'; // Using mock data
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setProducts(mockProducts);
    setCategories(mockCategories);
  }, []);

  const handleFormSubmit = async (values: Omit<Product, 'id'> & { price: number }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingProduct) {
      // Update product
      setProducts(prev => 
        prev.map(prod => prod.id === editingProduct.id ? { ...prod, ...values, price: Number(values.price) } : prod)
      );
      toast({ title: "Producto Actualizado", description: `El producto "${values.name}" ha sido actualizado.` });
    } else {
      // Create new product
      const newProduct: Product = { id: `prod-${Date.now()}`, ...values, price: Number(values.price) };
      setProducts(prev => [...prev, newProduct]);
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
    // Simulate API call
    if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      setProducts(prev => prev.filter(prod => prod.id !== productId));
      toast({ title: "Producto Eliminado", description: "El producto ha sido eliminado.", variant: 'destructive' });
    }
  };

  const openFormForNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Gestión de Productos</CardTitle>
            <CardDescription>Añade, edita y elimina los productos de tu bar.</CardDescription>
          </div>
          <Button onClick={openFormForNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        </CardHeader>
        <CardContent>
          <ProductTable products={products} categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
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
            onSubmit={handleFormSubmit as any} // Casting because values may not exactly match Product type before conversion
            initialData={editingProduct}
            categories={categories}
            onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
