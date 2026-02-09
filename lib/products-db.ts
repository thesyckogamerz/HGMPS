import { Product } from './cart-context'
import { products as hardcodedProducts, categories } from './products'
import { supabase } from './supabase'



// Simple in-memory cache
let productsCache: { data: Product[], timestamp: number } | null = null
const CACHE_TTL = 1000 * 30 // 30 seconds (reduced from 5 mins for better admin sync)

export async function getProductsFromDB(limit?: number, offset?: number): Promise<Product[]> {
  // If Supabase is not configured, return empty array
  if (!supabase) {
    return []
  }

  try {
    let query = supabase
      .from('products')
      .select('*')
    
    if (limit !== undefined) {
      const start = offset || 0
      query = query.range(start, start + limit - 1)
    }

    const { data, error } = await query
    
    if (error) {
      console.warn('Error fetching products from Supabase:', error.message)
      return []
    }

    if (!data) return []

    // Map Supabase data to Product interface
    return data.map((item: any) => ({
      id: item.id.toString(),
      name: item.product_name || item.name,
      price: item.price,
      originalPrice: item.original_price || undefined,
      image: item.image_url || item.image,
      category: item.category,
      description: item.description,
      rating: item.rating || 0,
      reviews: item.reviews || 0,
      inStock: item.stock_quantity !== undefined ? item.stock_quantity > 0 : (item.in_stock !== false),
      badge: item.badge || undefined,
      urduName: item.urdu_name || undefined,
      unit: item.unit || 'grams',
      minQuantity: item.min_quantity ? Number(item.min_quantity) : 1,
      variants: item.variants || [],
      bulkDiscounts: item.bulk_discounts || []
    })) as Product[]

  } catch (error) {
    console.warn('Unexpected error fetching products:', error)
    return []
  }
}

export async function getAllProducts(limit?: number, offset?: number): Promise<Product[]> {
  // Use cache if available and not expired, and no limit/offset requested
  if (limit === undefined && offset === undefined && productsCache && (Date.now() - productsCache.timestamp < CACHE_TTL)) {
    return productsCache.data
  }

  const dbProducts = await getProductsFromDB(limit, offset)
  
  // De-duplicate: Prefer DB products over hardcoded ones if IDs match
  const finalProducts = [...dbProducts];
  const dbIds = new Set(dbProducts.map(p => p.id));
  
  for (const staticProd of hardcodedProducts) {
    if (!dbIds.has(staticProd.id)) {
      finalProducts.push(staticProd);
    }
  }

  // Update cache if no limit was requested (full list)
  if (limit === undefined && offset === undefined) {
    productsCache = { data: finalProducts, timestamp: Date.now() }
  }
}


export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const allProducts = await getAllProducts()
  
  // If category has children, include their products too
  const childCategories = categories.filter(c => c.parentId === categoryId)
  const childIds = childCategories.map(c => c.id)
  
  return allProducts.filter(p => p.category === categoryId || childIds.includes(p.category))
}





export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) {
    return getAllProducts()
  }
  
  const allProducts = await getAllProducts()
  const lowerQuery = query.toLowerCase()
  
  return allProducts.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    (product.urduName && product.urduName.includes(query))
  )
}
