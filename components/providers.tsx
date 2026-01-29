"use client"

import { CartProvider } from '@/lib/cart-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { WishlistProvider } from '@/lib/wishlist-context'
import { CartDrawer } from '@/components/cart-drawer'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <CartDrawer />
        {children}
        <Footer />
      </WishlistProvider>
    </CartProvider>
  )
}
