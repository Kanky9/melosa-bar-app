'use client';

import { useState, useEffect } from 'react';
import CategoryTable from './components/CategoryTable';
import CategoryForm from './components/CategoryForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Category } from '@/types';
import { mockCategories } from '@/lib/mockData'; // Using mock data
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching categories
    setCategories(mockCategories);
  }, []);

  const handleFormSubmit = async (values: { name: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingCategory) {
      // Update category
      setCategories(prev => 
        prev.map(cat => cat.id === editingCategory.id ? { ...cat, ...values } : cat)
      );
      toast({ title: "Categoría Actualizada", description: `La categoría "${values.name}" ha sido actualizada.` });
    } else {
      // Create new category
      const newCategory: Category = { id: `cat-${Date.now()}`, ...values };
      setCategories(prev => [...prev, newCategory]);
      toast({ title: "Categoría Creada", description: `La categoría "${values.name}" ha sido creada.` });
    }
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    // Simulate API call
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast({ title: "Categoría Eliminada", description: "La categoría ha sido eliminada.", variant: 'destructive' });
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
          <Button onClick={openFormForNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Categoría
          </Button>
        </CardHeader>
        <CardContent>
          <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
