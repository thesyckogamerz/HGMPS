import { supabase } from './supabase';
import { Product } from './cart-context';
import { products as staticProducts } from './products';

export function mapProduct(data: any): Product {
  if (!data) return data;
  return {
    ...data,
    id: data.id.toString(),
    name: data.product_name || data.name,
    image: data.image_url || data.image,
    urduName: data.urdu_name,
    minQuantity: data.min_quantity ? Number(data.min_quantity) : 1,
    stockQuantity: data.stock_quantity !== undefined ? Number(data.stock_quantity) : undefined,
    inStock: data.stock_quantity !== undefined ? data.stock_quantity > 0 : data.in_stock,
    bulkDiscounts: data.bulk_discounts,
    originalPrice: data.original_price,
    benefits: data.benefits || [],
  };
}

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const dbProducts = error ? [] : data.map(mapProduct);
  
  // Combine with static products for transition
  return [...dbProducts, ...staticProducts];
}

export async function fetchProductById(id: string) {
  // First try DB
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!error && data) {
    return mapProduct(data);
  }

  // Fallback to static data
  return staticProducts.find((p) => p.id === id) || null;
}

export async function fetchProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);

  const dbProducts = error ? [] : data.map(mapProduct);
  const staticItems = staticProducts.filter((p) => p.category === category);
  
  return [...dbProducts, ...staticItems];
}

export async function fetchCategories() {
  // Can be expanded to fetch from DB
  return []; 
}
