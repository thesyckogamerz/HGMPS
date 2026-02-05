"use client"

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { categories } from '@/lib/products'
import { cn } from '@/lib/utils'

export function CategoriesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  const categoryIcons: Record<string, string> = {
    adaptogens: '🌿',
    immunity: '🛡️',
    digestive: '🌱',
    sleep: '🌙',
    beauty: '✨',
    energy: '⚡',
    'common-items': '🏷️',
    herbs: '🌿',
    'natural-items': '🍃',
    'pure-arqiyat': '💧',
    'murabba-jat': '🍯',
    honey: '🍯',
    'premium-items': '👑',
    'dry-fruit': '🥜',
    'special-powders': '⚗️',
  }

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sand-light/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "text-center max-w-2xl mx-auto mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <span className="text-gold font-medium text-sm uppercase tracking-widest">Explore Our Range</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mt-4 text-balance">
            Our Product <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Discover our carefully curated categories, each designed to support a different aspect of your health journey.
          </p>
        </div>

        {/* Categories Grid/Scroll */}
        <div className={cn(
          "flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-x-visible pb-8 lg:pb-0 scrollbar-hide snap-x snap-mandatory px-4 md:px-0",
          "mx-[-1rem] md:mx-0"
        )}>
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className={cn(
                "group relative bg-white rounded-3xl overflow-hidden border border-border/50 transition-all duration-500",
                "hover:shadow-2xl hover:-translate-y-2",
                "min-w-[280px] sm:min-w-0 snap-center",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card Content */}
              <div className="p-8 relative z-10">
                {/* Icon */}
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sand-light to-cream flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-3xl shadow-sm">
                  {categoryIcons[category.id]}
                </div>

                {/* Text */}
                <h3 className="text-xl font-semibold text-foreground group-hover:text-taupe transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {category.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">
                    {category.productCount} Products
                  </span>
                  <div className="flex items-center gap-1 text-gold font-medium text-sm group-hover:gap-2 transition-all">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Hover Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-sand-light/0 via-gold/0 to-olive/0 group-hover:from-sand-light/30 group-hover:via-gold/10 group-hover:to-olive/5 transition-all duration-500" />
              
              {/* Decorative corner */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
