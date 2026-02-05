"use client"

import { CartProvider } from '@/lib/cart-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { CartDrawer } from '@/components/cart-drawer'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Footer } from '@/components/footer'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <TooltipProvider>
          <CartDrawer />
          {children}
          <Footer />
        </TooltipProvider>
      </WishlistProvider>
    </CartProvider>
  )
}
