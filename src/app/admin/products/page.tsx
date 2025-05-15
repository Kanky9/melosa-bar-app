'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import type { Product, Category } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesCollection = collection(db, 'categories');
        const qCategories = query(categoriesCollection, orderBy('name'));
        const categorySnapshot = await getDocs(qCategories);
        const categoriesList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(categoriesList);

        // Fetch products
        const productsCollection = collection(db, 'products');
        const qProducts = query(productsCollection, orderBy('name'));
        const productSnapshot = await getDocs(qProducts);
        const productsList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setAllProducts(productsList);

      } catch (error) {
        console.error("Error fetching data: ", error);
        toast({ title: "Error", description: "No se pudieron cargar los datos.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleFormSubmit = async (values: Omit<Product, 'id'> & { price: number }) => {
    setIsSubmitting(true);
    const productData = {
      ...values,
      price: Number(values.price), // Ensure price is a number
      imageUrl: values.imageUrl || 'https://placehold.co/600x400.png' // Default image if empty
    };

    try {
      if (editingProduct) {
        const productDocRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productDocRef, productData);
        const updatedProduct = { ...editingProduct, ...productData };
        setAllProducts(prev => 
          prev.map(prod => prod.id === editingProduct.id ? updatedProduct : prod)
        );
        toast({ title: "Producto Actualizado", description: `El producto "${values.name}" ha sido actualizado.` });
      } else {
        const docRef = await addDoc(collection(db, 'products'), productData);
        const newProduct: Product = { id: docRef.id, ...productData };
        setAllProducts(prev => [...prev, newProduct].sort((a,b) => a.name.localeCompare(b.name)));
        toast({ title: "Producto Creado", description: `El producto "${values.name}" ha sido creado.` });
      }
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product: ", error);
      toast({ title: "Error", description: "No se pudo guardar el producto.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    const productToDelete = allProducts.find(prod => prod.id === productId);
    if (!productToDelete) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${productToDelete.name}"? Esta acción no se puede deshacer.`)) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setAllProducts(prev => prev.filter(prod => prod.id !== productId));
        toast({ title: "Producto Eliminado", description: "El producto ha sido eliminado.", variant: "destructive" });
      } catch (error) {
        console.error("Error deleting product: ", error);
        toast({ title: "Error", description: "No se pudo eliminar el producto.", variant: "destructive" });
      }
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
                    disabled={isLoading}
                />
            </div>
            <Button onClick={openFormForNew} className="w-full sm:w-auto" disabled={isLoading}>
                <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Producto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Cargando productos y categorías...</p>
            </div>
          ) : (
            <ProductTable products={displayedAdminProducts} categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (isSubmitting && !isOpen) return;
        setIsFormOpen(isOpen);
        if(!isOpen) setEditingProduct(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Modifica los detalles del producto.' : 'Añade un nuevo producto al catálogo.'}
            </DialogDescription>
          </DialogHeader>
          {categories.length === 0 && !isLoading ? (
             <p className="text-center text-destructive">No hay categorías disponibles. Por favor, crea una categoría primero.</p>
          ) : (
            <ProductForm 
              onSubmit={handleFormSubmit as any} 
              initialData={editingProduct}
              categories={categories}
              onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
