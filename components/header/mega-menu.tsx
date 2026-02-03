"use client"

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { categories } from '@/lib/products'
import { cn } from '@/lib/utils'

interface MegaMenuProps {
  isVisible: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function MegaMenu({ isVisible, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        suppressHydrationWarning
        className={cn(
          "text-sm font-medium transition-all duration-300 hover:text-gold flex items-center gap-1.5 py-2 px-4 rounded-lg group relative overflow-hidden",
          "text-foreground/90 hover:bg-sand-light/50" // Simplified for now, parent can pass more classes
        )}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent rounded-lg scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
        <span className="relative z-10">Collections</span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-all duration-500 relative z-10",
          isVisible && "rotate-180 text-gold"
        )} />
      </button>
      
      <div className={cn(
        "absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[680px] bg-white/98 backdrop-blur-2xl rounded-3xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden transition-all duration-500 ease-out",
        isVisible 
          ? "opacity-100 visible translate-y-0 scale-100" 
          : "opacity-0 invisible -translate-y-6 scale-95 pointer-events-none"
      )}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-amber-50/30 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        {/* Header */}
        <div className="relative px-6 pt-5 pb-3 border-b border-sand-light/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-taupe-dark flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-gold to-amber-400 rounded-full" />
                Explore Collections
              </h3>
              <p className="text-xs text-muted-foreground/70 mt-1">Discover our curated wellness categories</p>
            </div>
            <div className="text-xs font-medium text-gold bg-gold/10 px-3 py-1.5 rounded-full">
              {categories.length} Categories
            </div>
          </div>
        </div>
        
        {/* Category Grid */}
        <div className="relative p-4 max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group/cat relative flex flex-col gap-2 p-4 rounded-2xl hover:bg-gradient-to-br hover:from-sand-light/60 hover:to-amber-50/40 transition-all duration-300 animate-fade-up border border-transparent hover:border-gold/20 hover:shadow-lg"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Icon Container */}
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-sand-light/80 to-amber-50/60 flex items-center justify-center group-hover/cat:from-gold/15 group-hover/cat:to-amber-100/50 transition-all duration-300 group-hover/cat:shadow-md group-hover/cat:scale-105">
                  <span className="text-2xl transition-transform duration-300 group-hover/cat:scale-110 relative z-10">
                    {category.icon}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/20 rounded-xl opacity-0 group-hover/cat:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Category Info */}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground group-hover/cat:text-taupe-dark transition-colors leading-tight mb-1">
                    {category.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground/60 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
                
                {/* Product Count Badge */}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground/70 font-medium">
                    {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-muted-foreground/40 group-hover/cat:text-gold group-hover/cat:translate-x-0.5 transition-all duration-300" />
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/0 via-transparent to-amber-200/0 opacity-0 group-hover/cat:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </Link>
            ))}
          </div>
        </div>
        
        {/* Footer with CTA */}
        <div className="relative px-6 py-4 bg-gradient-to-t from-sand-light/30 to-transparent border-t border-sand-light/40">
          <Link 
            href="/products"
            className="flex items-center justify-center gap-2 text-sm font-medium text-taupe hover:text-taupe-dark transition-colors group/footer"
          >
            <span>View All Products</span>
            <ChevronDown className="h-4 w-4 -rotate-90 group-hover/footer:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  )
}
