"use client"

import React from "react"
import { useRef, useEffect, useState } from 'react'
import { Send, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function NewsletterSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      setEmail('')
    } catch (error) {
      console.error('Subscription failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-br from-sand-light via-cream to-sand-light/50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute top-20 right-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-olive/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className={cn(
          "max-w-2xl mx-auto text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          {/* Icon */}
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white shadow-lg mb-6">
            <Gift className="h-8 w-8 text-gold" />
          </div>

          {/* Header */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-balance">
            Get <span className="text-gradient">10% Off</span> Your First Order
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Subscribe to our newsletter for exclusive offers, wellness tips, and early access to new products.
          </p>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-white border-border/50 focus:border-gold focus:ring-gold/20"
                suppressHydrationWarning
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-6 bg-taupe hover:bg-taupe-dark text-white btn-premium gap-2"
                suppressHydrationWarning
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Subscribing...</span>
                ) : (
                  <>
                    Subscribe
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="mt-8 p-6 bg-white rounded-2xl border border-olive/20 max-w-md mx-auto animate-scale-in">
              <div className="h-12 w-12 rounded-full bg-olive/10 flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">You{"'"}re In!</h3>
              <p className="text-muted-foreground text-sm mt-2">
                Check your email for your exclusive 10% discount code.
              </p>
            </div>
          )}

          {/* Trust text */}
          <p className="text-xs text-muted-foreground mt-4">
            No spam, ever. Unsubscribe anytime. By subscribing, you agree to our Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  )
}
