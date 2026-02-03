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
import { Skeleton } from '@/components/ui/skeleton'

interface ProductCardProps {
  product: Product
  index?: number
  compact?: boolean
  isLoading?: boolean
}

export function ProductCard({ product, index = 0, compact = false, isLoading = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  if (isLoading) {
    return (
      <div className="group relative bg-white rounded-2xl overflow-hidden border border-border/50">
        <div className="aspect-square bg-sand-light">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-5 w-full" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-3 rounded-full" />
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  const isLiked = isInWishlist(product.id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border border-border/50 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.15)]",
        "opacity-0 animate-slide-up"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-sand-light">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-all duration-700 ease-in-out",
            isHovered ? "scale-110 blur-[1px] brightness-90" : "scale-100"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {product.badge && (
            <span className="px-3 py-1 text-[10px] font-bold bg-gold/90 backdrop-blur-md text-white rounded-full tracking-wider uppercase">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="px-3 py-1 text-[10px] font-bold bg-red-500/90 backdrop-blur-md text-white rounded-full tracking-wider uppercase">
              -{discount}%
            </span>
          )}
        </div>

        <div className={cn(
          "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-500 z-20",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}>
          <button
            onClick={() => toggleWishlist(product)}
            className={cn(
              "h-9 w-9 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:bg-gold hover:text-white",
              isLiked && "text-red-500"
            )}
            suppressHydrationWarning
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:bg-gold hover:text-white"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>

        <div className={cn(
          "absolute bottom-3 left-3 right-3 transition-all duration-500 z-20",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <Button
            onClick={() => addItem(product)}
            className="w-full bg-taupe hover:bg-gold text-white rounded-full shadow-lg transition-all duration-300 gap-2 font-semibold"
            suppressHydrationWarning
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/product/${product.id}`} className="group/title">
          <h3 className="font-semibold text-taupe-dark group-hover/title:text-gold transition-colors duration-300 line-clamp-1 font-serif text-lg">
            {product.name}
          </h3>
          {product.urduName && (
            <p className="text-sm font-medium text-taupe/80 font-urdu mt-0.5" dir="rtl">
              {product.urduName}
            </p>
          )}
        </Link>

        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3 transition-colors duration-300",
                i < Math.floor(product.rating)
                  ? "fill-gold text-gold"
                  : "fill-muted text-muted"
              )}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1 font-medium">({product.reviews} reviews)</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-sand-light/40">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-taupe">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through decoration-gold/30">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="lg:hidden">
             <Button
              onClick={() => addItem(product)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-gold hover:bg-gold hover:text-white transition-all"
              suppressHydrationWarning
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
