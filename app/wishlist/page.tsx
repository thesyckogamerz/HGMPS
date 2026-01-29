"use client"

import { useWishlist } from "@/lib/wishlist-context"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  const { wishlist } = useWishlist()

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="md:hidden">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-serif font-semibold text-taupe flex items-center gap-2">
              <Heart className="h-5 w-5 fill-gold text-gold" />
              My Wishlist
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-fade-in">
            <div className="h-24 w-24 rounded-full bg-sand-light flex items-center justify-center">
              <Heart className="h-12 w-12 text-taupe/30" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-semibold text-taupe">Your wishlist is empty</h2>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Save your favorite botanical products to find them easily later.
              </p>
            </div>
            <Link href="/products">
              <Button className="bg-taupe hover:bg-taupe-dark text-white btn-premium px-8">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlist.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Featured Suggestions if empty? Maybe later. */}
    </div>
  )
}
