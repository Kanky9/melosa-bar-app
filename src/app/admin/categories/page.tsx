'use client';

import { useState, useEffect } from 'react';
import CategoryTable from './components/CategoryTable';
import CategoryForm from './components/CategoryForm';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { Category } from '@/types';
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const categoriesCollection = collection(db, 'categories');
        const q = query(categoriesCollection, orderBy('name'));
        const categorySnapshot = await getDocs(q);
        const categoriesList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching categories: ", error);
        toast({ title: "Error", description: "No se pudieron cargar las categorías.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleFormSubmit = async (values: { name: string }) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Update category
        const categoryDocRef = doc(db, 'categories', editingCategory.id);
        await updateDoc(categoryDocRef, values);
        setCategories(prev => 
          prev.map(cat => cat.id === editingCategory.id ? { ...cat, ...values } : cat)
        );
        toast({ title: "Categoría Actualizada", description: `La categoría "${values.name}" ha sido actualizada.` });
      } else {
        // Create new category
        const docRef = await addDoc(collection(db, 'categories'), values);
        const newCategory: Category = { id: docRef.id, ...values };
        setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
        toast({ title: "Categoría Creada", description: `La categoría "${values.name}" ha sido creada.` });
      }
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category: ", error);
      toast({ title: "Error", description: "No se pudo guardar la categoría.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (!categoryToDelete) return;

    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryToDelete.name}"? Esta acción no se puede deshacer.`)) {
      try {
        await deleteDoc(doc(db, 'categories', categoryId));
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        toast({ title: "Categoría Eliminada", description: "La categoría ha sido eliminada.", variant: "destructive" });
      } catch (error) {
        console.error("Error deleting category: ", error);
        toast({ title: "Error", description: "No se pudo eliminar la categoría.", variant: "destructive" });
      }
    }
  };
  
  const openFormForNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Gestión de Categorías</CardTitle>
            <CardDescription>Crea, edita y elimina las categorías de productos de tu bar.</CardDescription>
          </div>
          <Button onClick={openFormForNew} disabled={isLoading}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Categoría
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Cargando categorías...</p>
            </div>
          ) : (
            <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (isSubmitting && !isOpen) return; // Prevent closing while submitting
        setIsFormOpen(isOpen);
        if (!isOpen) setEditingCategory(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Modifica los detalles de la categoría.' : 'Añade una nueva categoría para organizar tus productos.'}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm 
            onSubmit={handleFormSubmit} 
            initialData={editingCategory}
            onClose={() => { setIsFormOpen(false); setEditingCategory(null); }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
