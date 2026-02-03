import { Product } from './cart-context'
import { products as hardcodedProducts } from './products'

// Dynamically import supabase to avoid errors if not configured
let supabase: any = null
try {
  const supabaseModule = require('./supabase')
  supabase = supabaseModule.supabase
} catch (error) {
  console.warn('Supabase not configured, using hardcoded products only')
}

// Simple in-memory cache
let productsCache: { data: Product[], timestamp: number } | null = null
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

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
  
  // Combine DB products with hardcoded products
  // Note: if limit/offset used, hardcoded products behavior might need more complex logic
  // but for simple cases we just append them if we're at the end or no limit
  let combined: Product[]
  if (limit === undefined) {
    combined = [...dbProducts, ...hardcodedProducts]
    // Update cache if no limit was requested (full list)
    productsCache = { data: combined, timestamp: Date.now() }
  } else {
    // If limit is set, we return just db products for now to keep it simple
    // or we could append hardcoded if dbProducts.length < limit
    if (dbProducts.length < limit) {
      const remaining = limit - dbProducts.length
      combined = [...dbProducts, ...hardcodedProducts.slice(0, remaining)]
    } else {
      combined = dbProducts
    }
  }
  
  return combined
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const allProducts = await getAllProducts()
  return allProducts.filter(p => p.category === categoryId)
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
