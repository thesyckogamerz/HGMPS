"use client"

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { cn } from '@/lib/utils'

export function FeaturedProducts({ products: allProducts = [] }: { products?: any[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Use all passed products (which are already randomized and sliced on the server)
  const showcaseProducts = allProducts

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
      const scrollAmount = 400
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
    <section ref={sectionRef} className="py-24 md:py-36 bg-[#fdfaf5] relative overflow-hidden">
      {/* Premium Decorative elements */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-olive/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        )}>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold font-bold text-xs uppercase tracking-[0.3em]">Exotic Selection</span>
              <Sparkles className="h-3 w-3 text-gold animate-bounce" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-taupe-dark leading-[1.1]">
              Today's <span className="text-gold italic font-normal">Featured</span> Discoveries
            </h2>
            <p className="text-taupe/70 mt-6 text-lg max-w-xl leading-relaxed">
              Every refresh brings new treasures. Explore our handpicked collection of premium organics and traditional remedies, curated specifically for your wellness journey.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-6">
             <div className="flex gap-3">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  "h-12 w-12 rounded-full border border-gold/20 flex items-center justify-center transition-all bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold hover:text-white hover:border-gold group",
                )}
                aria-label="Previous products"
              >
                <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  "h-12 w-12 rounded-full border border-gold/20 flex items-center justify-center transition-all bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold hover:text-white hover:border-gold group",
                )}
                aria-label="Next products"
              >
                <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            
            <Link href="/products">
              <Button variant="outline" className="h-14 px-8 border-taupe/20 text-taupe hover:bg-taupe hover:text-white rounded-full transition-all group overflow-hidden relative" suppressHydrationWarning>
                <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                  Explore Full Collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative group/carousel">
          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-12 -mx-4 px-4 snap-x snap-mandatory"
          >
            {showcaseProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className={cn(
                  "flex-shrink-0 w-[280px] sm:w-[320px] snap-start transition-all duration-1000 ease-out",
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="snap-start">
                  <ProductCard product={product} index={index} />
                </div>
              </div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#fdfaf5] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#fdfaf5] to-transparent pointer-events-none z-10" />
        </div>

        {/* Mobile Progress Bar */}
        <div className="mt-8 md:hidden h-1 w-full bg-gold/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gold transition-all duration-300" 
            style={{ width: `${canScrollRight ? (canScrollLeft ? '50%' : '20%') : '100%'}` }}
          />
        </div>
      </div>
    </section>
  )
}
