"use client"

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { products, formatPrice } from '@/lib/products'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'

export function ParallaxShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { addItem } = useCart()

  // Select 4 highlight products
  const highlightProducts = [
    products.find(p => p.id === 'ashwagandha-gold'),
    products.find(p => p.id === 'collagen-peptides'),
    products.find(p => p.id === 'sleep-blend'),
    products.find(p => p.id === 'korean-ginseng'),
  ].filter(Boolean)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const progress = Math.max(0, Math.min(1, 1 - (rect.top / windowHeight)))
        setScrollProgress(progress)
      }
    }

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

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-sand-light/50 to-cream"
        style={{
          transform: `translateY(${scrollProgress * 50}px)`,
        }}
      />
      
      {/* Floating decorative elements with parallax */}
      <div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-olive/10 blur-2xl"
        style={{
          transform: `translateY(${scrollProgress * -100}px)`,
        }}
      />
      <div
        className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-gold/10 blur-3xl"
        style={{
          transform: `translateY(${scrollProgress * -80}px)`,
        }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-taupe/10 blur-2xl"
        style={{
          transform: `translateY(${scrollProgress * -60}px)`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "text-center max-w-2xl mx-auto mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <span className="text-gold font-medium text-sm uppercase tracking-widest">Premium Selection</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mt-4 text-balance">
            Bestsellers of <span className="text-gradient">the Season</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Experience our most celebrated formulas, trusted by thousands for their transformative benefits.
          </p>
        </div>

        {/* Products Grid with Staggered Animation */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {highlightProducts.map((product, index) => {
            if (!product) return null
            
            const isLeft = index % 2 === 0
            const parallaxOffset = isLeft ? scrollProgress * 30 : scrollProgress * -30

            return (
              <div
                key={product.id}
                className={cn(
                  "group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-border/30 transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                )}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  transform: isVisible ? `translateY(${parallaxOffset}px)` : undefined,
                }}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-sand-light overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-gold text-white rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(product.rating)
                              ? "fill-gold text-gold"
                              : "fill-muted text-muted"
                          )}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground group-hover:text-taupe transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-taupe">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => addItem(product)}
                        size="sm"
                        className="bg-taupe hover:bg-taupe-dark text-white btn-premium"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 border-2 border-gold/0 rounded-3xl group-hover:border-gold/30 transition-colors pointer-events-none" />
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className={cn(
          "text-center mt-12 transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <Link href="/products">
            <Button size="lg" className="bg-taupe hover:bg-taupe-dark text-white h-14 px-8 btn-premium group">
              Discover All Bestsellers
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
