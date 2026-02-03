"use client"

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavLinksProps {
  isScrolled: boolean
  className?: string
}

export function NavLinks({ isScrolled, className }: NavLinksProps) {
  const items = [
    { name: 'Home', href: '/' },
    { name: 'All Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className={cn("hidden lg:flex items-center gap-8", className)}>
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-all duration-300 hover:text-gold relative group py-2",
            isScrolled ? "text-foreground/90" : "text-taupe-dark"
          )}
        >
          <span className="relative z-10">{item.name}</span>
          <span className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent rounded-lg scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
          <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-gold to-amber-200 group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out" />
        </Link>
      ))}
    </nav>
  )
}
