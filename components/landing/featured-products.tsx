"use client"

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { cn } from '@/lib/utils'

export function FeaturedProducts({ products: allProducts = [] }: { products?: any[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Use passed products or fallback to empty array
  // Filter for featured/showcase
  const featuredProducts = allProducts.filter(p => p.badge).slice(0, 8)
  // If no featured products found in DB/List, just take the first 8
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 8)
  
  const showcaseProducts = allProducts.slice(0, 8)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll)
      checkScroll()
      return () => scrollEl.removeEventListener('scroll', checkScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-sand-light/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-olive/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div>
            <span className="text-gold font-medium text-sm uppercase tracking-widest">Handpicked For You</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mt-4 text-balance">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              Our most loved products, selected for their exceptional quality and proven benefits.
            </p>
          </div>

          <Link href="/products">
            <Button variant="outline" className="border-taupe text-taupe hover:bg-taupe hover:text-white gap-2 group bg-transparent" suppressHydrationWarning>
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 h-12 w-12 rounded-full bg-white shadow-lg border border-border/50 flex items-center justify-center transition-all hover:scale-110",
              "hidden md:flex",
              !canScrollLeft && "opacity-0 pointer-events-none"
            )}
            suppressHydrationWarning
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 h-12 w-12 rounded-full bg-white shadow-lg border border-border/50 flex items-center justify-center transition-all hover:scale-110",
              "hidden md:flex",
              !canScrollRight && "opacity-0 pointer-events-none"
            )}
            suppressHydrationWarning
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          >
            {showcaseProducts.map((product, index) => (
              <div
                key={product.id}
                className={cn(
                  "flex-shrink-0 w-[280px] sm:w-[300px] transition-all duration-700 ease-out",
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          <div className="h-1 w-12 rounded-full bg-taupe" />
          <div className="h-1 w-12 rounded-full bg-border" />
          <div className="h-1 w-12 rounded-full bg-border" />
        </div>
      </div>
    </section>
  )
}

