import type { Category, Product } from '@/types';

export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Bebidas Alcohólicas' },
  { id: 'cat2', name: 'Bebidas sin Alcohol' },
  { id: 'cat3', name: 'Aperitivos' },
  { id: 'cat4', name: 'Platos Principales' },
  { id: 'cat5', name: 'Postres' },
];

export const mockProducts: Product[] = [
  // Bebidas Alcohólicas
  { id: 'prod1', name: 'Margarita Clásica', price: 8.50, categoryId: 'cat1', description: 'Tequila, triple sec, y jugo de lima fresco.', imageUrl: 'https://placehold.co/600x400.png',},
  { id: 'prod2', name: 'Mojito Cubano', price: 9.00, categoryId: 'cat1', description: 'Ron blanco, azúcar, lima, soda y hierbabuena.', imageUrl: 'https://placehold.co/600x400.png', },
  { id: 'prod3', name: 'Cerveza Artesanal IPA', price: 6.50, categoryId: 'cat1', description: 'IPA local con notas cítricas y amargas.', imageUrl: 'https://placehold.co/600x400.png', },

  // Bebidas sin Alcohol
  { id: 'prod4', name: 'Limonada con Hierbabuena', price: 4.50, categoryId: 'cat2', description: 'Refrescante limonada casera con hierbabuena.', imageUrl: 'https://placehold.co/600x400.png', },
  { id: 'prod5', name: 'Jugo de Naranja Natural', price: 4.00, categoryId: 'cat2', description: 'Jugo de naranja recién exprimido.', imageUrl: 'https://placehold.co/600x400.png', },
  { id: 'prod6', name: 'Agua Mineral con Gas', price: 2.50, categoryId: 'cat2', description: 'Botella de agua mineral con gas.', imageUrl: 'https://placehold.co/600x400.png', },

  // Aperitivos
  { id: 'prod7', name: 'Patatas Bravas', price: 7.00, categoryId: 'cat3', description: 'Patatas crujientes con salsa brava y alioli.', imageUrl: 'https://placehold.co/600x400.png', },
  { id: 'prod8', name: 'Nachos Melosa', price: 10.50, categoryId: 'cat3', description: 'Nachos con queso, guacamole, jalapeños y crema agria.', imageUrl: 'https://placehold.co/600x400.png', },
  { id: 'prod9', name: 'Tabla de Quesos y Embutidos', price: 15.00, categoryId: 'cat3', description: 'Selección de quesos locales y embutidos ibéricos.', imageUrl: 'https://placehold.co/600x400.png', },
  
  // Platos Principales
  { id: 'prod10', name: 'Hamburguesa Gourmet', price: 12.50, categoryId: 'cat4', description: 'Carne de res premium, queso cheddar, bacon y salsa especial.', imageUrl: 'https://placehold.co/600x400.png', },
  { id: 'prod11', name: 'Tacos de Cochinita Pibil', price: 11.00, categoryId: 'cat4', description: 'Tres tacos de cochinita pibil con cebolla encurtida.', imageUrl: 'https://placehold.co/600x400.png', },
  { id: 'prod12', name: 'Ensalada César con Pollo', price: 9.50, categoryId: 'cat4', description: 'Lechuga romana, pollo a la parrilla, crutones y aderezo César.', imageUrl: 'https://placehold.co/600x400.png', },

  // Postres
  { id: 'prod13', name: 'Tarta de Chocolate Intenso', price: 6.00, categoryId: 'cat5', description: 'Deliciosa tarta de chocolate con coulis de frambuesa.', imageUrl: 'https://placehold.co/600x400.png', },
  { id: 'prod14', name: 'Helado Artesanal (2 bolas)', price: 5.00, categoryId: 'cat5', description: 'Elige dos sabores de nuestros helados artesanales.', imageUrl: 'https://placehold.co/600x400.png', },
];
