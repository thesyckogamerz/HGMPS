"use client"

import { useRef, useEffect, useState } from 'react'
import { Leaf, Shield, Award, Truck, HeadphonesIcon, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const trustBadges = [
  {
    icon: Leaf,
    title: '100% Natural',
    description: 'Pure botanical ingredients sourced from certified organic farms',
  },
  {
    icon: Shield,
    title: 'Lab Tested',
    description: 'Third-party verified for purity, potency, and safety',
  },
  {
    icon: Award,
    title: 'GMP Certified',
    description: 'Manufactured in GMP-compliant facilities',
  },
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'Free shipping on orders above Rs. 2,000',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Support',
    description: 'WhatsApp support available 7 days a week',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '7-day hassle-free return policy',
  },
]

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '200+', label: 'Natural Products' },
  { value: '4.8', label: 'Average Rating' },
  { value: '5+', label: 'Years of Trust' },
]

export function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState(stats.map(() => 0))

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

  // Animate counters when visible
  useEffect(() => {
    if (isVisible) {
      const targets = [50, 200, 4.8, 5]
      const duration = 2000
      const steps = 60
      const interval = duration / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        setCounters(targets.map((target) => {
          const progress = step / steps
          const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic
          return Number((target * eased).toFixed(1))
        }))

        if (step >= steps) {
          clearInterval(timer)
          setCounters(targets)
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [isVisible])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-taupe text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="trust-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#trust-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Stats Section */}
        <div className={cn(
          "grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-gold" suppressHydrationWarning>
                {index === 2 ? counters[index].toFixed(1) : Math.round(counters[index])}
                {index < 2 ? 'K+' : index === 3 ? '+' : ''}
              </div>
              <p className="text-white/70 mt-2 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className={cn(
          "text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <span className="text-gold font-medium text-sm uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mt-4 text-balance">
            The AUREXA <span className="text-gold">Promise</span>
          </h2>
          <p className="text-white/70 mt-4 text-lg leading-relaxed">
            We{"'"}re committed to delivering the highest quality natural products with exceptional service.
          </p>
        </div>

        {/* Trust Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className={cn(
                "group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500",
                "hover:bg-white/10 hover:border-gold/30",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/30 transition-colors">
                  <badge.icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{badge.title}</h3>
                  <p className="text-white/60 text-sm mt-1 leading-relaxed">{badge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
