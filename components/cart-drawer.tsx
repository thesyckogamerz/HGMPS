"use client"

import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/products'

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice, totalItems } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-cream flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 text-taupe">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <div className="h-24 w-24 rounded-full bg-sand-light flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">Your cart is empty</p>
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-taupe hover:bg-taupe-dark text-white btn-premium"
              suppressHydrationWarning
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => {
                  const cartItemId = item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : item.id
                  const basePrice = item.selectedVariant ? item.selectedVariant.price : item.price
                  
                  // Calculate dynamic discount for display
                  let currentPrice = basePrice
                  let appliedDiscount = null
                  if (item.bulkDiscounts && item.bulkDiscounts.length > 0) {
                    appliedDiscount = [...item.bulkDiscounts]
                      .sort((a, b) => b.minQuantity - a.minQuantity)
                      .find(d => item.quantity >= d.minQuantity)
                    
                    if (appliedDiscount) {
                      currentPrice = basePrice * (1 - appliedDiscount.discountPercentage / 100)
                    }
                  }

                  return (
                    <div
                      key={cartItemId}
                      className="flex gap-4 p-3 bg-white rounded-xl border border-border/50 animate-fade-in"
                    >
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-sand-light flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        {item.selectedVariant && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Size: {item.selectedVariant.name}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <p className={`font-semibold text-sm ${appliedDiscount ? "text-olive" : "text-gold"}`}>
                            {formatPrice(currentPrice)}
                          </p>
                          {appliedDiscount && (
                            <span className="text-[10px] bg-olive/10 text-olive px-1.5 py-0.5 rounded-full font-bold">
                              -{appliedDiscount.discountPercentage}% BULK
                            </span>
                          )}
                          {appliedDiscount && (
                            <p className="text-xs text-muted-foreground line-through">
                              {formatPrice(basePrice)}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(cartItemId, item.quantity - 1)}
                            className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:bg-sand-light transition-colors"
                            suppressHydrationWarning
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <span className="text-[10px] text-muted-foreground">{item.unit || item.selectedVariant?.unit || ""}</span>
                          </div>
                          <button
                            onClick={() => updateQuantity(cartItemId, item.quantity + 1)}
                            className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:bg-sand-light transition-colors"
                            suppressHydrationWarning
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(cartItemId)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        suppressHydrationWarning
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-taupe">{formatPrice(totalPrice)}</span>
              </div>
              
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-taupe hover:bg-taupe-dark text-white h-12 text-base btn-premium" suppressHydrationWarning>
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setIsOpen(false)}
                suppressHydrationWarning
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
