"use client"

import { useRef, useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { products, type Product, formatPrice } from '@/lib/products'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { addItem } = useCart()

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const yNegative = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Select highlight products with fallbacks
  const highlightProducts = useMemo(() => {
    const productIds = [
      'ashwagandha-gold',
      'collagen-peptides', 
      'sleep-blend',
      'korean-ginseng'
    ]
    
    return productIds
      .map(id => products.find(p => p.id === id))
      .filter((product): product is Product => product !== undefined)
      .slice(0, 4)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const handleAddToCart = (product: Product) => {
    if (product) {
      addItem(product)
    }
  }

  // Fallback image if product image is missing
  const getImageUrl = (product: Product) => {
    return product.image || '/images/placeholder-product.jpg'
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <motion.section 
      ref={sectionRef}
      style={{ opacity }}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Parallax Background Elements */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 bg-gradient-to-b from-background via-sand-light/50 to-cream"
      />
      
      <motion.div 
        style={{ y: yNegative }}
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-olive/10 blur-2xl"
      />
      <motion.div 
        style={{ y }}
        className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-gold/10 blur-3xl"
      />
      <motion.div 
        style={{ y: yNegative }}
        className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-taupe/10 blur-2xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-gold font-medium text-sm uppercase tracking-widest">
            Premium Selection
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mt-4 text-balance">
            Bestsellers of <span className="text-gradient bg-gradient-to-r from-gold to-olive bg-clip-text text-transparent">the Season</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Experience our most celebrated formulas, trusted by thousands for their transformative benefits.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {highlightProducts.map((product, index) => {
            const isLeft = index % 2 === 0
            const parallaxY = isLeft ? yNegative : y

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                style={{ y: parallaxY }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-border/30 hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row h-full">
                  {/* Image Container */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-sand-light to-sand/30 overflow-hidden">
                    <Image
                      src={getImageUrl(product)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 192px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={index < 2}
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-gold text-white rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4 transition-colors",
                            i < Math.floor(product.rating)
                              ? "fill-gold text-gold"
                              : "fill-muted/20 text-muted"
                          )}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({product.reviews?.toLocaleString() || '0'})
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-taupe transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">
                      {product.description}
                    </p>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-taupe">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        size="sm"
                        className="bg-taupe hover:bg-taupe-dark text-white transition-colors duration-300"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent rounded-3xl group-hover:border-gold/30 transition-colors duration-300 pointer-events-none" />
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link href="/products">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-taupe to-taupe-dark hover:from-taupe-dark hover:to-taupe text-white h-14 px-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Discover All Bestsellers
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}