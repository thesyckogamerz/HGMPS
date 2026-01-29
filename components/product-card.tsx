"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart, type Product } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { formatPrice } from '@/lib/products'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  index?: number
  compact?: boolean
}

export function ProductCard({ product, index = 0, compact = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const isLiked = isInWishlist(product.id)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border border-border/50 card-hover",
        "opacity-0 animate-slide-up"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-sand-light">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            isHovered && "scale-110"
          )}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && (
            <span className="px-3 py-1 text-xs font-medium bg-gold text-white rounded-full">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="px-3 py-1 text-xs font-medium bg-olive text-white rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={cn(
          "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}>
          <button
            onClick={() => toggleWishlist(product)}
            className={cn(
              "h-9 w-9 rounded-full bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110",
              isLiked && "bg-red-50"
            )}
            suppressHydrationWarning
          >
            <Heart className={cn("h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-foreground")} />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="h-9 w-9 rounded-full bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
          >
            <Eye className="h-4 w-4 text-foreground" />
          </Link>
        </div>

        {/* Add to Cart Button */}
        <div className={cn(
          "absolute bottom-3 left-3 right-3 transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <Button
            onClick={() => addItem(product)}
            className="w-full bg-taupe hover:bg-taupe-dark text-white btn-premium gap-2"
            suppressHydrationWarning
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground hover:text-taupe transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.urduName && (
            <p className="text-sm font-medium text-taupe/80 font-urdu mt-0.5" dir="rtl">
              {product.urduName}
            </p>
          )}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < Math.floor(product.rating)
                  ? "fill-gold text-gold"
                  : "fill-muted text-muted"
              )}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-semibold text-taupe">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Add to Cart */}
      <div className="px-4 pb-4 lg:hidden">
        <Button
          onClick={() => addItem(product)}
          variant="outline"
          className="w-full border-taupe text-taupe hover:bg-taupe hover:text-white transition-colors gap-2"
          suppressHydrationWarning
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
