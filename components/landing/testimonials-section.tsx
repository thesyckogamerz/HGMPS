"use client"

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TestimonialCard } from '@/components/ui/testimonial-card'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    location: 'Karachi',
    avatar: '/images/avatars/avatar-1.jpg',
    rating: 5,
    text: 'The Ashwagandha Gold has completely transformed my stress levels. I feel more balanced and energetic throughout the day. Best quality I\'ve found in Pakistan!',
    product: 'Ashwagandha Gold Extract',
  },
  {
    id: 2,
    name: 'Ali Raza',
    location: 'Lahore',
    avatar: '/images/avatars/avatar-2.jpg',
    rating: 5,
    text: 'Finally found a reliable source for premium supplements. The Marine Collagen has done wonders for my skin. Fast delivery and excellent packaging.',
    product: 'Marine Collagen Peptides',
  },
  {
    id: 3,
    name: 'Fatima Khan',
    location: 'Islamabad',
    avatar: '/images/avatars/avatar-3.jpg',
    rating: 5,
    text: 'The Deep Sleep Blend is a game-changer! I\'ve struggled with sleep for years, and this is the first natural product that actually works. Highly recommend AUREXA!',
    product: 'Deep Sleep Herbal Blend',
  },
  {
    id: 4,
    name: 'Hassan Malik',
    location: 'Rawalpindi',
    avatar: '/images/avatars/avatar-4.jpg',
    rating: 5,
    text: 'Korean Red Ginseng has given me sustained energy without the crash. Quality is exceptional, and customer service was very helpful with my questions.',
    product: 'Korean Red Ginseng',
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

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

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-olive/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "text-center max-w-2xl mx-auto mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <span className="text-gold font-medium text-sm uppercase tracking-widest">Customer Love</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mt-4 text-balance">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Join thousands of satisfied customers who have transformed their wellness journey with AUREXA.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={cn(
                "transition-all duration-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <TestimonialCard
                name={testimonial.name}
                location={testimonial.location}
                avatar={testimonial.avatar}
                rating={testimonial.rating}
                text={testimonial.text}
                product={testimonial.product}
              />
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-2"
                >
                  <div className="bg-white rounded-2xl p-6 border border-border/50">
                    <Quote className="h-8 w-8 text-gold/30 mb-4" />

                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < testimonial.rating
                              ? "fill-gold text-gold"
                              : "fill-muted text-muted"
                          )}
                        />
                      ))}
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {`"${testimonial.text}"`}
                    </p>

                    <p className="text-xs text-gold font-medium mb-4">
                      Purchased: {testimonial.product}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="h-10 w-10 rounded-full bg-sand-light overflow-hidden flex items-center justify-center text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  activeIndex === index ? "w-8 bg-taupe" : "w-2 bg-border"
                )}
                suppressHydrationWarning
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
