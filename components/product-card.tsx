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
      <div className="bg-white rounded-2xl overflow-hidden border border-border/50">
        <div className="aspect-[4/5] bg-secondary animate-pulse" />
        <div className="p-6 space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-6 w-full" />
          <div className="flex justify-between pt-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-10 rounded-full" />
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
        "group relative bg-white rounded-2xl overflow-hidden border border-border/30 transition-all duration-700",
        "hover:shadow-[0_30px_60px_-15px_rgba(45,41,38,0.08)] hover:border-gold/20",
        "flex flex-col h-full"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#fdfaf5]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]",
            isHovered ? "scale-110 blur-[1px]" : "scale-100 blur-0"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Soft Overlay on Hover */}
        <div className={cn(
            "absolute inset-0 bg-taupe-dark/10 transition-opacity duration-700",
            isHovered ? "opacity-100" : "opacity-0"
        )} />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.badge && (
            <span className="px-3 py-1 text-[10px] font-bold bg-white/90 text-taupe-dark backdrop-blur-md rounded-full tracking-[0.2em] uppercase shadow-sm border border-border/20">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="px-3 py-1 text-[10px] font-bold bg-gold/90 text-white backdrop-blur-md rounded-full tracking-[0.2em] uppercase shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Action Buttons (Floating) */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center gap-3 transition-all duration-500 z-10",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={cn(
              "h-12 w-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95",
              isLiked ? "text-destructive" : "text-taupe-dark hover:text-gold"
            )}
            title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="h-12 w-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-taupe-dark hover:text-gold"
            title="View Details"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>

        {/* Add to Cart Bar */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 z-10",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        )}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            className="w-full bg-taupe-dark text-white hover:bg-gold rounded-xl h-12 font-medium transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-1 gap-2 bg-white">
        <div className="flex justify-between items-start gap-4">
            <Link href={`/product/${product.id}`} className="group/title flex-1">
            <h3 className="font-serif text-xl font-medium text-taupe-dark group-hover/title:text-gold transition-colors line-clamp-1 leading-tight">
                {product.name}
            </h3>
            </Link>
            <div className="flex flex-col items-end">
                {product.originalPrice && (
                <span className="text-[10px] text-muted-foreground line-through decoration-gold/30">
                    {formatPrice(product.originalPrice)}
                </span>
                )}
                <span className="text-lg font-bold text-gold">
                {formatPrice(product.price)}
                </span>
            </div>
        </div>
        
        {/* Rating & Trust */}
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                key={i}
                className={cn(
                    "h-3 w-3",
                    i < Math.floor(product.rating) ? "fill-gold text-gold" : "fill-border/40 text-border/40"
                )}
                />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1.5 font-medium tracking-wider">({product.reviews})</span>
            </div>
            
            <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600/80 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    🌿 Natural
                </span>
            </div>
        </div>
      </div>
    </div>
  )
}
