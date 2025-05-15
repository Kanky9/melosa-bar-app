'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Product, Category } from '@/types';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const productFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  price: z.coerce.number().positive({ message: 'El precio debe ser un número positivo.' }),
  categoryId: z.string().min(1, { message: 'Debes seleccionar una categoría.' }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'Debe ser una URL válida.' }).optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => Promise<void>;
  initialData?: Product | null;
  categories: Category[];
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function ProductForm({ onSubmit, initialData, categories, onClose, isSubmitting = false }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData ? 
      { ...initialData, price: Number(initialData.price), imageUrl: initialData.imageUrl || '' } 
      : {
        name: '',
        price: 0,
        categoryId: categories.length > 0 ? categories[0].id : '',
        description: '',
        imageUrl: '',
      },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        price: Number(initialData.price), // Ensure price is number
        imageUrl: initialData.imageUrl || '',
      });
    } else {
      form.reset({
        name: '',
        price: 0,
        categoryId: categories.length > 0 ? categories[0].id : '', // Default to first category or empty
        description: '',
        imageUrl: '',
      });
    }
  }, [initialData, form, categories]);

  const handleSubmit = async (values: ProductFormValues) => {
    await onSubmit(values);
    // Form reset handled by parent on success
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Margarita Clásica" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Ej: 8.50" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={isSubmitting || categories.length === 0}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={categories.length === 0 ? "Crea una categoría primero" : "Selecciona una categoría"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalles del producto..." {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la Imagen (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/600x400.png" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3 pt-4">
           <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || form.formState.isSubmitting || (categories.length === 0 && !initialData?.categoryId) }>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (initialData ? 'Actualizar Producto' : 'Crear Producto')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
