"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { fetchCartFromDatabase } from '@/lib/cart'

export type WeightUnit = 'grams' | 'kg' | 'bottle' | 'items' | 'ml'

export interface QuantityVariant {
  id: string
  name: string // e.g., "100g", "1kg", "1 Bottle"
  weight: number // numerical value
  unit: WeightUnit
  price: number
  inStock: boolean
}

export interface BulkDiscount {
  minQuantity: number
  discountPercentage: number
}

export interface Product {
  id: string
  name: string
  price: number // base price or price of default variant
  originalPrice?: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  inStock: boolean
  badge?: string
  urduName?: string
  benefits?: string[]
  variants?: QuantityVariant[]
  bulkDiscounts?: BulkDiscount[]
  unit?: WeightUnit
  minQuantity?: number
  stockQuantity?: number
  isNew?: boolean
  isFeatured?: boolean
}

export interface CartItem extends Product {
  quantity: number
  selectedVariant?: QuantityVariant
  discountedPrice?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, variant?: QuantityVariant, quantity?: number) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, isInitialized])

  // NEW: Sync with DB checking on mount/auth change
  useEffect(() => {
    const checkAuthAndSync = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user && items.length === 0) {
        // If authenticated and local cart is empty, try to fetch from DB
        try {
          const dbItems = await fetchCartFromDatabase(session.user.id)
          if (dbItems.length > 0) {
            setItems(dbItems)
          }
        } catch (error) {
          console.error("Failed to fetch cart from DB", error)
        }
      }
    }
    
    checkAuthAndSync()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any)  => {
        if (event === 'SIGNED_IN' && session) {
            checkAuthAndSync()
        }
    })

    
    return () => {
        subscription.unsubscribe()
    }
  }, [items.length])

  const addItem = useCallback((product: Product, variant?: QuantityVariant, quantity: number = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => 
        variant ? (item.id === product.id && item.selectedVariant?.id === variant.id) : (item.id === product.id && !item.selectedVariant)
      )

      if (existingItem) {
        return prev.map(item => {
          const isMatch = variant 
            ? (item.id === product.id && item.selectedVariant?.id === variant.id)
            : (item.id === product.id && !item.selectedVariant)
          
          if (isMatch) {
            const newQuantity = item.quantity + quantity
            return { ...item, quantity: newQuantity }
          }
          return item
        })
      }
      return [...prev, { ...product, quantity, selectedVariant: variant }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((cartItemId: string) => {
    setItems(prev => prev.filter(item => {
      const currentId = item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : item.id
      return currentId !== cartItemId
    }))
  }, [])

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId)
      return
    }
    setItems(prev =>
      prev.map(item => {
        const currentId = item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : item.id
        return currentId === cartItemId ? { ...item, quantity } : item
      })
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const calculateItemPrice = (item: CartItem) => {
    const basePrice = item.selectedVariant ? item.selectedVariant.price : item.price
    if (item.bulkDiscounts && item.bulkDiscounts.length > 0) {
      const applicableDiscount = [...item.bulkDiscounts]
        .sort((a, b) => b.minQuantity - a.minQuantity)
        .find(d => item.quantity >= d.minQuantity)
      
      if (applicableDiscount) {
        return basePrice * (1 - applicableDiscount.discountPercentage / 100)
      }
    }
    return basePrice
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
