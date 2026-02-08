"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart, type Product } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { formatPrice } from '@/lib/products'
import { cn, getValidImageUrl } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductCardProps {
  product: Product
  index?: number
  compact?: boolean
  isLoading?: boolean
}

export function ProductCard({ product, index = 0, isLoading = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  if (isLoading) {
    return (
      <div className="bg-white rounded-[var(--radius)] overflow-hidden border border-border/50">
        <div className="aspect-[4/5] bg-secondary animate-pulse" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-2/3 bg-muted" />
          <Skeleton className="h-5 w-full bg-muted" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-20 bg-muted" />
            <Skeleton className="h-8 w-8 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  const isLiked = isInWishlist(product.id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const imageUrl = getValidImageUrl(product.image)

  return (
    <div
      className={cn(
        "group relative bg-card rounded-[var(--radius)] overflow-hidden border border-border/40 transition-all duration-500",
        "hover:shadow-[0_20px_40px_-15px_rgba(45,41,38,0.1)] hover:border-primary/20",
        "flex flex-col h-full"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform duration-700 ease-out",
            isHovered ? "scale-105" : "scale-100"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.badge && (
            <span className="px-3 py-1 text-[10px] font-bold bg-primary/95 text-primary-foreground backdrop-blur-sm rounded-full tracking-widest uppercase shadow-sm">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="px-3 py-1 text-[10px] font-bold bg-destructive/90 text-white backdrop-blur-sm rounded-full tracking-widest uppercase shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Action Buttons (Right) */}
        <div className={cn(
          "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-500 z-10",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={cn(
              "h-10 w-10 rounded-full bg-white/95 backdrop-blur-md shadow-sm flex items-center justify-center transition-all hover:bg-primary hover:text-white border border-border/50",
              isLiked && "text-destructive hover:text-white hover:bg-destructive"
            )}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-md shadow-sm flex items-center justify-center transition-all hover:bg-primary hover:text-white border border-border/50"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>

        {/* Add to Cart Button (Bottom) */}
        <div className={cn(
          "absolute bottom-4 left-4 right-4 transition-all duration-500 z-10",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="w-full bg-white/95 hover:bg-primary text-primary hover:text-white backdrop-blur-md shadow-lg border border-primary/10 rounded-full font-medium transition-all"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        <Link href={`/product/${product.id}`} className="group/title">
          <h3 className="font-serif text-lg font-medium text-foreground group-hover/title:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3",
                i < Math.floor(product.rating) ? "fill-accent text-accent" : "fill-muted text-muted"
              )}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        {/* Trust Badges - New Addition for Brand Authority */}
        <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                🌿 Natural
            </span>
             <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                ⚕️ Hakeem Certified
            </span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/40">
          <div className="flex flex-col">
             {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through decoration-destructive/30">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-lg font-semibold text-primary">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
