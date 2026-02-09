"use client"

import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  name: string
  location: string
  avatar: string
  rating: number
  text: string
  product: string
}

export function TestimonialCard({
  name,
  location,
  rating,
  text,
  product
}: TestimonialCardProps) {
  return (
    <div className="group w-full h-[320px] [perspective:1000px]">
      <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        
        {/* Front Face */}
        <div 
          className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg border border-border/50 overflow-hidden flex flex-col p-6"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-sand/20 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10 flex flex-col h-full">
            {/* Quote Icon */}
            <Quote className="w-10 h-10 text-gold/30 mb-4 flex-shrink-0" />
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < rating
                      ? "fill-gold text-gold"
                      : "fill-muted/20 text-muted/20"
                  )}
                />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-4">
              "{text}"
            </p>

            {/* Product */}
            <p className="text-xs text-gold font-medium mb-4 truncate">
              {product}
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sand to-sand-light flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-serif font-bold text-taupe-dark">
                  {name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{location}</p>
              </div>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
            Hover to read more
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-taupe-dark to-taupe rounded-2xl shadow-xl overflow-hidden text-white p-8 flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-olive/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col h-full">
            {/* Quote Icon */}
            <Quote className="w-12 h-12 text-gold/30 mb-4 flex-shrink-0" />

            {/* Full Testimonial Text */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-6">
              <p className="text-white/90 text-base leading-relaxed italic">
                "{text}"
              </p>
            </div>

            {/* Product & Author Info */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                  Product Purchased
                </p>
                <p className="text-sm font-medium text-gold">{product}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-base font-serif font-bold text-white">
                    {name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{name}</p>
                  <p className="text-xs text-white/60">{location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}