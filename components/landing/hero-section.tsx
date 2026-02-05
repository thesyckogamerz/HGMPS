"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Leaf, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-cream via-sand-light to-background"
      aria-label="Hero Section"
    >
      {/* Animated Background Elements - Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Floating botanical shapes */}
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-olive/5 blur-3xl animate-float will-change-transform"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          }}
        />
        <div
          className="absolute top-40 right-20 w-96 h-96 rounded-full bg-gold/5 blur-3xl animate-float-slow will-change-transform"
          style={{
            transform: `translate(${-mousePosition.x * 30}px, ${mousePosition.y * 15}px)`,
          }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-72 h-72 rounded-full bg-sand/30 blur-3xl animate-float will-change-transform"
          style={{
            transform: `translate(${mousePosition.x * 25}px, ${-mousePosition.y * 25}px)`,
          }}
        />
        
        {/* Decorative lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-taupe"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gold/20 animate-fade-in shadow-sm hover:shadow-md transition-shadow duration-300">
              <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
              <span className="text-sm font-medium text-taupe">Premium Natural Wellness</span>
            </div>

            {/* Headline with Fluid Typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight animate-slide-up tracking-tight">
              <span className="text-foreground">Nature{"'"}s </span>
              <span className="text-gradient">Finest</span>
              <br />
              <span className="text-foreground">For Your </span>
              <span className="text-taupe">Wellness</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-slide-up delay-200 leading-relaxed text-balance">
              Discover premium herbal and botanical products crafted with care. 
              From adaptogens to beauty essentials, embrace the power of nature.
            </p>

            {/* CTA Buttons - Touch Optimized */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up delay-300">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-taupe hover:bg-taupe-dark text-white h-14 px-8 text-base btn-premium group touch-manipulation" suppressHydrationWarning>
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-taupe text-taupe hover:bg-taupe hover:text-white bg-transparent touch-manipulation" suppressHydrationWarning>
                  Our Story
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 animate-fade-in delay-500">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-10 w-10 rounded-full bg-olive/10 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-olive" aria-hidden="true" />
                </div>
                <span>100% Natural</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-gold" aria-hidden="true" />
                </div>
                <span>Lab Tested</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-10 w-10 rounded-full bg-taupe/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-taupe" aria-hidden="true" />
                </div>
                <span>Premium Quality</span>
              </div>
            </div>
          </div>

          {/* Right - Hero Visual (Responsive Component) */}
          <div className="relative w-full max-w-[500px] aspect-square mx-auto lg:mx-0">
            <div className="relative w-full h-full">
              {/* Rotating border - The specific requested div transformation */}
              <div 
                className="absolute inset-0 rounded-full border-2 border-dashed border-gold/30 animate-spin will-change-transform" 
                style={{ animationDuration: '20s' }} 
                aria-hidden="true"
              />
              
              {/* Inner circle with gradient */}
              <div className="absolute inset-4 md:inset-8 rounded-full bg-gradient-to-br from-sand-light via-cream to-white shadow-2xl flex items-center justify-center backdrop-blur-sm bg-white/50">
                <div className="text-center space-y-2 md:space-y-4 p-4 md:p-8">
                  <div className="text-5xl md:text-6xl animate-float" role="img" aria-label="Leaf icon">🌿</div>
                  <h3 className="text-xl md:text-2xl font-serif font-semibold text-taupe">Botanical Excellence</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">Crafted with Nature{"'"}s Wisdom</p>
                </div>
              </div>

              {/* Floating Product Cards - Responsive */}
              <div className="block">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 md:-top-4 animate-scale-in z-20" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 md:p-4 animate-float hover:scale-105 transition-transform duration-300 scale-75 md:scale-100 origin-bottom">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl bg-olive/10 flex items-center justify-center text-lg md:text-2xl">🍃</div>
                      <div>
                        <p className="font-medium text-xs md:text-sm">Adaptogens</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">Stress Relief</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[20%] -right-2 md:top-1/4 md:-right-8 animate-scale-in z-20" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 md:p-4 animate-float hover:scale-105 transition-transform duration-300 scale-75 md:scale-100 origin-left">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl bg-gold/10 flex items-center justify-center text-lg md:text-2xl">✨</div>
                      <div>
                        <p className="font-medium text-xs md:text-sm">Beauty</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">Glow Within</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[20%] -left-2 md:bottom-1/4 md:-left-8 animate-scale-in z-20" style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 md:p-4 animate-float hover:scale-105 transition-transform duration-300 scale-75 md:scale-100 origin-right">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl bg-taupe/10 flex items-center justify-center text-lg md:text-2xl">🌙</div>
                      <div>
                        <p className="font-medium text-xs md:text-sm">Sleep</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">Rest Well</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:-bottom-4 md:left-1/3 md:translate-x-0 animate-scale-in z-20" style={{ animationDelay: '2s', animationFillMode: 'both' }}>
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 md:p-4 animate-float hover:scale-105 transition-transform duration-300 scale-75 md:scale-100 origin-top">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl bg-olive-light/20 flex items-center justify-center text-lg md:text-2xl">⚡</div>
                      <div>
                        <p className="font-medium text-xs md:text-sm">Energy</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">Stay Vital</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Accessible */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce block" aria-hidden="true">
        <div className="w-6 h-10 rounded-full border-2 border-taupe/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-taupe/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
