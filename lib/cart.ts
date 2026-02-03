import { supabase } from './supabase'
import { CartItem } from './cart-context'

export async function syncCartToDatabase(userId: string, localItems: CartItem[]) {
  if (!userId) {
    console.warn('Cannot sync cart: No user ID provided')
    return { success: false, error: 'No user ID' }
  }

  try {
    // 1. Fetch existing cart from DB
    const { data: existingCart, error: fetchError } = await supabase
      .from('carts')
      .select('items')
      .eq('user_id', userId)
      .single()

    // Check for schema errors
    if (fetchError && fetchError.code === 'PGRST116') {
      // No cart exists yet, this is fine
      console.log('No existing cart found, will create new one')
    } else if (fetchError) {
      console.error('Error fetching cart:', fetchError)
      throw new Error(`Failed to fetch cart: ${fetchError.message}`)
    }

    let dbItems: CartItem[] = []
    if (existingCart?.items) {
      // Handle simple JSON array
      dbItems = Array.isArray(existingCart.items) ? existingCart.items : []
    }

    // 2. Merge carts
    // Create a map by unique ID (id + variant)
    const mergedMap = new Map<string, CartItem>()

    // Add DB items first
    dbItems.forEach(item => {
      const key = item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : item.id
      mergedMap.set(key, item)
    })

    // Add/Override with Local items
    localItems.forEach(item => {
      const key = item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : item.id
      if (mergedMap.has(key)) {
        // Sum quantities for a better UX
        const existing = mergedMap.get(key)!
        mergedMap.set(key, { ...item, quantity: existing.quantity + item.quantity })
      } else {
        mergedMap.set(key, item)
      }
    })

    const finalItems = Array.from(mergedMap.values())

    // 3. Save back to DB
    const { error: upsertError } = await supabase
      .from('carts')
      .upsert({ user_id: userId, items: finalItems, updated_at: new Date().toISOString() })

    if (upsertError) {
      console.error('Error syncing cart:', upsertError)
      
      // Check if it's a schema/column error
      if (upsertError.message.includes('column') || upsertError.message.includes('schema')) {
        throw new Error('Database schema error. Please ensure the carts table is set up correctly in Supabase.')
      }
      
      throw new Error(`Failed to sync cart: ${upsertError.message}`)
    }

    console.log('Cart synced successfully')
    return { success: true, itemCount: finalItems.length }
  } catch (error: any) {
    console.error('Unexpected error syncing cart:', error)
    return { success: false, error: error.message || 'Unknown error' }
  }
}


export async function fetchCartFromDatabase(userId: string): Promise<CartItem[]> {
  const { data } = await supabase
    .from('carts')
    .select('items')
    .eq('user_id', userId)
    .single()

  if (data?.items && Array.isArray(data.items)) {
    return data.items as CartItem[]
  }
  return []
}
