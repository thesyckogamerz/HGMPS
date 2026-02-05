"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, MessageCircle, MapPin, Phone, Mail, Send, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { categories } from '@/lib/products'
import { cn } from '@/lib/utils'

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/hakeem.mohsan/', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/hgmohsan', label: 'Instagram' },
  { icon: Twitter, href: 'https://pk.linkedin.com/in/hakeem-mohsan-46563467', label: 'Twitter' },
  { icon: MessageCircle, href: 'https://wa.me/923006912422?text=${message}`, "_blank"', label: 'WhatsApp' },
]

const paymentMethods = ['JazzCash', 'Easypaisa', 'Bank Transfer', 'COD']

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setEmail('')
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <footer className="bg-taupe-dark text-white pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-serif font-semibold text-gold">Hakeem Mohsin Store</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Premium natural and herbal products for your wellness journey. 
              Experience the finest botanical formulations crafted with care.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-gold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-white/70 hover:text-gold transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-gold transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-white/70 hover:text-gold transition-colors text-sm">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-gold transition-colors text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white/70 hover:text-gold transition-colors text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-white/70 hover:text-gold transition-colors text-sm">
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-lg mb-6 text-gold">Stay Updated</h3>
            <p className="text-white/70 text-sm mb-4">
              Subscribe to our newsletter for exclusive offers and wellness tips.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative max-w-md">
              <div className="relative flex items-center">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 pr-12 focus:border-gold focus:ring-gold/20"
                  required
                  suppressHydrationWarning
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isSubmitting || isSubmitted}
                  className={cn(
                    "absolute right-1 w-10 h-10 rounded-lg transition-all duration-300",
                    isSubmitted ? "bg-green-500 hover:bg-green-600" : "bg-gold hover:bg-gold/90 text-taupe-dark"
                  )}
                  suppressHydrationWarning
                >
                  {isSubmitted ? <Check className="h-4 w-4 text-white" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              {isSubmitted && (
                <p className="absolute -bottom-6 left-0 text-xs text-green-400 animate-fade-in">
                  Thanks for subscribing!
                </p>
              )}
            </form>

            <div className="mt-8">
              <h4 className="font-medium text-sm mb-3 text-gold">Contact Us</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold" />
                  Sahiwal,Sahiwal,Pakistan
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gold" />
                  hgmohsan@gmail.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gold" />
                  +92 3086900134
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center md:text-left" suppressHydrationWarning>
            © {currentYear} Hakeem Mohsin Store. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/50 hover:text-gold transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/50 hover:text-gold transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
