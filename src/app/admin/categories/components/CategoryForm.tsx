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
import type { Category } from '@/types';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  initialData?: Category | null;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function CategoryForm({ onSubmit, initialData, onClose, isSubmitting = false }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || { name: '' },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({ name: '' });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: CategoryFormValues) => {
    await onSubmit(values);
    // Form reset is handled by the parent component after successful submission
    // to ensure it only happens if the submission was successful.
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Categoría</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Bebidas" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || form.formState.isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (initialData ? 'Actualizar Categoría' : 'Crear Categoría')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
