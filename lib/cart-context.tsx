"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

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

  const addItem = useCallback((product: Product, variant?: QuantityVariant, quantity: number = 1) => {
    setItems(prev => {
      const cartItemId = variant ? `${product.id}-${variant.id}` : product.id
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
