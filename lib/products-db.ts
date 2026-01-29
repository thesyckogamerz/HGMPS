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

export async function getProductsFromDB(): Promise<Product[]> {
  // If Supabase is not configured, return empty array
  if (!supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
    
    if (error) {
      console.warn('Error fetching products from Supabase:', error.message)
      return []
    }

    if (!data) return []

    // Map Supabase data to Product interface
    return data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice || undefined,
      image: item.image,
      category: item.category,
      description: item.description,
      rating: item.rating || 0,
      reviews: item.reviews || 0,
      inStock: item.inStock !== false,
      badge: item.badge || undefined
    })) as Product[]

  } catch (error) {
    console.warn('Unexpected error fetching products:', error)
    return []
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const dbProducts = await getProductsFromDB()
  // Combine DB products (if any) with hardcoded products
  // DB products appear first, then hardcoded ones
  return [...dbProducts, ...hardcodedProducts]
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
    product.category.toLowerCase().includes(lowerQuery)
  )
}
